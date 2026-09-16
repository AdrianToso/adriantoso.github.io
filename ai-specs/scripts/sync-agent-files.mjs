#!/usr/bin/env node
// Sincroniza las copias para cada agente desde las fuentes canónicas (reemplaza a los symlinks de Specboot).
//   ai-specs/skills/<skill>/  -> .claude/skills/<skill>/, .cursor/skills/<skill>/
//   ai-specs/agents/<a>.md    -> .claude/agents/<a>.md, .cursor/agents/<a>.md
//   docs/base-standards.md    -> CLAUDE.md, AGENTS.md, GEMINI.md, codex.md
//
// Uso: node ai-specs/scripts/sync-agent-files.mjs [--check] [--force]
//   --check  solo verifica; termina con código 1 si hay diferencias o conflictos (2 si hay un error)
//   --force  sobrescribe también copias editadas a mano y archivos que el script no administra
//
// ai-specs/sync-manifest.json guarda el hash de cada copia generada: si una copia ya no coincide, alguien la
// editó a mano y no se pisa sin --force. ai-specs/external-entries.json registra, con su motivo, las skills y
// los agentes que viven solo en .claude/ o .cursor/.
//
// Enlaces (symlinks, junctions de Windows y hardlinks): nunca se lee, se escribe ni se borra a través de uno.
// En las fuentes o en los archivos de control cortan la ejecución; en las copias son conflictos.
import { spawnSync } from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const USAGE = 'Uso: node ai-specs/scripts/sync-agent-files.mjs [--check] [--force]';
const args = process.argv.slice(2);
const unknownArgs = args.filter(arg => arg !== '--check' && arg !== '--force');
if (unknownArgs.length) {
  console.error(`Error: argumento desconocido: ${unknownArgs.join(' ')}\n${USAGE}`);
  process.exit(2);
}
const checkOnly = args.includes('--check');
const force = args.includes('--force');

// Cualquier error inesperado (permisos, E/S) sale con código 2 y un mensaje, no con un stack trace.
process.on('uncaughtException', error => {
  console.error(`Error: ${error.message}`);
  process.exit(2);
});

// Raíz desde la ruta invocada (process.argv[1] conserva los enlaces; import.meta.url los resuelve).
const root = path.resolve(path.dirname(path.resolve(process.argv[1])), '..', '..');
const MANIFEST = 'ai-specs/sync-manifest.json';
const EXTERNAL_ENTRIES = 'ai-specs/external-entries.json';
const TOOL_DIRS = ['.claude', '.cursor'];
const STRUCTURAL_DIRS = TOOL_DIRS.flatMap(toolDir => [toolDir, `${toolDir}/skills`, `${toolDir}/agents`]);
const RULES_SOURCE = 'docs/base-standards.md';
const RULES_COPIES = ['CLAUDE.md', 'AGENTS.md', 'GEMINI.md', 'codex.md'];
// .git: una skill que sea un repo o submódulo no se copia con su historial.
const IGNORED_NAMES = new Set(['.DS_Store', 'Thumbs.db', 'desktop.ini', '.git']);
const OPENSPEC_PREFIX = 'openspec-';
const MANAGED_PATH = /^\.(?:claude|cursor)\/(?:skills\/[^/]+\/.+|agents\/[^/]+\.md)$/;

const abs = relativePath => path.join(root, relativePath);
const warn = message => console.error(`Aviso: ${message}`);
const fail = message => {
  console.error(`Error: ${message}`);
  process.exit(2);
};

// lstat: no sigue el último componente. Para no seguir los intermedios, usar firstNonDirAncestor antes.
function lstatOf(relativePath) {
  try {
    return fs.lstatSync(abs(relativePath));
  } catch (error) {
    if (error.code === 'ENOENT' || error.code === 'ENOTDIR') return null;
    throw error;
  }
}

// En Windows, lstat informa como carpeta una junction a un volumen (\\?\Volume{…}); el listado de la carpeta
// padre sí la marca como enlace.
function listedAsLink(relativePath) {
  if (process.platform !== 'win32') return false;
  const name = path.posix.basename(relativePath);
  const entries = fs.readdirSync(abs(path.posix.dirname(relativePath)), { withFileTypes: true });
  const entry = entries.find(item => item.name === name) ?? entries.find(item => item.name.toLowerCase() === name.toLowerCase());
  return entry?.isSymbolicLink() ?? false;
}
const isRealDirStat = (relativePath, stat) => stat.isDirectory() && !stat.isSymbolicLink() && !listedAsLink(relativePath);

// Primer ancestro (de arriba hacia abajo) que existe y no es una carpeta real: un archivo, un symlink o una
// junction. Si un ancestro no existe, nada debajo existe. Así nunca se mira a través de un enlace.
function firstNonDirAncestor(relativePath) {
  const segments = relativePath.split('/').slice(0, -1);
  for (let index = 1; index <= segments.length; index++) {
    const dir = segments.slice(0, index).join('/');
    const stat = lstatOf(dir);
    if (!stat) return null;
    if (!isRealDirStat(dir, stat)) return dir;
  }
  return null;
}

// Estado de una ruta sin atravesar enlaces: missing, file, dir, link, other o blocked (ancestro no carpeta).
function kindOf(relativePath) {
  if (firstNonDirAncestor(relativePath)) return 'blocked';
  const stat = lstatOf(relativePath);
  if (!stat) return 'missing';
  if (stat.isSymbolicLink()) return 'link';
  if (stat.isDirectory()) return isRealDirStat(relativePath, stat) ? 'dir' : 'link';
  if (stat.isFile()) return stat.nlink > 1 ? 'hardlink' : 'file';
  return 'other';
}
const isRealDir = relativePath => kindOf(relativePath) === 'dir';

const readJson = relativePath => JSON.parse(fs.readFileSync(abs(relativePath), 'utf8').replace(/^﻿/, ''));

// Texto: CRLF -> LF, para comparar igual en Windows y en CI. Binario (tiene un byte NUL, como detecta git): tal cual.
function normalized(relativePath) {
  const raw = fs.readFileSync(abs(relativePath));
  if (raw.subarray(0, 8000).includes(0)) return raw;
  return Buffer.from(raw.toString('latin1').replace(/\r\n/g, '\n'), 'latin1');
}
const hashOf = relativePath => crypto.createHash('sha256').update(normalized(relativePath)).digest('hex');
const sameContent = (first, second) => normalized(first).equals(normalized(second));

// Entradas directas de una carpeta real (nunca se lista a través de un enlace).
function entriesOf(relativeDir) {
  if (!isRealDir(relativeDir)) return [];
  return fs.readdirSync(abs(relativeDir), { withFileTypes: true }).filter(entry => !IGNORED_NAMES.has(entry.name));
}

// Recorre una carpeta real sin entrar en enlaces. Devuelve archivos, enlaces y otras entradas (sockets, etc.).
function walk(relativeDir) {
  const result = { files: [], links: [], others: [] };
  const visit = dir => {
    for (const entry of entriesOf(dir)) {
      const relativePath = `${dir}/${entry.name}`;
      if (entry.isSymbolicLink()) result.links.push(relativePath);
      else if (entry.isDirectory()) visit(relativePath);
      else if (entry.isFile()) result.files.push(relativePath);
      else result.others.push(relativePath);
    }
  };
  visit(relativeDir);
  result.files.sort();
  return result;
}

function runGit(gitArgs, input) {
  // LC_ALL=C: mensajes en inglés, para reconocerlos aunque git esté traducido.
  return spawnSync('git', gitArgs, {
    cwd: root,
    env: { ...process.env, LC_ALL: 'C' },
    input,
    encoding: 'utf8',
    maxBuffer: 256 * 1024 * 1024,
  });
}

// --- Validaciones previas: fuentes y archivos de control sin enlaces -------------------------------------------

for (const relativePath of ['ai-specs', 'ai-specs/scripts', 'ai-specs/skills', 'ai-specs/agents', 'docs']) {
  const kind = kindOf(relativePath);
  if (kind === 'missing' && relativePath !== 'ai-specs/agents') fail(`falta ${relativePath}/.`);
  if (kind !== 'missing' && kind !== 'dir') fail(`${relativePath} tiene que ser una carpeta real, no un enlace ni un archivo.`);
}
if (kindOf(RULES_SOURCE) !== 'file') fail(`${RULES_SOURCE} tiene que existir y ser un archivo real (no un enlace ni un hardlink).`);
for (const controlFile of [MANIFEST, EXTERNAL_ENTRIES]) {
  const kind = kindOf(controlFile);
  if (kind !== 'missing' && kind !== 'file') fail(`${controlFile} tiene que ser un archivo real, no un enlace ni un hardlink.`);
}

// Git solo se usa si la raíz del proyecto es la raíz del repo; si no, las reglas serían las de otro repositorio.
// --show-cdup da '' en la raíz y no depende de cómo se escribe la ruta (mayúsculas, nombres cortos 8.3).
const gitAvailable = (() => {
  const result = runGit(['rev-parse', '--show-cdup']);
  const consequence = 'no se filtran los archivos ignorados ni se revisan las mayúsculas registradas en git';
  if (result.error?.code === 'ENOENT') {
    warn(`git no está disponible: ${consequence}.`);
    return false;
  }
  if (result.status !== 0 && /not a git repository/i.test(result.stderr ?? '')) {
    warn(`el proyecto no es un repositorio git: ${consequence}.`);
    return false;
  }
  if (result.error || result.status !== 0) {
    fail(`git no se puede usar (${(result.stderr || result.error?.message || `código ${result.status}`).trim()}).`);
  }
  if (result.stdout.trim() !== '') {
    warn(`el proyecto está dentro de otro repositorio git (raíz en ${result.stdout.trim()}): ${consequence}.`);
    return false;
  }
  return true;
})();

// Quita lo que git ignora según sus reglas (--no-index: también si alguien lo versionó con add -f).
// Solo recibe rutas sin enlaces en el camino (git rechaza las rutas "beyond a symbolic link").
function filterGitIgnored(files) {
  const reachable = files.filter(file => !firstNonDirAncestor(file));
  if (!gitAvailable || !reachable.length) return reachable;
  const result = runGit(['check-ignore', '--no-index', '-z', '--stdin'], reachable.join('\0'));
  if (result.error || (result.status !== 0 && result.status !== 1)) {
    fail(`git check-ignore falló: ${(result.stderr || result.error?.message || `código ${result.status}`).trim()}`);
  }
  const ignored = new Set(result.stdout.split('\0').filter(Boolean));
  return reachable.filter(file => !ignored.has(file));
}

// Índice completo, sin pathspec: los pathspecs distinguen mayúsculas incluso con core.ignorecase=true.
const indexPaths = gitAvailable ? runGit(['ls-files', '-z']).stdout.split('\0').filter(Boolean) : [];
const exactIndex = new Set(indexPaths);
const indexByLowerCase = new Map(indexPaths.map(file => [file.toLowerCase(), file]));
// Ruta que git tiene registrada con otras mayúsculas (Windows no la corrige solo, con core.ignorecase=true).
function trackedWithOtherCase(relativePath) {
  if (exactIndex.has(relativePath)) return null;
  const tracked = indexByLowerCase.get(relativePath.toLowerCase());
  return tracked && tracked !== relativePath ? tracked : null;
}

function buildTargets() {
  const targets = new Map();
  const skills = [];
  const skillDirsWithoutSkillMd = [];
  const skillMdCaseIssues = [];
  const sourceLinks = [];
  for (const entry of entriesOf('ai-specs/skills')) {
    const skillDir = `ai-specs/skills/${entry.name}`;
    if (entry.isSymbolicLink()) {
      sourceLinks.push(skillDir);
      continue;
    }
    if (!entry.isDirectory()) continue;
    const names = fs.readdirSync(abs(skillDir));
    if (names.includes('SKILL.md')) {
      skills.push(entry.name);
      sourceLinks.push(...filterGitIgnored(walk(skillDir).links));
      continue;
    }
    const variant = names.find(name => name.toLowerCase() === 'skill.md');
    if (variant) skillMdCaseIssues.push(`${skillDir}/${variant} (tiene que llamarse exactamente SKILL.md)`);
    else skillDirsWithoutSkillMd.push(skillDir);
  }
  const agentEntries = entriesOf('ai-specs/agents').filter(entry => entry.name.endsWith('.md'));
  sourceLinks.push(...agentEntries.filter(entry => entry.isSymbolicLink()).map(entry => `ai-specs/agents/${entry.name}`));
  // Un enlace en las fuentes corta antes de tocar nada: sus copias se tomarían por sobrantes y se borrarían.
  if (sourceLinks.length) {
    fail(`hay enlaces en las fuentes; reemplazalos por archivos o carpetas reales:\n  - ${sourceLinks.join('\n  - ')}`);
  }
  skills.sort();
  const agents = filterGitIgnored(agentEntries.filter(entry => entry.isFile()).map(entry => `ai-specs/agents/${entry.name}`))
    .map(source => path.posix.basename(source))
    .sort();

  for (const toolDir of TOOL_DIRS) {
    for (const skill of skills) {
      const sourceDir = `ai-specs/skills/${skill}`;
      for (const source of filterGitIgnored(walk(sourceDir).files)) {
        targets.set(`${toolDir}/skills/${skill}${source.slice(sourceDir.length)}`, source);
      }
    }
    for (const agent of agents) targets.set(`${toolDir}/agents/${agent}`, `ai-specs/agents/${agent}`);
  }
  for (const copy of RULES_COPIES) targets.set(copy, RULES_SOURCE);
  return { targets, skills, agents, skillDirsWithoutSkillMd, skillMdCaseIssues };
}

function readManifest() {
  if (kindOf(MANIFEST) === 'missing') return { entries: new Map(), valid: true };
  try {
    const data = readJson(MANIFEST);
    if (!data || typeof data.files !== 'object' || data.files === null || Array.isArray(data.files)) {
      throw new Error('formato inesperado');
    }
    const entries = new Map();
    for (const [target, hash] of Object.entries(data.files)) {
      const safePath = (MANAGED_PATH.test(target) || RULES_COPIES.includes(target))
        && !target.includes('\\') && !target.split('/').some(segment => segment === '..' || segment === '.' || segment === '');
      if (safePath && /^[0-9a-f]{64}$/.test(String(hash))) entries.set(target, hash);
      else warn(`se descarta una entrada inválida del manifiesto: ${target}`);
    }
    return { entries, valid: true };
  } catch (error) {
    warn(`${MANIFEST} no se puede leer (${error.message}; ¿conflicto de merge?). Se regenera sin borrar ni pisar copias.`);
    return { entries: new Map(), valid: false };
  }
}

function readExternalEntries() {
  if (kindOf(EXTERNAL_ENTRIES) === 'missing') return new Map();
  let data;
  try {
    data = readJson(EXTERNAL_ENTRIES);
  } catch (error) {
    fail(`${EXTERNAL_ENTRIES} no es JSON válido (${error.message}).`);
  }
  const isPlainObject = value => value !== null && typeof value === 'object' && !Array.isArray(value);
  if (!isPlainObject(data) || (data.entries !== undefined && !isPlainObject(data.entries))) {
    fail(`${EXTERNAL_ENTRIES} tiene un formato inválido: se espera { "entries": { "<ruta>": "<motivo>" } }.`);
  }
  const approved = new Map();
  for (const [key, reason] of Object.entries(data.entries ?? {})) {
    const entryPath = key.replace(/\/+$/, '');
    if (typeof reason !== 'string' || !reason.trim()) {
      warn(`${EXTERNAL_ENTRIES}: la entrada ${key} no tiene un motivo; se ignora.`);
    } else if (!/^\.(?:claude|cursor)\/(?:skills|agents)\/[^/\\]+$/.test(entryPath)) {
      warn(`${EXTERNAL_ENTRIES}: ${key} no tiene la forma .claude/skills/<nombre> o .cursor/agents/<archivo>; se ignora.`);
    } else {
      approved.set(entryPath, reason.trim());
    }
  }
  return approved;
}

// Quita un archivo o un enlace sin tocar el destino del enlace. Nunca borra una carpeta real.
function removeFileOrLink(relativePath) {
  if (firstNonDirAncestor(relativePath)) fail(`no se quita ${relativePath}: su ruta pasa por un enlace.`);
  const stat = lstatOf(relativePath);
  if (!stat) return;
  const isLink = stat.isSymbolicLink() || (stat.isDirectory() && listedAsLink(relativePath));
  if (!stat.isFile() && !isLink) fail(`no se quita ${relativePath}: es una carpeta real.`);
  try {
    // fs.rmSync rechaza las junctions de Windows (EISDIR); unlink quita solo el enlace.
    fs.unlinkSync(abs(relativePath));
  } catch (error) {
    if (!isLink || !['EPERM', 'EISDIR'].includes(error.code)) throw error;
    // rmdir sobre un enlace quita el enlace, no el contenido de su destino.
    fs.rmdirSync(abs(relativePath));
  }
}

function removeEmptyParents(relativePath) {
  let dir = path.posix.dirname(relativePath);
  while (dir !== '.' && !STRUCTURAL_DIRS.includes(dir) && isRealDir(dir) && fs.readdirSync(abs(dir)).length === 0) {
    fs.rmdirSync(abs(dir));
    dir = path.posix.dirname(dir);
  }
}

// --- Clasificación ----------------------------------------------------------------------------------------------

const { targets, skills, agents, skillDirsWithoutSkillMd, skillMdCaseIssues } = buildTargets();
const manifest = readManifest();
const previous = manifest.entries;
const approvedExternal = readExternalEntries();
const editedByHand = target => previous.has(target) && hashOf(target) !== previous.get(target);

const report = { created: [], updated: [], removed: [], replaced: [], external: [], approved: [], openspec: [], emptyDirs: [] };
const conflicts = new Set(skillMdCaseIssues);
const blocked = new Set();
const pathsToReplace = new Set();

// Un enlace en .claude/, .cursor/ o sus skills/ y agents/ no se reemplaza ni con --force: ahí vive contenido que
// el script no administra (OpenSpec, settings, commands) y quitarlo lo desconectaría del proyecto.
const structuralLinks = STRUCTURAL_DIRS.filter(dir => !['missing', 'dir'].includes(kindOf(dir)) && !firstNonDirAncestor(dir));
for (const dir of structuralLinks) {
  conflicts.add(`${dir} (tiene que ser una carpeta real: es un enlace o un archivo; resolvelo a mano, --force no lo toca porque ahí vive contenido que el script no administra)`);
}
const underStructuralLink = relativePath => structuralLinks.some(dir => relativePath === dir || relativePath.startsWith(`${dir}/`));

const linkConflict = linkPath =>
  `${linkPath} (debería ser una carpeta o un archivo real: es un enlace, una junction o un archivo, quizás de Specboot; borralo o usá --force)`;

// Registra un enlace o archivo que bloquea una copia: con --force se quita (solo el enlace), sin --force es conflicto.
const blockerPaths = new Set();
function handleBlocking(blocker, relativePath) {
  blockerPaths.add(blocker);
  if (underStructuralLink(blocker)) {
    blocked.add(relativePath);
    return false;
  }
  if (force) {
    pathsToReplace.add(blocker);
    return true;
  }
  blocked.add(relativePath);
  conflicts.add(linkConflict(blocker));
  return false;
}

for (const [target, source] of targets) {
  const ancestor = firstNonDirAncestor(target);
  if (ancestor) {
    if (handleBlocking(ancestor, target)) report.created.push(target);
    continue;
  }
  const stat = lstatOf(target);
  if (!stat) {
    report.created.push(target);
  } else if (stat.isSymbolicLink()) {
    if (handleBlocking(target, target)) report.created.push(target);
  } else if (!stat.isFile()) {
    blocked.add(target);
    conflicts.add(`${target} (existe pero no es un archivo; revisalo)`);
  } else if (stat.nlink > 1) {
    // Un hardlink comparte contenido con otro archivo (quizás la fuente): escribirlo pisaría ese otro archivo.
    if (force) {
      pathsToReplace.add(target);
      report.created.push(target);
    } else {
      blocked.add(target);
      conflicts.add(`${target} (es un hardlink: comparte contenido con otro archivo; borralo o usá --force)`);
    }
  } else if (!sameContent(target, source)) {
    if (!previous.has(target) && !force) {
      blocked.add(target);
      conflicts.add(`${target} (existe, difiere de ${source} y el script no lo administra; revisalo o usá --force)`);
    } else if (editedByHand(target) && !force) {
      blocked.add(target);
      conflicts.add(`${target} (copia editada a mano; pasá el cambio a ${source} o usá --force para descartarlo)`);
    } else {
      report.updated.push(target);
    }
  }
}

// Copias viejas (su fuente ya no existe): nunca se borran a través de un enlace.
for (const target of previous.keys()) {
  if (targets.has(target)) continue;
  const ancestor = firstNonDirAncestor(target);
  if (ancestor) {
    handleBlocking(ancestor, target);
    continue;
  }
  const stat = lstatOf(target);
  if (!stat) continue;
  if (stat.isSymbolicLink()) {
    handleBlocking(target, target);
  } else if (!stat.isFile()) {
    blocked.add(target);
    conflicts.add(`${target} (estaba administrado pero ya no es un archivo; revisalo)`);
  } else if (stat.nlink > 1 && !force) {
    blocked.add(target);
    conflicts.add(`${target} (es un hardlink: comparte contenido con otro archivo; borralo o usá --force)`);
  } else if (editedByHand(target) && !force) {
    blocked.add(target);
    conflicts.add(`${target} (su fuente ya no existe, pero la copia tiene ediciones a mano; revisala o usá --force)`);
  } else {
    report.removed.push(target);
  }
}

for (const relativePath of [...new Set([...targets.values(), ...targets.keys()])]) {
  const tracked = trackedWithOtherCase(relativePath);
  if (tracked) {
    conflicts.add(`${relativePath} (git la tiene registrada como ${tracked}; ver el escenario "Renombre de mayúsculas" de la skill sync-agent-files)`);
  }
}

// Carpetas de copias: archivos extra, enlaces adentro y restos de skills borradas.
const skillOf = relativePath => relativePath.split('/')[2];
const previousSkills = new Set([...previous.keys()].filter(key => key.includes('/skills/')).map(skillOf));
const previousAgents = new Set([...previous.keys()].filter(key => key.includes('/agents/')).map(key => path.posix.basename(key)));
for (const toolDir of TOOL_DIRS) {
  for (const skill of new Set([...skills, ...previousSkills])) {
    const copyDir = `${toolDir}/skills/${skill}`;
    if (!isRealDir(copyDir)) continue;
    const content = walk(copyDir);
    const removedSkill = !skills.includes(skill);
    for (const file of filterGitIgnored(content.files)) {
      if (targets.has(file) || previous.has(file) || blockerPaths.has(file)) continue;
      conflicts.add(removedSkill
        ? `${file} (archivo que quedó en la copia de una skill que ya no existe; borralo o movelo a ai-specs/)`
        : `${file} (archivo extra en una skill administrada; movelo a ai-specs/skills/${skill}/)`);
    }
    for (const link of filterGitIgnored(content.links)) handleBlocking(link, link);
    for (const other of content.others) conflicts.add(`${other} (entrada que no es archivo ni carpeta; revisala)`);
  }

  const classify = entryPath => {
    if (approvedExternal.has(entryPath)) report.approved.push(`${entryPath}: ${approvedExternal.get(entryPath)}`);
    else report.external.push(entryPath);
  };
  const candidates = [];
  for (const entry of entriesOf(`${toolDir}/skills`)) {
    const entryPath = `${toolDir}/skills/${entry.name}`;
    if (skills.includes(entry.name) || previousSkills.has(entry.name)) continue;
    if (entry.name.startsWith(OPENSPEC_PREFIX) && !entry.isSymbolicLink()) report.openspec.push(entryPath);
    else candidates.push({ entry, entryPath });
  }
  for (const entry of entriesOf(`${toolDir}/agents`)) {
    const entryPath = `${toolDir}/agents/${entry.name}`;
    if (!agents.includes(entry.name) && !previousAgents.has(entry.name)) candidates.push({ entry, entryPath });
  }
  const notIgnored = new Set(filterGitIgnored(candidates.map(candidate => candidate.entryPath)));
  for (const { entry, entryPath } of candidates) {
    if (!notIgnored.has(entryPath)) continue;
    if (entry.isSymbolicLink()) {
      conflicts.add(`${entryPath} (entrada externa que es un enlace; no se admiten enlaces en .claude/ ni .cursor/, aunque estén registrados)`);
    } else if (entry.isDirectory()) {
      const content = walk(entryPath);
      const links = filterGitIgnored(content.links);
      for (const link of links) conflicts.add(`${link} (enlace dentro de una entrada externa; no se admiten enlaces en .claude/ ni .cursor/)`);
      if (!filterGitIgnored(content.files).length && !links.length) report.emptyDirs.push(entryPath);
      else classify(entryPath);
    } else {
      classify(entryPath);
    }
  }
}
for (const entryPath of approvedExternal.keys()) {
  if (kindOf(entryPath) === 'missing') warn(`${EXTERNAL_ENTRIES}: ${entryPath} está registrada pero no existe.`);
}

// Las copias bloqueadas conservan su hash anterior (o quedan sin registrar) hasta resolverse.
const manifestFiles = {};
for (const target of [...new Set([...targets.keys(), ...blocked])].sort()) {
  if (blocked.has(target)) {
    if (previous.has(target)) manifestFiles[target] = previous.get(target);
  } else if (targets.has(target)) {
    manifestFiles[target] = hashOf(targets.get(target));
  }
}
const manifestContent = `${JSON.stringify({
  comment: 'Generado por ai-specs/scripts/sync-agent-files.mjs. No editar; ante un conflicto de merge, quedate con cualquier versión y volvé a ejecutar el script.',
  files: manifestFiles,
}, null, 2)}\n`;
const manifestOutdated = !manifest.valid || kindOf(MANIFEST) === 'missing' || normalized(MANIFEST).toString('utf8') !== manifestContent;

const managedCount = Object.keys(manifestFiles).length;
const pending = report.created.length + report.updated.length + report.removed.length + pathsToReplace.size;
const problems = conflicts.size + report.external.length;
const print = (label, items) => {
  if (!items.length) return;
  console.log(`${label} (${items.length}):`);
  for (const item of items) console.log(`  - ${item}`);
};
const printInventory = () => {
  print(`Entradas externas sin motivo registrado (movelas a ai-specs/ o registralas en ${EXTERNAL_ENTRIES}; ver docs/base-standards.md §6)`, report.external);
  print('Entradas externas registradas (no se tocan)', report.approved);
  print('Carpetas de ai-specs/skills sin SKILL.md (se ignoran)', skillDirsWithoutSkillMd);
  print('Carpetas en .claude/ o .cursor/ sin archivos versionables (se pueden borrar)', report.emptyDirs);
  if (report.openspec.length) console.log(`Skills generadas por OpenSpec (no se tocan): ${report.openspec.length}`);
};
const summary = `${managedCount} archivos (${skills.length} skills, ${agents.length} agentes)`;

if (checkOnly) {
  print('Faltan', report.created);
  print('Desactualizados (cambió la fuente)', report.updated);
  print('Sobrantes', report.removed);
  print('Enlaces o hardlinks que --force reemplazaría', [...pathsToReplace]);
  print('Conflictos', [...conflicts]);
  if (manifestOutdated) console.log(`Manifiesto desactualizado: ${MANIFEST}`);
  printInventory();
  if (pending || problems || manifestOutdated) {
    console.log('\nLas copias no coinciden con las fuentes. Resolvé los conflictos y ejecutá: node ai-specs/scripts/sync-agent-files.mjs');
    process.exit(1);
  }
  console.log(`Copias sincronizadas: ${summary}.`);
  process.exit(0);
}

// --- Escritura ----------------------------------------------------------------------------------------------------

try {
  // Primero se borra y después se escribe: en Windows, un renombre que solo cambia mayúsculas apunta al mismo archivo.
  for (const target of report.removed) {
    const relative = path.relative(root, path.resolve(abs(target)));
    if (!relative || relative.startsWith('..') || path.isAbsolute(relative)) fail(`ruta fuera del proyecto en el manifiesto: ${target}`);
    removeFileOrLink(target);
    removeEmptyParents(target);
  }
  // De la ruta más corta a la más larga; lo que quedó adentro de un enlace ya quitado no se toca.
  for (const replacedPath of [...pathsToReplace].sort((first, second) => first.length - second.length)) {
    if (firstNonDirAncestor(replacedPath)) continue;
    if (!lstatOf(replacedPath)) continue;
    removeFileOrLink(replacedPath);
    report.replaced.push(replacedPath);
  }
  for (const [target, source] of targets) {
    if (blocked.has(target)) continue;
    const listed = report.created.includes(target) || report.updated.includes(target);
    if (!listed && kindOf(target) === 'file') continue;
    if (!listed) report.created.push(target);
    if (firstNonDirAncestor(target)) fail(`no se escribe ${target}: su ruta pasa por un enlace o un archivo.`);
    fs.mkdirSync(path.dirname(abs(target)), { recursive: true });
    // Siempre un archivo nuevo: nunca se escribe a través de un enlace ni de un hardlink.
    if (kindOf(target) !== 'missing') removeFileOrLink(target);
    fs.copyFileSync(abs(source), abs(target));
  }
  if (manifestOutdated) {
    // Archivo temporal + rename: reemplaza la entrada en lugar de escribir sobre un posible hardlink.
    const temporary = `${MANIFEST}.tmp-${process.pid}`;
    fs.writeFileSync(abs(temporary), manifestContent);
    fs.renameSync(abs(temporary), abs(MANIFEST));
  }
} catch (error) {
  fail(`la sincronización quedó a medias (${error.code ?? error.message}). Revisá el estado con --check.`);
}

print('Creados', report.created);
print('Actualizados', report.updated);
print('Eliminados', report.removed);
print('Enlaces o hardlinks reemplazados por la copia (--force)', report.replaced);
print('Conflictos sin resolver', [...conflicts]);
printInventory();
const status = problems ? 'Sincronización incompleta' : pending || manifestOutdated ? 'Sincronización completa' : 'Sin cambios';
console.log(`\n${status}: ${summary} administrados.`);
process.exit(problems ? 1 : 0);

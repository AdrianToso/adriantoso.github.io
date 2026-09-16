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
import { spawnSync } from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const USAGE = 'Uso: node ai-specs/scripts/sync-agent-files.mjs [--check] [--force]';
const args = process.argv.slice(2);
const unknownArgs = args.filter(arg => arg !== '--check' && arg !== '--force');
if (unknownArgs.length) {
  console.error(`Error: argumento desconocido: ${unknownArgs.join(' ')}\n${USAGE}`);
  process.exit(2);
}
const checkOnly = args.includes('--check');
const force = args.includes('--force');

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const MANIFEST = 'ai-specs/sync-manifest.json';
const EXTERNAL_ENTRIES = 'ai-specs/external-entries.json';
const TOOL_DIRS = ['.claude', '.cursor'];
const RULES_SOURCE = 'docs/base-standards.md';
const RULES_COPIES = ['CLAUDE.md', 'AGENTS.md', 'GEMINI.md', 'codex.md'];
const IGNORED_NAMES = new Set(['.DS_Store', 'Thumbs.db', 'desktop.ini']);
const OPENSPEC_PREFIX = 'openspec-';
const MANAGED_PATH = /^\.(?:claude|cursor)\/(?:skills\/[^/]+\/.+|agents\/[^/]+\.md)$/;

const abs = relativePath => path.join(root, relativePath);
// lstat: un symlink no se sigue (se informa como conflicto).
const statOf = relativePath => {
  try {
    return fs.lstatSync(abs(relativePath));
  } catch {
    return null;
  }
};
const exists = relativePath => statOf(relativePath) !== null;
const isDir = relativePath => statOf(relativePath)?.isDirectory() ?? false;
const warn = message => console.error(`Aviso: ${message}`);
const fail = message => {
  console.error(`Error: ${message}`);
  process.exit(2);
};
const readJson = relativePath => JSON.parse(fs.readFileSync(abs(relativePath), 'utf8').replace(/^\uFEFF/, ''));

// Texto: CRLF -> LF, para comparar igual en Windows y en CI. Binario (tiene un byte NUL, como detecta git): tal cual.
function normalized(relativePath) {
  const raw = fs.readFileSync(abs(relativePath));
  if (raw.subarray(0, 8000).includes(0)) return raw;
  return Buffer.from(raw.toString('latin1').replace(/\r\n/g, '\n'), 'latin1');
}
const hashOf = relativePath => crypto.createHash('sha256').update(normalized(relativePath)).digest('hex');
const sameContent = (first, second) => normalized(first).equals(normalized(second));

function dirEntries(relativeDir) {
  if (!isDir(relativeDir)) return [];
  return fs.readdirSync(abs(relativeDir), { withFileTypes: true }).filter(entry => !IGNORED_NAMES.has(entry.name));
}

// Archivos regulares bajo relativeDir, como rutas relativas a la raíz del proyecto.
function walkFiles(relativeDir) {
  const files = [];
  const walk = dir => {
    for (const entry of dirEntries(dir)) {
      const relativePath = `${dir}/${entry.name}`;
      if (entry.isDirectory()) walk(relativePath);
      else if (entry.isFile()) files.push(relativePath);
    }
  };
  walk(relativeDir);
  return files.sort();
}

function runGit(gitArgs, input) {
  return spawnSync('git', gitArgs, { cwd: root, input, encoding: 'utf8', maxBuffer: 256 * 1024 * 1024 });
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
function filterGitIgnored(files) {
  if (!gitAvailable || !files.length) return files;
  const result = runGit(['check-ignore', '--no-index', '-z', '--stdin'], files.join('\0'));
  if (result.error || (result.status !== 0 && result.status !== 1)) {
    fail(`git check-ignore falló: ${(result.stderr || result.error?.message || `código ${result.status}`).trim()}`);
  }
  const ignored = new Set(result.stdout.split('\0').filter(Boolean));
  return files.filter(file => !ignored.has(file));
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
  for (const entry of dirEntries('ai-specs/skills').filter(item => item.isDirectory())) {
    const names = fs.readdirSync(abs(`ai-specs/skills/${entry.name}`));
    if (names.includes('SKILL.md')) {
      skills.push(entry.name);
      continue;
    }
    const variant = names.find(name => name.toLowerCase() === 'skill.md');
    if (variant) skillMdCaseIssues.push(`ai-specs/skills/${entry.name}/${variant} (tiene que llamarse exactamente SKILL.md)`);
    else skillDirsWithoutSkillMd.push(`ai-specs/skills/${entry.name}`);
  }
  skills.sort();
  const agentSources = filterGitIgnored(
    dirEntries('ai-specs/agents').filter(entry => entry.isFile() && entry.name.endsWith('.md')).map(entry => `ai-specs/agents/${entry.name}`),
  );
  const agents = agentSources.map(source => path.posix.basename(source)).sort();

  for (const toolDir of TOOL_DIRS) {
    for (const skill of skills) {
      const sourceDir = `ai-specs/skills/${skill}`;
      for (const source of filterGitIgnored(walkFiles(sourceDir))) {
        targets.set(`${toolDir}/skills/${skill}${source.slice(sourceDir.length)}`, source);
      }
    }
    for (const agent of agents) targets.set(`${toolDir}/agents/${agent}`, `ai-specs/agents/${agent}`);
  }
  for (const copy of RULES_COPIES) targets.set(copy, RULES_SOURCE);
  return { targets, skills, agents, skillDirsWithoutSkillMd, skillMdCaseIssues };
}

function readManifest() {
  if (!exists(MANIFEST)) return { entries: new Map(), valid: true };
  try {
    const data = readJson(MANIFEST);
    if (!data || typeof data.files !== 'object' || data.files === null || Array.isArray(data.files)) {
      throw new Error('formato inesperado');
    }
    const entries = new Map();
    for (const [target, hash] of Object.entries(data.files)) {
      const safePath = (MANAGED_PATH.test(target) || RULES_COPIES.includes(target))
        && !target.includes('\\') && !target.split('/').includes('..');
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
  if (!exists(EXTERNAL_ENTRIES)) return new Map();
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

// Primer ancestro de la ruta que existe pero no es una carpeta real (un archivo o un symlink de Specboot).
function blockingAncestor(relativePath) {
  let dir = path.posix.dirname(relativePath);
  while (dir !== '.') {
    const stat = statOf(dir);
    if (stat && !stat.isDirectory()) return dir;
    dir = path.posix.dirname(dir);
  }
  return null;
}

function removeEmptyParents(relativePath) {
  let dir = path.posix.dirname(relativePath);
  while (dir !== '.' && !TOOL_DIRS.includes(dir) && isDir(dir) && fs.readdirSync(abs(dir)).length === 0) {
    fs.rmdirSync(abs(dir));
    dir = path.posix.dirname(dir);
  }
}

if (!statOf(RULES_SOURCE)?.isFile()) fail(`falta ${RULES_SOURCE}, la fuente de las reglas.`);
const { targets, skills, agents, skillDirsWithoutSkillMd, skillMdCaseIssues } = buildTargets();
const manifest = readManifest();
const previous = manifest.entries;
const approvedExternal = readExternalEntries();
const editedByHand = target => previous.has(target) && hashOf(target) !== previous.get(target);

const report = { created: [], updated: [], removed: [], replaced: [], external: [], approved: [], openspec: [], emptyDirs: [] };
const conflicts = new Set(skillMdCaseIssues);
const blocked = new Set();
const pathsToReplace = new Set();
const blockingPaths = new Set();

for (const [target, source] of targets) {
  const stat = statOf(target);
  if (!stat) {
    const ancestor = blockingAncestor(target);
    if (ancestor) blockingPaths.add(ancestor);
    if (ancestor && !force) {
      blocked.add(target);
      conflicts.add(`${ancestor} (debería ser una carpeta real: es un archivo o un symlink, quizás de Specboot; borralo o usá --force)`);
    } else {
      if (ancestor) pathsToReplace.add(ancestor);
      report.created.push(target);
    }
  } else if (stat.isSymbolicLink() && force) {
    pathsToReplace.add(target);
    report.created.push(target);
  } else if (!stat.isFile()) {
    blocked.add(target);
    conflicts.add(stat.isSymbolicLink()
      ? `${target} (es un symlink; borralo o usá --force para reemplazarlo por la copia)`
      : `${target} (existe pero no es un archivo; revisalo)`);
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
for (const target of previous.keys()) {
  if (targets.has(target)) continue;
  const stat = statOf(target);
  if (!stat) continue;
  if (!stat.isFile()) {
    blocked.add(target);
    conflicts.add(`${target} (estaba administrado pero ya no es un archivo; revisalo)`);
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

const managedPaths = [...targets.keys(), ...previous.keys()];
for (const toolDir of TOOL_DIRS) {
  for (const skill of skills) {
    const copyDir = `${toolDir}/skills/${skill}`;
    for (const file of filterGitIgnored(walkFiles(copyDir))) {
      if (!targets.has(file) && !previous.has(file) && !blockingPaths.has(file)) {
        conflicts.add(`${file} (archivo extra en una skill administrada; movelo a ai-specs/skills/${skill}/)`);
      }
    }
  }
  const classify = entryPath => {
    if (approvedExternal.has(entryPath)) report.approved.push(`${entryPath}: ${approvedExternal.get(entryPath)}`);
    else report.external.push(entryPath);
  };
  const candidates = [];
  for (const entry of dirEntries(`${toolDir}/skills`)) {
    const entryPath = `${toolDir}/skills/${entry.name}`;
    if (skills.includes(entry.name) || managedPaths.some(target => target.startsWith(`${entryPath}/`))) continue;
    if (entry.name.startsWith(OPENSPEC_PREFIX)) report.openspec.push(entryPath);
    else candidates.push(entryPath);
  }
  for (const entry of dirEntries(`${toolDir}/agents`)) {
    const entryPath = `${toolDir}/agents/${entry.name}`;
    if (!agents.includes(entry.name) && !previous.has(entryPath)) candidates.push(entryPath);
  }
  // Lo que git ignora no llega a CI; una carpeta sin archivos versionables solo se informa.
  for (const entryPath of filterGitIgnored(candidates)) {
    if (isDir(entryPath) && !filterGitIgnored(walkFiles(entryPath)).length) report.emptyDirs.push(entryPath);
    else classify(entryPath);
  }
}
for (const entryPath of approvedExternal.keys()) {
  if (!exists(entryPath)) warn(`${EXTERNAL_ENTRIES}: ${entryPath} está registrada pero no existe.`);
}

// Las copias bloqueadas conservan su hash anterior (o quedan sin registrar) hasta resolverse.
const manifestFiles = {};
for (const target of [...new Set([...targets.keys(), ...blocked])].sort()) {
  if (blocked.has(target)) {
    if (previous.has(target)) manifestFiles[target] = previous.get(target);
  } else {
    manifestFiles[target] = hashOf(targets.get(target));
  }
}
const manifestContent = `${JSON.stringify({
  comment: 'Generado por ai-specs/scripts/sync-agent-files.mjs. No editar; ante un conflicto de merge, quedate con cualquier versión y volvé a ejecutar el script.',
  files: manifestFiles,
}, null, 2)}\n`;
const manifestOutdated = !manifest.valid || !exists(MANIFEST) || normalized(MANIFEST).toString('utf8') !== manifestContent;

const managedCount = Object.keys(manifestFiles).length;
const pending = report.created.length + report.updated.length + report.removed.length;
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

// Primero se borra y después se escribe: en Windows, un renombre que solo cambia mayúsculas apunta al mismo archivo.
for (const target of report.removed) {
  const resolved = path.resolve(abs(target));
  const relative = path.relative(root, resolved);
  if (!relative || relative.startsWith('..') || path.isAbsolute(relative)) fail(`ruta fuera del proyecto en el manifiesto: ${target}`);
  fs.rmSync(resolved);
  removeEmptyParents(target);
}
for (const replacedPath of pathsToReplace) {
  fs.rmSync(abs(replacedPath));
  report.replaced.push(replacedPath);
}
for (const [target, source] of targets) {
  if (blocked.has(target)) continue;
  const listed = report.created.includes(target) || report.updated.includes(target);
  if (!listed && exists(target)) continue;
  if (!listed) report.created.push(target);
  fs.mkdirSync(path.dirname(abs(target)), { recursive: true });
  fs.copyFileSync(abs(source), abs(target));
}
if (manifestOutdated) fs.writeFileSync(abs(MANIFEST), manifestContent);

print('Creados', report.created);
print('Actualizados', report.updated);
print('Eliminados', report.removed);
print('Reemplazados por la copia (--force)', report.replaced);
print('Conflictos sin resolver', [...conflicts]);
printInventory();
const status = problems ? 'Sincronización incompleta' : pending || manifestOutdated ? 'Sincronización completa' : 'Sin cambios';
console.log(`\n${status}: ${summary} administrados.`);
process.exit(problems ? 1 : 0);

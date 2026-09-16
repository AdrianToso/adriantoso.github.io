#!/usr/bin/env node
// Arma _site/ con los archivos publicables y valida el index.html publicado.
// Nunca se publican el harness de IA (docs/, ai-specs/, openspec/, .claude/, .cursor/) ni los archivos raíz de
// agentes (CLAUDE.md, AGENTS.md, GEMINI.md, codex.md).
// Uso: node scripts/package-site.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Lista explícita de archivos (no carpetas): si el sitio necesita uno nuevo, agregalo acá.
const SITE_FILES = ['index.html', 'styles.css', 'script.js', 'favicon.svg', 'downloads/Adrian-Toso-CV.pdf'];
const OUTPUT_DIR = '_site';
const EXTERNAL_URL = /^(?:\/\/|(?:https?|mailto|tel|data):)/i;

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = path.join(root, OUTPUT_DIR);
const published = new Set(SITE_FILES);
const errors = [];

fs.rmSync(output, { recursive: true, force: true });
fs.mkdirSync(output);

if (!published.has('index.html')) errors.push("SITE_FILES tiene que incluir 'index.html'.");
for (const file of SITE_FILES) {
  const source = path.join(root, file);
  if (!fs.existsSync(source) || !fs.statSync(source).isFile()) {
    errors.push(`'${file}' está en SITE_FILES pero no existe o no es un archivo.`);
    continue;
  }
  const destination = path.join(output, file);
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.copyFileSync(source, destination);
}

// Atributos de una etiqueta, leídos en orden para no confundir texto dentro de otro valor con un atributo.
function parseAttributes(tag) {
  const attributes = new Map();
  const body = tag.replace(/^<[^\s>/]+/, '').replace(/>$/, '');
  for (const match of body.matchAll(/([^\s"'>/=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+)))?/g)) {
    const name = match[1].toLowerCase();
    if (!attributes.has(name)) attributes.set(name, match[2] ?? match[3] ?? match[4] ?? '');
  }
  return attributes;
}

// URLs de un srcset: cada candidato es una secuencia sin espacios, seguida de descriptores opcionales.
function srcsetUrls(value) {
  const urls = [];
  let index = 0;
  while (index < value.length) {
    while (index < value.length && /[\s,]/.test(value[index])) index++;
    const start = index;
    while (index < value.length && !/\s/.test(value[index])) index++;
    let url = value.slice(start, index);
    if (!url) break;
    if (url.endsWith(',')) url = url.replace(/,+$/, '');
    else while (index < value.length && value[index] !== ',') index++;
    if (url) urls.push(url);
  }
  return urls;
}

// Ruta publicada a la que apunta una referencia local, o un mensaje de error.
function resolveReference(reference) {
  if (reference.includes('\\') || /^[a-z][a-z0-9+.-]*:/i.test(reference)) {
    return { error: 'no es una URL web válida para publicar (¿una ruta local de Windows o un esquema no permitido?)' };
  }
  let decoded;
  try {
    decoded = decodeURIComponent(reference.split(/[?#]/)[0]);
  } catch {
    return { error: 'tiene una codificación inválida' };
  }
  const normalized = path.posix.normalize(decoded.replace(/^\/+/, '') || '.');
  if (normalized === '..' || normalized.startsWith('../')) return { error: `queda fuera de ${OUTPUT_DIR}/ y daría 404 al publicar` };
  const withoutSlash = normalized.replace(/\/+$/, '');
  if (withoutSlash === '' || withoutSlash === '.') return { file: 'index.html' };
  return { file: normalized.endsWith('/') ? `${withoutSlash}/index.html` : withoutSlash };
}

const indexPath = path.join(output, 'index.html');
const localReferences = new Set();
if (fs.existsSync(indexPath)) {
  const html = fs.readFileSync(indexPath, 'utf8').replace(/<!--[\s\S]*?-->/g, '');
  for (const tag of html.match(/<[a-z][^\s>/]*(?:[^>"']|"[^"]*"|'[^']*')*>/gi) ?? []) {
    const tagName = tag.slice(1).split(/[\s>/]/)[0].toLowerCase();
    const attributes = parseAttributes(tag);
    const references = ['href', 'src', 'poster'].filter(name => attributes.has(name)).map(name => attributes.get(name));
    for (const name of ['srcset', 'imagesrcset']) {
      if (attributes.has(name)) references.push(...srcsetUrls(attributes.get(name)));
    }
    for (const reference of references.map(value => value.trim())) {
      if (!reference || reference.startsWith('#') || EXTERNAL_URL.test(reference)) continue;
      localReferences.add(reference);
      const { file, error } = resolveReference(reference);
      if (error) errors.push(`index.html referencia '${reference}', que ${error}.`);
      else if (!published.has(file)) {
        errors.push(`index.html referencia '${reference}', que no se publica ('${file}' no está en SITE_FILES; revisá también las mayúsculas).`);
      }
    }
    // Todo enlace que abre otra pestaña necesita rel="noopener" (docs/frontend-standards.md §3).
    if (tagName === 'a' && attributes.get('target')?.toLowerCase() === '_blank'
      && !/(?:^|\s)noopener(?:\s|$)/i.test(attributes.get('rel') ?? '')) {
      errors.push(`Enlace con target="_blank" sin rel="noopener": ${tag.slice(0, 120)}`);
    }
  }
}

if (errors.length) {
  for (const error of errors) console.error(`Error: ${error}`);
  process.exit(1);
}
console.log(`${OUTPUT_DIR}/ listo: ${SITE_FILES.length} archivos (${localReferences.size} referencias locales verificadas).`);

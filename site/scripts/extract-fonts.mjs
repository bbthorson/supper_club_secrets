// One-off: extract the base64-embedded woff2 fonts from the brand book into
// site/public/fonts/ so the site self-hosts them (no CDN — BRAND.md §3).
//
//   node scripts/extract-fonts.mjs
//
// Source of truth for the embedded fonts is protocol/brand/brand-book.html,
// which carries Fraunces (roman + italic, variable) and Literata (400 roman +
// italic) as `src:url(data:font/woff2;base64,...)`. Archivo (label face) is NOT
// embedded there and is fetched/subset separately — see fonts README.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const brandBook = join(here, '../../protocol/brand/brand-book.html');
const outDir = join(here, '../public/fonts');
mkdirSync(outDir, { recursive: true });

const html = readFileSync(brandBook, 'utf8');

// Map each @font-face (family + style) to a stable output filename, matched by
// the order the base64 blobs appear in the file.
const targets = [
  { family: 'Fraunces', style: 'normal', file: 'Fraunces-roman-var.woff2' },
  { family: 'Fraunces', style: 'italic', file: 'Fraunces-italic-var.woff2' },
  { family: 'Literata', style: 'normal', file: 'Literata-400.woff2' },
  { family: 'Literata', style: 'italic', file: 'Literata-400-italic.woff2' },
];

// Pull every @font-face block, keep family/style + payload.
const faceRe = /@font-face\s*\{([^}]*?)\}/gs;
const blocks = [];
for (const m of html.matchAll(faceRe)) {
  const body = m[1];
  const fam = /font-family:\s*'([^']+)'/.exec(body)?.[1];
  const style = /font-style:\s*(\w+)/.exec(body)?.[1] ?? 'normal';
  const data = /src:\s*url\(data:font\/woff2;base64,([A-Za-z0-9+/=]+)\)/.exec(body)?.[1];
  if (fam && data) blocks.push({ fam, style, data });
}

let written = 0;
for (const t of targets) {
  const hit = blocks.find((b) => b.fam === t.family && b.style === t.style);
  if (!hit) {
    console.error(`MISSING: ${t.family} ${t.style} not found in brand-book.html`);
    process.exitCode = 1;
    continue;
  }
  const buf = Buffer.from(hit.data, 'base64');
  // woff2 magic bytes: 'wOF2' == 0x77 0x4F 0x46 0x32
  const magic = buf.subarray(0, 4).toString('latin1');
  if (magic !== 'wOF2') {
    console.error(`BAD MAGIC for ${t.file}: got ${JSON.stringify(magic)}`);
    process.exitCode = 1;
    continue;
  }
  writeFileSync(join(outDir, t.file), buf);
  console.log(`wrote ${t.file} (${(buf.length / 1024).toFixed(1)} KB)`);
  written++;
}

console.log(`\n${written}/${targets.length} fonts extracted to public/fonts/`);

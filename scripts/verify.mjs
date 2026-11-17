#!/usr/bin/env node
/**
 * Static quality gates for the portfolio.
 * Run after `npm run build`. Exits non-zero on any failure.
 */
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

const root = path.resolve(import.meta.dirname, '..');
const failures = [];
const notes = [];

const fail = (msg) => failures.push(msg);
const note = (msg) => notes.push(msg);

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

// 1. JavaScript budget
const assets = path.join(root, 'dist/assets');
if (!fs.existsSync(assets)) {
  fail('dist/assets is missing — run `npm run build` first');
} else {
  const js = fs.readdirSync(assets).filter((f) => f.endsWith('.js'));
  let gzipTotal = 0;
  let rawTotal = 0;
  for (const file of js) {
    const buf = fs.readFileSync(path.join(assets, file));
    rawTotal += buf.length;
    gzipTotal += zlib.gzipSync(buf, { level: 9 }).length;
  }
  const gzipKb = Math.round(gzipTotal / 1024);
  note(`JS: ${Math.round(rawTotal / 1024)} kB raw, ${gzipKb} kB gzip across ${js.length} files`);
  if (gzipKb > 120) fail(`JS budget exceeded: ${gzipKb} kB gzip > 120 kB`);

  const iconChunk = js.find((f) => f.startsWith('lucide'));
  if (iconChunk) fail(`Icon chunk came back: ${iconChunk}`);
}

// 2. Payload budget
const publicDir = path.join(root, 'public');
const files = walk(publicDir);
const totalMb = files.reduce((sum, f) => sum + fs.statSync(f).size, 0) / (1024 * 1024);
note(`public/: ${totalMb.toFixed(1)} MB in ${files.length} files`);
if (totalMb > 80) fail(`public/ exceeds 80 MB (${totalMb.toFixed(1)} MB)`);

for (const f of files) {
  const mb = fs.statSync(f).size / (1024 * 1024);
  if (mb > 20) fail(`Single asset over 20 MB: ${path.relative(root, f)} (${mb.toFixed(1)} MB)`);
}

// 3. Banned claims and phrases (must stay gone)
const banned = [
  ['35ms', '<35ms launch claim was contradicted by the README'],
  ['20MB RAM', '<20MB claim was contradicted by the README'],
  ['Pro in Minecraft', 'self-assessed rank contradicted by the linked profile'],
  ['Good at DaVinci', 'self-graded capability'],
  ['17 months', 'tenure counter conflicts with the dated rows'],
  ['cheat engine', 'removed from the project card'],
  ['Vibe &amp; Code', 'replaced with the actual stack'],
  ['spatial audio', 'claimed experience that does not exist on the site'],
];

const sources = [
  ...walk(path.join(root, 'src')).filter((f) => /\.(jsx?|css)$/.test(f)),
  path.join(root, 'index.html'),
];
for (const file of sources) {
  const text = fs.readFileSync(file, 'utf8');
  for (const [needle, why] of banned) {
    if (text.includes(needle)) fail(`"${needle}" found in ${path.relative(root, file)} — ${why}`);
  }
  if (/text-\[(7|8|9|9\.5)px\]/.test(text)) {
    fail(`Type below the 10px floor found in ${path.relative(root, file)}`);
  }
}

// 4. The primary action must be a real mailto
const hero = fs.readFileSync(path.join(root, 'src/components/ContactDealButton.jsx'), 'utf8');
if (!/mailto:/.test(hero)) fail('ContactDealButton has no mailto: — the primary CTA cannot contact anyone');

// 5. Video loading discipline
for (const file of walk(path.join(root, 'src/components')).filter((f) => f.endsWith('.jsx'))) {
  const text = fs.readFileSync(file, 'utf8');
  let index = text.indexOf('<video');
  while (index !== -1) {
    const window = text.slice(index, index + 600);
    if (!/preload=/.test(window)) fail(`<video> without preload in ${path.basename(file)}`);
    if (/^\s*autoPlay\s*$/m.test(window)) fail(`<video> with unconditional autoPlay in ${path.basename(file)}`);
    index = text.indexOf('<video', index + 1);
  }
}

// Report
for (const n of notes) console.log('·', n);
if (failures.length) {
  console.error('\nFAILED:');
  for (const f of failures) console.error('  ✗', f);
  process.exit(1);
}
console.log('\nAll static gates passed.');

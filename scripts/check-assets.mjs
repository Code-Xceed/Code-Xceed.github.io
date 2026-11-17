// Verify every asset referenced by the built site exists in dist.
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const dist = path.join(root, 'dist');
const files = [];
(function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full);
    else files.push(full);
  }
})(dist);

const textFiles = files.filter((f) => /\.(html|css|js|json|xml|txt|webmanifest|svg)$/.test(f));
const missing = new Map();
const refRe = /["'(]\s*(\/[A-Za-z0-9_\-./%]+\.(?:webp|png|jpg|jpeg|svg|mp4|webm|woff2|ico|json|xml|txt|webmanifest))\s*["')]/g;

for (const file of textFiles) {
  const text = fs.readFileSync(file, 'utf8');
  let m;
  while ((m = refRe.exec(text)) !== null) {
    const ref = decodeURIComponent(m[1]);
    if (ref.startsWith('/assets/')) continue; // hashed bundle names are emitted
    const target = path.join(dist, ref.replace(/^\//, ''));
    if (!fs.existsSync(target)) {
      if (!missing.has(ref)) missing.set(ref, []);
      missing.get(ref).push(path.relative(dist, file));
    }
  }
}

if (missing.size === 0) {
  console.log(`All ${textFiles.length} built text files reference only existing assets.`);
} else {
  console.log('MISSING ASSETS:');
  for (const [ref, where] of missing) console.log(`  ${ref}  <- ${[...new Set(where)].slice(0, 3).join(', ')}`);
  process.exitCode = 1;
}

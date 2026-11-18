#!/usr/bin/env node
/**
 * SEO and metadata checks for the static entry points.
 * Runs against source HTML (the crawler-visible layer), not the bundle.
 */
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');

const PAGES = [
  { file: 'index.html', url: 'https://code-xceed.github.io/', needs: ['Person', 'ItemList'] },
  { file: 'interests/video-editing/index.html', url: 'https://code-xceed.github.io/interests/video-editing/', needs: ['CollectionPage', 'BreadcrumbList'] },
  { file: 'interests/minecraft/index.html', url: 'https://code-xceed.github.io/interests/minecraft/', needs: ['CollectionPage', 'BreadcrumbList'] },
  { file: 'blogs/how-i-started/index.html', url: 'https://code-xceed.github.io/blogs/how-i-started/', needs: ['BlogPosting', 'BreadcrumbList'] },
  { file: 'blogs/how-i-got-my-first-client/index.html', url: 'https://code-xceed.github.io/blogs/how-i-got-my-first-client/', needs: ['BlogPosting', 'BreadcrumbList'] },
];

const failures = [];
const fail = (msg) => failures.push(msg);

const attr = (html, re) => {
  const m = html.match(re);
  return m ? m[1].trim() : null;
};

for (const page of PAGES) {
  const file = path.join(root, page.file);
  if (!fs.existsSync(file)) {
    fail(`${page.file}: missing`);
    continue;
  }
  const html = fs.readFileSync(file, 'utf8');
  const label = page.file;

  const title = (html.match(/<title>([\s\S]*?)<\/title>/) || [])[1]?.trim();
  if (!title) fail(`${label}: no <title>`);
  else if (title.length < 15 || title.length > 70) fail(`${label}: title is ${title.length} chars (want 15-70)`);

  const desc = attr(html, /<meta\s+name="description"\s+content="([^"]*)"/);
  if (!desc) fail(`${label}: no meta description`);
  else if (desc.length < 60 || desc.length > 175) fail(`${label}: description is ${desc.length} chars (want 60-175)`);

  const canonical = attr(html, /<link\s+rel="canonical"\s+href="([^"]*)"/);
  if (!canonical) fail(`${label}: no canonical`);
  else if (canonical !== page.url) fail(`${label}: canonical ${canonical} != ${page.url}`);

  const ogUrl = attr(html, /<meta\s+property="og:url"\s+content="([^"]*)"/);
  if (ogUrl !== page.url) fail(`${label}: og:url ${ogUrl} != ${page.url}`);

  if (!/property="og:image"/.test(html)) fail(`${label}: no og:image`);
  if (!/name="twitter:card"/.test(html)) fail(`${label}: no twitter:card`);

  const h1s = (html.match(/<h1[\s>]/g) || []).length;
  if (h1s !== 1) fail(`${label}: ${h1s} h1 elements in the static fallback (want 1)`);

  const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  if (blocks.length === 0) fail(`${label}: no JSON-LD`);
  const types = [];
  for (const [, body] of blocks) {
    try {
      const parsed = JSON.parse(body);
      const list = Array.isArray(parsed) ? parsed : [parsed];
      for (const node of list) {
        if (node['@type']) types.push(node['@type']);
        if (node['@graph']) for (const g of node['@graph']) types.push(g['@type']);
      }
    } catch (error) {
      fail(`${label}: invalid JSON-LD (${error.message})`);
    }
  }
  for (const need of page.needs) {
    if (!types.includes(need)) fail(`${label}: JSON-LD missing ${need}`);
  }
}

// Home must advertise the RSS feed
const home = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
if (!/rel="alternate"[^>]*application\/rss\+xml/.test(home)) fail('index.html: no RSS alternate link');

// robots and sitemap must exist and agree
const robots = fs.readFileSync(path.join(root, 'public/robots.txt'), 'utf8');
if (!/Sitemap:\s*https:\/\/code-xceed\.github\.io\/sitemap\.xml/.test(robots)) fail('robots.txt: sitemap line missing or wrong');
const sitemap = fs.readFileSync(path.join(root, 'public/sitemap.xml'), 'utf8');
for (const page of PAGES) {
  if (!sitemap.includes(`<loc>${page.url}</loc>`)) fail(`sitemap.xml: missing ${page.url}`);
}

if (failures.length) {
  console.error('SEO FAILED:');
  for (const f of failures) console.error('  ✗', f);
  process.exit(1);
}
console.log(`SEO gates passed for ${PAGES.length} pages (title, description, canonical, OG, JSON-LD, sitemap, RSS).`);

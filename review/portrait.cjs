const puppeteer = require('C:/Users/CodeX/Desktop/New-Portfolio/node_modules/puppeteer-core');
const path = require('path');
const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const root = 'C:/Users/CodeX/Desktop/New-Portfolio';
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({ executablePath: EDGE, headless: 'new' });
  const svg = fs.readFileSync(path.join(root, 'public/profile-placeholder.svg'), 'utf8');
  const dataUrl = 'data:image/svg+xml;base64,' + Buffer.from(svg).toString('base64');
  const html = `<html><body style="margin:0;background:#F4EFE6"><img src="${dataUrl}" width="328" height="410" style="display:block"></body></html>`;

  const page = await browser.newPage();
  await page.setViewport({ width: 328, height: 410, deviceScaleFactor: 1 });
  await page.setContent(html, { waitUntil: 'load' });
  await new Promise((r) => setTimeout(r, 400));
  await page.screenshot({ path: path.join(root, 'public/profile-328.webp'), type: 'webp', quality: 88, optimizeForSpeed: false });

  const page2 = await browser.newPage();
  await page2.setViewport({ width: 328, height: 410, deviceScaleFactor: 2 });
  await page2.setContent(html, { waitUntil: 'load' });
  await new Promise((r) => setTimeout(r, 400));
  await page2.screenshot({ path: path.join(root, 'public/profile-656.webp'), type: 'webp', quality: 86, optimizeForSpeed: false });

  for (const f of ['public/profile-328.webp', 'public/profile-656.webp']) {
    console.log(f, Math.round(fs.statSync(path.join(root, f)).size / 1024) + ' KB');
  }
  await browser.close();
})();

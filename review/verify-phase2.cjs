const puppeteer = require('C:/Users/CodeX/Desktop/New-Portfolio/node_modules/puppeteer-core');
const path = require('path');
const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

(async () => {
  const browser = await puppeteer.launch({ executablePath: EDGE, headless: 'new' });
  const out = {};
  for (const [name, route] of [
    ['video', '/interests/video-editing/'],
    ['minecraft', '/interests/minecraft/'],
  ]) {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });
    const errors = [];
    page.on('pageerror', (e) => errors.push(String(e).slice(0, 200)));
    page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text().slice(0, 200)); });
    await page.goto('http://localhost:5199' + route, { waitUntil: 'domcontentloaded' });
    await new Promise((r) => setTimeout(r, 1600));
    const info = await page.evaluate(() => {
      const dr = document.querySelector('[role="dialog"]');
      return {
        footerLinks: [...document.querySelectorAll('[role="dialog"] footer a, [role="dialog"] footer button')].map((e) => e.innerText.trim()),
        briefCta: !!document.querySelector('a[href^="mailto:"][href*="brief"]'),
        briefText: document.querySelector('a[href*="brief"]')?.innerText.trim(),
        dialogLabel: dr?.getAttribute('aria-label'),
        h1: [...document.querySelectorAll('[role="dialog"] h1')].map((h) => h.innerText.trim()),
        activeTab: document.querySelector('[role="tab"][aria-selected="true"]')?.innerText.replace(/\s+/g, ' ').trim(),
        docTitle: document.title,
      };
    });
    out[name] = { ...info, errors };
    await page.screenshot({ path: path.join(__dirname, 'shots', `after-${name}-desktop.png`), fullPage: false });
    await page.close();
  }
  console.log(JSON.stringify(out, null, 2));
  await browser.close();
})();

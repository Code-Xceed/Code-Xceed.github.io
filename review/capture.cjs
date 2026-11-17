// Portfolio review captures. Fixed viewports, full-page, reduced motion off.
const puppeteer = require('C:/Users/CodeX/Desktop/New-Portfolio/node_modules/puppeteer-core');
const path = require('path');
const fs = require('fs');

const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const OUT = path.join(__dirname, 'shots');
fs.mkdirSync(OUT, { recursive: true });

const PAGES = [
  ['home', '/'],
  ['video-editing', '/interests/video-editing/'],
  ['minecraft', '/interests/minecraft/'],
  ['blog-1', '/blogs/how-i-started/'],
  ['blog-2', '/blogs/how-i-got-my-first-client/'],
];

(async () => {
  const browser = await puppeteer.launch({ executablePath: EDGE, headless: 'new' });
  const results = [];

  for (const [name, route] of PAGES) {
    for (const [device, vp] of [
      ['desktop', { width: 1440, height: 900, deviceScaleFactor: 1 }],
      ['mobile', { width: 390, height: 844, deviceScaleFactor: 1 }],
    ]) {
      const page = await browser.newPage();
      await page.setViewport(vp);
      const errors = [];
      page.on('pageerror', (e) => errors.push(String(e).slice(0, 160)));
      page.on('console', (m) => {
        if (m.type() === 'error') errors.push('console: ' + m.text().slice(0, 160));
      });
      await page.goto('http://localhost:5199' + route, { waitUntil: 'networkidle2', timeout: 45000 });
      await new Promise((r) => setTimeout(r, 1400));
      const metrics = await page.evaluate(() => ({
        scrollW: document.documentElement.scrollWidth,
        clientW: document.documentElement.clientWidth,
        scrollH: document.documentElement.scrollHeight,
        h1: [...document.querySelectorAll('h1')].map((e) => e.innerText.trim()),
        links: document.querySelectorAll('a').length,
        buttons: document.querySelectorAll('button').length,
        imgsNoAlt: [...document.querySelectorAll('img')].filter((i) => !i.hasAttribute('alt')).length,
        imgsTotal: document.querySelectorAll('img').length,
      }));
      const file = path.join(OUT, `${name}-${device}.png`);
      await page.screenshot({ path: file, fullPage: true, captureBeyondViewport: true });
      results.push({ name, device, metrics, errors, file });
      await page.close();
    }
  }

  await browser.close();
  fs.writeFileSync(path.join(__dirname, 'capture-report.json'), JSON.stringify(results, null, 2));
  console.log(JSON.stringify(results, null, 2));
})();

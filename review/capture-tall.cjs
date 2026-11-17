// Capture fixed-sheet routes in a tall viewport so the whole sheet is visible.
const puppeteer = require('C:/Users/CodeX/Desktop/New-Portfolio/node_modules/puppeteer-core');
const path = require('path');
const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const PAGES = [
  ['video-editing', '/interests/video-editing/', 2600],
  ['minecraft', '/interests/minecraft/', 2600],
  ['blog-1', '/blogs/how-i-started/', 1100],
];

(async () => {
  const browser = await puppeteer.launch({ executablePath: EDGE, headless: 'new' });
  for (const [name, route, h] of PAGES) {
    for (const [device, w] of [['desktop', 1440], ['mobile', 390]]) {
      const page = await browser.newPage();
      await page.setViewport({ width: w, height: h, deviceScaleFactor: 1 });
      await page.goto('http://localhost:5199' + route, { waitUntil: 'networkidle2', timeout: 45000 });
      await new Promise((r) => setTimeout(r, 1300));
      const info = await page.evaluate(() => {
        const sheet = document.querySelector('.blog-sheet-container');
        const bar = [...document.querySelectorAll('[role="tablist"], .overflow-x-auto')].map((e) => ({
          cls: e.className.toString().slice(0, 60),
          sw: e.scrollWidth, cw: e.clientWidth,
        }));
        return {
          sheetH: sheet ? sheet.getBoundingClientRect().height : null,
          sheetSH: sheet ? sheet.scrollHeight : null,
          innerScrolls: bar,
        };
      });
      await page.screenshot({ path: path.join(__dirname, 'shots', `${name}-${device}-tall.png`) });
      console.log(name, device, JSON.stringify(info));
      await page.close();
    }
  }
  await browser.close();
})();

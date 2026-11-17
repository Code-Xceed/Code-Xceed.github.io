const puppeteer = require('C:/Users/CodeX/Desktop/New-Portfolio/node_modules/puppeteer-core');
const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

(async () => {
  const browser = await puppeteer.launch({ executablePath: EDGE, headless: 'new' });
  for (const w of [390, 768, 800, 1024, 1440]) {
    const page = await browser.newPage();
    await page.setViewport({ width: w, height: 900 });
    await page.goto('http://localhost:5199/', { waitUntil: 'domcontentloaded' });
    await new Promise((r) => setTimeout(r, 900));
    const m = await page.evaluate(() => {
      const grid = document.querySelector('#interests-experience .grid');
      const cols = grid ? [...grid.children].map((c) => Math.round(c.getBoundingClientRect().right)) : [];
      const offenders = [...document.querySelectorAll('body *')]
        .filter((el) => {
          const r = el.getBoundingClientRect();
          const s = getComputedStyle(el);
          return r.width > 1 && r.right > innerWidth + 1 && s.position !== 'fixed' && !el.closest('[aria-hidden="true"]');
        })
        .slice(0, 5)
        .map((el) => ({ tag: el.tagName, cls: el.className.toString().slice(0, 46), right: Math.round(el.getBoundingClientRect().right) }));
      return {
        scrollW: document.documentElement.scrollWidth,
        clientW: document.documentElement.clientWidth,
        colRights: cols,
        offenders,
      };
    });
    console.log(w, JSON.stringify(m));
    await page.close();
  }
  await browser.close();
})();

const puppeteer = require('C:/Users/CodeX/Desktop/New-Portfolio/node_modules/puppeteer-core');
const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const ROUTES = [
  ['home', '/'],
  ['video', '/interests/video-editing/'],
  ['minecraft', '/interests/minecraft/'],
  ['blog-1', '/blogs/how-i-started/'],
  ['blog-2', '/blogs/how-i-got-my-first-client/'],
];

(async () => {
  const browser = await puppeteer.launch({ executablePath: EDGE, headless: 'new' });
  const results = [];
  for (const [name, route] of ROUTES) {
    for (const [device, w, h] of [['desktop', 1440, 900], ['mobile', 390, 844]]) {
      const page = await browser.newPage();
      await page.setViewport({ width: w, height: h });
      const errors = [];
      page.on('pageerror', (e) => errors.push(e.message.slice(0, 120)));
      page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text().slice(0, 120)); });
      await page.goto('http://localhost:5199' + route, { waitUntil: 'domcontentloaded' });
      await new Promise((r) => setTimeout(r, 1200));
      const m = await page.evaluate(() => {
        const visible = (el) => {
          const r = el.getBoundingClientRect();
          const s = getComputedStyle(el);
          return r.width > 1 && r.height > 1 && s.visibility !== 'hidden' && s.display !== 'none';
        };
        const small = new Set();
        document.querySelectorAll('body *').forEach((el) => {
          if (!visible(el)) return;
          if (![...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim().length > 1)) return;
          const s = parseFloat(getComputedStyle(el).fontSize);
          if (s < 11) small.add(Math.round(s * 10) / 10);
        });
        const targets = [...document.querySelectorAll('a,button,input,[tabindex="0"]')].filter(visible);
        return {
          under11: [...small],
          targetsUnder24: targets.filter((t) => t.getBoundingClientRect().height < 24).length,
          h1: document.querySelectorAll('h1').length,
          nav: !!document.querySelector('nav[aria-label="Primary"]'),
          overflowX: document.documentElement.scrollWidth > window.innerWidth + 1,
        };
      });
      results.push({ name, device, ...m, errors });
      await page.close();
    }
  }
  console.log(JSON.stringify(results, null, 2));
  await browser.close();
})();

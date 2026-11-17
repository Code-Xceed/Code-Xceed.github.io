const puppeteer = require('C:/Users/CodeX/Desktop/New-Portfolio/node_modules/puppeteer-core');
const path = require('path');
const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

(async () => {
  const browser = await puppeteer.launch({ executablePath: EDGE, headless: 'new' });
  const rows = [];
  for (const [name, route, w, h] of [
    ['home', '/', 1440, 900],
    ['home-mobile', '/', 390, 844],
    ['video', '/interests/video-editing/', 1440, 900],
    ['video-mobile', '/interests/video-editing/', 390, 844],
    ['minecraft', '/interests/minecraft/', 1440, 900],
    ['minecraft-mobile', '/interests/minecraft/', 390, 844],
    ['blog', '/blogs/how-i-started/', 1440, 900],
  ]) {
    const page = await browser.newPage();
    await page.setViewport({ width: w, height: h });
    const errors = [];
    page.on('pageerror', (e) => errors.push(String(e).slice(0, 160)));
    await page.goto('http://localhost:5199' + route, { waitUntil: 'domcontentloaded' });
    await new Promise((r) => setTimeout(r, 1100));
    const m = await page.evaluate(() => {
      const nav = document.querySelector('nav[aria-label="Primary"]');
      const links = nav ? [...nav.querySelectorAll('a,button')].map((e) => e.innerText.trim()) : [];
      const r = nav ? nav.getBoundingClientRect() : null;
      return {
        navLinks: links,
        navTop: r ? Math.round(r.top) : null,
        heroTop: document.querySelector('h1') ? Math.round(document.querySelector('h1').getBoundingClientRect().top) : null,
        docH: document.documentElement.scrollHeight,
        overflowX: document.documentElement.scrollWidth > window.innerWidth + 1,
      };
    });
    rows.push({ name, ...m, errors });
    if (w === 1440) await page.screenshot({ path: path.join(__dirname, 'shots', `nav-${name}.png`) });
    if (w === 390) await page.screenshot({ path: path.join(__dirname, 'shots', `nav-${name}.png`) });
    await page.close();
  }
  console.log(JSON.stringify(rows, null, 2));
  await browser.close();
})();

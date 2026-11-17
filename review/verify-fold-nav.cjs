const puppeteer = require('C:/Users/CodeX/Desktop/New-Portfolio/node_modules/puppeteer-core');
const path = require('path');
const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

(async () => {
  const browser = await puppeteer.launch({ executablePath: EDGE, headless: 'new' });

  const home = await browser.newPage();
  await home.setViewport({ width: 1440, height: 900 });
  await home.goto('http://localhost:5199/', { waitUntil: 'domcontentloaded' });
  await new Promise((r) => setTimeout(r, 1200));
  const strip = await home.evaluate(() => {
    const el = [...document.querySelectorAll('footer')].find((f) => /IST/.test(f.innerText));
    const r = el.getBoundingClientRect();
    return { stripTop: Math.round(r.top), stripBottom: Math.round(r.bottom), inViewport: r.bottom <= innerHeight, heroH: Math.round(document.querySelector('section').getBoundingClientRect().height) };
  });
  await home.screenshot({ path: path.join(__dirname, 'shots', 'nav-fold-desktop.png') });

  const blog = await browser.newPage();
  await blog.setViewport({ width: 390, height: 844 });
  await blog.goto('http://localhost:5199/blogs/how-i-started/', { waitUntil: 'domcontentloaded' });
  await new Promise((r) => setTimeout(r, 1200));
  const bh = await blog.evaluate(() => {
    const header = document.querySelector('header');
    const nav = header?.querySelector('nav');
    const switcher = [...document.querySelectorAll('button')].filter((b) => /blog#/.test(b.innerText));
    return {
      headerOverflow: header ? header.scrollWidth > header.clientWidth + 1 : null,
      navWidth: nav ? Math.round(nav.getBoundingClientRect().width) : null,
      lastSwitcherRight: switcher.length ? Math.round(switcher[switcher.length - 1].getBoundingClientRect().right) : null,
    };
  });
  await blog.screenshot({ path: path.join(__dirname, 'shots', 'nav-blog-mobile.png') });

  console.log(JSON.stringify({ strip, bh }, null, 2));
  await browser.close();
})();

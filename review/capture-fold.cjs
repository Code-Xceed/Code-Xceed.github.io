// First-fold captures: what a visitor sees before scrolling.
const puppeteer = require('C:/Users/CodeX/Desktop/New-Portfolio/node_modules/puppeteer-core');
const path = require('path');
const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

(async () => {
  const browser = await puppeteer.launch({ executablePath: EDGE, headless: 'new' });
  for (const [name, w, h] of [['fold-desktop', 1440, 900], ['fold-mobile', 390, 844], ['fold-laptop', 1280, 720]]) {
    const page = await browser.newPage();
    await page.setViewport({ width: w, height: h, deviceScaleFactor: 1 });
    await page.goto('http://localhost:5199/', { waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 1400));
    await page.screenshot({ path: path.join(__dirname, 'shots', name + '.png') });
    const fold = await page.evaluate(() => {
      const h = innerHeight;
      const inFold = [...document.querySelectorAll('h1,h2,h3,button,a,p')]
        .filter((e) => { const r = e.getBoundingClientRect(); return r.top < h && r.bottom > 0 && r.width > 0; })
        .map((e) => e.innerText.trim().replace(/\s+/g, ' ').slice(0, 40));
      return { inFold: inFold.slice(0, 20), heroH: Math.round(document.querySelector('section').getBoundingClientRect().height) };
    });
    console.log(name, JSON.stringify(fold));
    await page.close();
  }
  await browser.close();
})();

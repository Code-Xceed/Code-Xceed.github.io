const puppeteer = require('C:/Users/CodeX/Desktop/New-Portfolio/node_modules/puppeteer-core');
const path = require('path');
const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

(async () => {
  const browser = await puppeteer.launch({ executablePath: EDGE, headless: 'new' });
  for (const [name, w, h] of [['mobile', 390, 844], ['tablet', 768, 1000], ['desktop', 1440, 900], ['laptop', 1280, 720]]) {
    const page = await browser.newPage();
    await page.setViewport({ width: w, height: h, deviceScaleFactor: 1 });
    await page.goto('http://localhost:5199/', { waitUntil: 'domcontentloaded' });
    await new Promise((r) => setTimeout(r, 1300));
    const m = await page.evaluate(() => {
      const h1 = document.querySelector('h1');
      const cs = getComputedStyle(h1);
      const lines = Math.round(h1.getBoundingClientRect().height / parseFloat(cs.lineHeight));
      const socials = document.querySelector('a[aria-label="GitHub"]')?.parentElement;
      const cta = document.querySelector('a[href^="mailto:"]');
      const pills = [...document.querySelectorAll('a[href="/interests/video-editing/"]')];
      return {
        h1Lines: lines,
        h1Width: Math.round(h1.getBoundingClientRect().width),
        heroH: Math.round(document.querySelector('section').getBoundingClientRect().height),
        ctaTop: cta ? Math.round(cta.getBoundingClientRect().top) : null,
        socialTop: socials ? Math.round(socials.getBoundingClientRect().top) : null,
        sameRow: cta && socials ? Math.abs(cta.getBoundingClientRect().top - socials.getBoundingClientRect().top) < 4 : null,
        videoPillTop: pills.length ? Math.round(pills[0].getBoundingClientRect().top) : null,
        docScrollW: document.documentElement.scrollWidth,
        clientW: document.documentElement.clientWidth,
      };
    });
    console.log(name, JSON.stringify(m));
    if (name === 'mobile') await page.screenshot({ path: path.join(__dirname, 'shots', 'after-fold-mobile.png') });
    if (name === 'desktop') await page.screenshot({ path: path.join(__dirname, 'shots', 'after-fold-desktop.png') });
    await page.close();
  }
  await browser.close();
})();

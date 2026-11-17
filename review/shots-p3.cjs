const puppeteer = require('C:/Users/CodeX/Desktop/New-Portfolio/node_modules/puppeteer-core');
const path = require('path');
const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

(async () => {
  const browser = await puppeteer.launch({ executablePath: EDGE, headless: 'new' });
  const jobs = [
    ['p3-home-desktop', '/', 1440, 900, true],
    ['p3-home-mobile', '/', 390, 844, true],
    ['p3-video-mobile', '/interests/video-editing/', 390, 844, false],
    ['p3-minecraft-mobile', '/interests/minecraft/', 390, 844, false],
  ];
  for (const [name, route, w, h, full] of jobs) {
    const page = await browser.newPage();
    await page.setViewport({ width: w, height: h });
    await page.goto('http://localhost:5199' + route, { waitUntil: 'domcontentloaded' });
    await new Promise((r) => setTimeout(r, 1300));
    await page.screenshot({ path: path.join(__dirname, 'shots', name + '.png'), fullPage: full });
    await page.close();
  }
  await browser.close();
  console.log('done');
})();

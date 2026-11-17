const puppeteer = require('C:/Users/CodeX/Desktop/New-Portfolio/node_modules/puppeteer-core');
const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

(async () => {
  const browser = await puppeteer.launch({ executablePath: EDGE, headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:5199/', { waitUntil: 'domcontentloaded' });
  await new Promise((r) => setTimeout(r, 900));
  const before = await page.title();

  await page.evaluate(() => {
    const btn = [...document.querySelectorAll('button')].find((b) => /Explore more about Minecraft/.test(b.getAttribute('aria-label') || ''));
    btn?.click();
  });
  await new Promise((r) => setTimeout(r, 700));
  const inApp = await page.title();
  const dialogLabel = await page.evaluate(() => document.querySelector('[role="dialog"]')?.getAttribute('aria-label'));

  await page.keyboard.press('Escape');
  await new Promise((r) => setTimeout(r, 700));
  const afterClose = await page.title();
  const path = await page.evaluate(() => location.pathname);

  await page.goto('http://localhost:5199/interests/minecraft/', { waitUntil: 'domcontentloaded' });
  await new Promise((r) => setTimeout(r, 1200));
  const direct = await page.title();

  console.log(JSON.stringify({ before, inApp, dialogLabel, afterClose, path, direct }, null, 2));
  await browser.close();
})();

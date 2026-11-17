const puppeteer = require('C:/Users/CodeX/Desktop/New-Portfolio/node_modules/puppeteer-core');
const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

(async () => {
  const browser = await puppeteer.launch({ executablePath: EDGE, headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 3 });
  const client = await page.createCDPSession();
  await client.send('Network.enable');
  await client.send('Network.emulateNetworkConditions', {
    offline: false, latency: 150, downloadThroughput: (9 * 1024 * 1024) / 8, uploadThroughput: (750 * 1024) / 8,
  });
  await client.send('Emulation.setCPUThrottlingRate', { rate: 4 });

  await page.evaluateOnNewDocument(() => {
    window.__lcp = [];
    new PerformanceObserver((l) => {
      for (const e of l.getEntries()) {
        const el = e.element;
        window.__lcp.push({
          t: Math.round(e.startTime),
          size: Math.round(e.size),
          tag: el ? el.tagName : null,
          cls: el ? (el.className || '').toString().slice(0, 60) : null,
          src: el && el.currentSrc ? el.currentSrc.split('/').pop() : null,
          text: el ? (el.innerText || '').trim().slice(0, 30) : null,
        });
      }
    }).observe({ type: 'largest-contentful-paint', buffered: true });
  });

  await page.goto('http://localhost:4199/', { waitUntil: 'load', timeout: 90000 });
  await new Promise((r) => setTimeout(r, 4000));
  const lcp = await page.evaluate(() => window.__lcp);
  console.log(JSON.stringify(lcp, null, 2));
  await browser.close();
})();

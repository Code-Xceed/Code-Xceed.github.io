const puppeteer = require('C:/Users/CodeX/Desktop/New-Portfolio/node_modules/puppeteer-core');
const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function run(browser, route, label) {
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 3 });
  const client = await page.createCDPSession();
  await client.send('Network.enable');
  await client.send('Network.emulateNetworkConditions', {
    offline: false,
    latency: 150,
    downloadThroughput: (9 * 1024 * 1024) / 8,
    uploadThroughput: (750 * 1024) / 8,
  });
  await client.send('Emulation.setCPUThrottlingRate', { rate: 4 });

  await page.evaluateOnNewDocument(() => {
    window.__v = { lcp: 0, cls: 0 };
    new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__v.lcp = Math.round(e.startTime); })
      .observe({ type: 'largest-contentful-paint', buffered: true });
    new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__v.cls += e.value; })
      .observe({ type: 'layout-shift', buffered: true });
  });

  let bytes = 0;
  page.on('response', async (r) => {
    const h = r.headers();
    bytes += Number(h['content-length'] || 0);
  });

  await page.goto('http://localhost:4199' + route, { waitUntil: 'load', timeout: 90000 });
  await new Promise((r) => setTimeout(r, 5000));
  const v = await page.evaluate(() => ({
    ...window.__v,
    cls: +window.__v.cls.toFixed(3),
    fcp: Math.round((performance.getEntriesByName('first-contentful-paint')[0] || {}).startTime || 0),
    videos: [...document.querySelectorAll('video')].map((el) => ({ src: el.currentSrc.split('/').pop(), preload: el.preload, paused: el.paused })),
  }));
  console.log(label, JSON.stringify({ lcp: v.lcp, fcp: v.fcp, cls: v.cls, totalKB: Math.round(bytes / 1024), videos: v.videos }));
  await page.close();
}

(async () => {
  const browser = await puppeteer.launch({ executablePath: EDGE, headless: 'new' });
  await run(browser, '/', 'run1');
  await run(browser, '/', 'run2');
  await run(browser, '/', 'run3');
  await run(browser, '/interests/video-editing/', 'video-mobile-4G');
  await browser.close();
})();



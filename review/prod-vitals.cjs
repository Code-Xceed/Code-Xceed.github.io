// Production-build measurement: LCP, CLS, long tasks, transfer weight.
const puppeteer = require('C:/Users/CodeX/Desktop/New-Portfolio/node_modules/puppeteer-core');
const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

(async () => {
  const browser = await puppeteer.launch({ executablePath: EDGE, headless: 'new' });
  const results = {};

  for (const [name, w, h] of [['desktop', 1440, 900], ['mobile', 390, 844]]) {
    const page = await browser.newPage();
    await page.setViewport({ width: w, height: h, deviceScaleFactor: 1, isMobile: name === 'mobile', hasTouch: name === 'mobile' });
    await page.evaluateOnNewDocument(() => {
      window.__vitals = { lcp: 0, cls: 0, longTasks: 0, longTaskMs: 0 };
      new PerformanceObserver((l) => {
        for (const e of l.getEntries()) window.__vitals.lcp = Math.round(e.startTime);
      }).observe({ type: 'largest-contentful-paint', buffered: true });
      new PerformanceObserver((l) => {
        for (const e of l.getEntries()) if (!e.hadRecentInput) window.__vitals.cls += e.value;
      }).observe({ type: 'layout-shift', buffered: true });
      new PerformanceObserver((l) => {
        for (const e of l.getEntries()) { window.__vitals.longTasks++; window.__vitals.longTaskMs += e.duration; }
      }).observe({ type: 'longtask', buffered: true });
    });

    const reqs = [];
    page.on('response', async (r) => {
      const hd = r.headers();
      reqs.push({ type: hd['content-type'] || '', len: Number(hd['content-length'] || 0), url: r.url() });
    });

    const t0 = Date.now();
    await page.goto('http://localhost:4199/', { waitUntil: 'load', timeout: 60000 });
    await new Promise((r) => setTimeout(r, 3000));
    const vitals = await page.evaluate(() => ({
      ...window.__vitals,
      cls: +window.__vitals.cls.toFixed(4),
      nav: (() => { const n = performance.getEntriesByType('navigation')[0]; return { ttfb: Math.round(n.responseStart), dcl: Math.round(n.domContentLoadedEventEnd), load: Math.round(n.loadEventEnd) }; })(),
      fcp: Math.round((performance.getEntriesByName('first-contentful-paint')[0] || {}).startTime || 0),
      nodes: document.querySelectorAll('*').length,
      videos: [...document.querySelectorAll('video')].map((v) => ({ src: v.currentSrc.split('/').pop(), preload: v.preload, autoplay: v.autoplay, paused: v.paused, t: +v.currentTime.toFixed(1) })),
      imgs: [...document.querySelectorAll('img')].map((i) => i.currentSrc.split('/').pop()),
    }));

    const byType = {};
    let total = 0;
    for (const r of reqs) {
      const t = r.type.split(';')[0] || 'other';
      byType[t] = (byType[t] || 0) + r.len;
      total += r.len;
    }
    Object.keys(byType).forEach((k) => (byType[k] = Math.round(byType[k] / 1024)));
    results[name] = {
      wall: Date.now() - t0,
      requests: reqs.length,
      kbByType: byType,
      totalKB: Math.round(total / 1024),
      vitals,
      heaviest: reqs.sort((a, b) => b.len - a.len).slice(0, 6).map((r) => `${r.url.split('/').pop()} ${Math.round(r.len / 1024)}KB`),
    };
    await page.close();
  }

  console.log(JSON.stringify(results, null, 2));
  await browser.close();
})();

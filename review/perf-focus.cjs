// Keyboard/focus, dialog semantics, and media weight checks.
const puppeteer = require('C:/Users/CodeX/Desktop/New-Portfolio/node_modules/puppeteer-core');
const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

(async () => {
  const browser = await puppeteer.launch({ executablePath: EDGE, headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  const requests = [];
  page.on('response', async (res) => {
    try {
      const h = res.headers();
      const len = Number(h['content-length'] || 0);
      requests.push({ url: res.url(), type: h['content-type'] || '', kb: Math.round(len / 1024) });
    } catch {}
  });

  await page.goto('http://localhost:5199/', { waitUntil: 'networkidle2' });
  await new Promise((r) => setTimeout(r, 1500));

  const perf = await page.evaluate(() => {
    const nav = performance.getEntriesByType('navigation')[0];
    const res = performance.getEntriesByType('resource');
    const sum = (t) => Math.round(res.filter((r) => r.initiatorType === t).reduce((a, r) => a + (r.encodedBodySize || 0), 0) / 1024);
    const biggest = res
      .map((r) => ({ n: r.name.split('/').pop().slice(0, 42), kb: Math.round((r.encodedBodySize || 0) / 1024), t: r.initiatorType }))
      .sort((a, b) => b.kb - a.kb)
      .slice(0, 8);
    const lcp = performance.getEntriesByType('largest-contentful-paint').slice(-1)[0];
    const paints = performance.getEntriesByType('paint').map((p) => [p.name, Math.round(p.startTime)]);
    return {
      dcl: Math.round(nav.domContentLoadedEventEnd),
      load: Math.round(nav.loadEventEnd),
      ttfb: Math.round(nav.responseStart),
      paints,
      lcp: lcp ? Math.round(lcp.startTime) : null,
      byType: { js: sum('script'), css: sum('link'), img: sum('img'), vid: sum('video'), fetch: sum('fetch') },
      nodes: document.querySelectorAll('*').length,
      domDepth: (() => { let d = 0; let el = document.querySelector('body'); const walk = (n, depth) => { d = Math.max(d, depth); [...n.children].forEach((c) => walk(c, depth + 1)); }; walk(el, 0); return d; })(),
      biggest,
    };
  });

  // Dialog focus test: land directly on a blog route.
  const page2 = await browser.newPage();
  await page2.setViewport({ width: 1440, height: 900 });
  await page2.goto('http://localhost:5199/blogs/how-i-started/', { waitUntil: 'networkidle2' });
  await new Promise((r) => setTimeout(r, 1200));
  const focus = [];
  for (let i = 0; i < 6; i++) {
    await page2.keyboard.press('Tab');
    focus.push(
      await page2.evaluate(() => {
        const a = document.activeElement;
        if (!a) return null;
        const inDialog = !!a.closest('[role="dialog"]');
        return { tag: a.tagName, label: (a.getAttribute('aria-label') || a.innerText || '').trim().slice(0, 34), inDialog, outline: getComputedStyle(a).outlineStyle + ' ' + getComputedStyle(a).outlineWidth };
      })
    );
  }
  const dialogInfo = await page2.evaluate(() => {
    const d = document.querySelector('[role="dialog"]');
    return {
      exists: !!d,
      ariaModal: d?.getAttribute('aria-modal'),
      labelledBy: d?.getAttribute('aria-labelledby'),
      ariaLabel: d?.getAttribute('aria-label'),
      focusableInDialog: d ? d.querySelectorAll('a,button,input,[tabindex]:not([tabindex="-1"])').length : 0,
      inertHome: !!document.querySelector('.home-canvas-receded[inert], .home-canvas-receded[aria-hidden="true"]'),
      bodyOverflow: getComputedStyle(document.body).overflow,
    };
  });

  console.log('PERF', JSON.stringify(perf, null, 2));
  console.log('FOCUS', JSON.stringify(focus, null, 2));
  console.log('DIALOG', JSON.stringify(dialogInfo, null, 2));
  await browser.close();
})();

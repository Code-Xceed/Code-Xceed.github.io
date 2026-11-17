const puppeteer = require('C:/Users/CodeX/Desktop/New-Portfolio/node_modules/puppeteer-core');
const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

(async () => {
  const browser = await puppeteer.launch({ executablePath: EDGE, headless: 'new' });
  const out = {};

  for (const [name, route] of [['home', '/'], ['video', '/interests/video-editing/']]) {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto('http://localhost:5199' + route, { waitUntil: 'domcontentloaded' });
    await new Promise((r) => setTimeout(r, 1200));
    out[name] = await page.evaluate(() => {
      const visible = (el) => {
        const r = el.getBoundingClientRect();
        const s = getComputedStyle(el);
        return r.width > 1 && r.height > 1 && s.visibility !== 'hidden' && s.display !== 'none';
      };
      const sizes = new Map();
      document.querySelectorAll('body *').forEach((el) => {
        if (!visible(el)) return;
        if (![...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim().length > 1)) return;
        const s = parseFloat(getComputedStyle(el).fontSize);
        if (s < 11) sizes.set(Math.round(s * 10) / 10, (sizes.get(Math.round(s * 10) / 10) || 0) + 1);
      });
      const targets = [...document.querySelectorAll('a,button,input,[tabindex="0"]')]
        .filter(visible)
        .map((el) => ({ h: Math.round(el.getBoundingClientRect().height), label: (el.getAttribute('aria-label') || el.innerText || '').trim().slice(0, 24) }));
      return {
        under11: [...sizes.entries()],
        targetCount: targets.length,
        under24: targets.filter((t) => t.h < 24).length,
        under24Sample: targets.filter((t) => t.h < 24).slice(0, 6),
        landmarks: {
          header: document.querySelectorAll('header').length,
          nav: document.querySelectorAll('nav').length,
          main: document.querySelectorAll('main').length,
          footer: document.querySelectorAll('footer').length,
        },
      };
    });
    await page.close();
  }

  // Reduced motion: nothing should autoplay
  const rm = await browser.newPage();
  await rm.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await rm.setViewport({ width: 1440, height: 900 });
  await rm.goto('http://localhost:5199/interests/video-editing/', { waitUntil: 'domcontentloaded' });
  await new Promise((r) => setTimeout(r, 2000));
  out.reducedMotion = await rm.evaluate(() => {
    const vids = [...document.querySelectorAll('video')].map((v) => ({
      src: v.currentSrc.split('/').pop(),
      autoPlayAttr: v.autoplay,
      paused: v.paused,
      t: +v.currentTime.toFixed(1),
    }));
    return { matches: matchMedia('(prefers-reduced-motion: reduce)').matches, vids };
  });
  await rm.close();

  console.log(JSON.stringify(out, null, 2));
  await browser.close();
})();

// Correct contrast measurement: resolve any CSS color through a canvas.
const puppeteer = require('C:/Users/CodeX/Desktop/New-Portfolio/node_modules/puppeteer-core');
const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

(async () => {
  const browser = await puppeteer.launch({ executablePath: EDGE, headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:5199/', { waitUntil: 'networkidle2' });
  await new Promise((r) => setTimeout(r, 1400));

  const out = await page.evaluate(() => {
    const cv = document.createElement('canvas');
    cv.width = cv.height = 1;
    const ctx = cv.getContext('2d', { willReadFrequently: true });
    const toRGBA = (color) => {
      ctx.clearRect(0, 0, 1, 1);
      ctx.fillStyle = '#000';
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, 1, 1);
      const d = ctx.getImageData(0, 0, 1, 1).data;
      return [d[0], d[1], d[2], d[3] / 255];
    };
    const srgb = (c) => { c /= 255; return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
    const lum = ([r, g, b]) => 0.2126 * srgb(r) + 0.7152 * srgb(g) + 0.0722 * srgb(b);
    const ratio = (fg, bg) => {
      const L1 = lum(fg), L2 = lum(bg);
      return +(((Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05))).toFixed(2);
    };
    const effectiveBg = (el) => {
      let n = el;
      while (n && n !== document.documentElement) {
        const c = toRGBA(getComputedStyle(n).backgroundColor);
        if (c[3] > 0.9) return c.slice(0, 3);
        n = n.parentElement;
      }
      return [250, 250, 248];
    };
    const visible = (el) => {
      const r = el.getBoundingClientRect();
      const s = getComputedStyle(el);
      return r.width > 1 && r.height > 1 && s.visibility !== 'hidden' && s.display !== 'none';
    };

    const samples = [];
    const seen = new Set();
    document.querySelectorAll('body *').forEach((el) => {
      if (!visible(el)) return;
      if (![...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim().length > 1)) return;
      const s = getComputedStyle(el);
      const size = parseFloat(s.fontSize);
      const weight = +s.fontWeight;
      const bg = effectiveBg(el);
      const fg = toRGBA(s.color).slice(0, 3);
      const key = [size, weight, s.color, bg.join(',')].join('|');
      if (seen.has(key)) return;
      seen.add(key);
      const large = size >= 24 || (size >= 18.66 && weight >= 700);
      samples.push({
        text: el.textContent.trim().replace(/\s+/g, ' ').slice(0, 40),
        size, weight, color: s.color, bg: `rgb(${bg.join(',')})`,
        contrast: ratio(fg, bg), need: large ? 3 : 4.5,
      });
    });

    const fails = samples.filter((s) => s.contrast < s.need).sort((a, b) => a.contrast - b.contrast);
    return { totalStyles: samples.length, failCount: fails.length, fails, under12: samples.filter((s) => s.size < 12).length };
  });

  console.log(JSON.stringify(out, null, 2));
  await browser.close();
})();

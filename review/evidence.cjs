// Evidence collection: typography, contrast, tap targets, headings, overflow.
const puppeteer = require('C:/Users/CodeX/Desktop/New-Portfolio/node_modules/puppeteer-core');
const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const fs = require('fs');
const path = require('path');

const ROUTES = ['/', '/interests/video-editing/', '/interests/minecraft/', '/blogs/how-i-started/'];

(async () => {
  const browser = await puppeteer.launch({ executablePath: EDGE, headless: 'new' });
  const report = {};

  for (const route of ROUTES) {
    report[route] = {};
    for (const [device, vp] of [
      ['desktop', { width: 1440, height: 900, deviceScaleFactor: 1 }],
      ['mobile', { width: 390, height: 844, deviceScaleFactor: 2 }],
    ]) {
      const page = await browser.newPage();
      await page.setViewport(vp);
      await page.goto('http://localhost:5199' + route, { waitUntil: 'networkidle2', timeout: 45000 });
      await new Promise((r) => setTimeout(r, 1200));

      const data = await page.evaluate(() => {
        const srgb = (c) => { c /= 255; return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
        const lum = ([r, g, b]) => 0.2126 * srgb(r) + 0.7152 * srgb(g) + 0.0722 * srgb(b);
        const parse = (s) => (s.match(/[\d.]+/g) || []).map(Number);
        const contrast = (fg, bg) => {
          const L1 = lum(fg), L2 = lum(bg);
          return +(((Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05))).toFixed(2);
        };
        const bgOf = (el) => {
          let n = el;
          while (n && n !== document.documentElement) {
            const c = parse(getComputedStyle(n).backgroundColor);
            if (c.length >= 3 && (c[3] === undefined || c[3] > 0.5)) return c.slice(0, 3);
            n = n.parentElement;
          }
          return [250, 250, 248];
        };
        const visible = (el) => {
          const r = el.getBoundingClientRect();
          const s = getComputedStyle(el);
          return r.width > 1 && r.height > 1 && s.visibility !== 'hidden' && s.display !== 'none' && +s.opacity > 0.1;
        };

        const textSamples = [];
        const seen = new Set();
        document.querySelectorAll('body *').forEach((el) => {
          if (!visible(el)) return;
          const hasDirectText = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim().length > 1);
          if (!hasDirectText) return;
          const s = getComputedStyle(el);
          const key = [s.fontSize, s.color, s.fontFamily.slice(0, 22), bgOf(el).join(',')].join('|');
          if (seen.has(key)) return;
          seen.add(key);
          const size = parseFloat(s.fontSize);
          const bg = bgOf(el);
          textSamples.push({
            text: el.textContent.trim().slice(0, 46),
            size, weight: s.fontWeight, color: s.color,
            bg: `rgb(${bg.join(',')})`,
            contrast: contrast(parse(s.color).slice(0, 3), bg),
            aa: size >= 24 || (size >= 18.66 && +s.fontWeight >= 700) ? 3 : 4.5,
          });
        });

        const smallText = textSamples.filter((t) => t.size < 12);
        const fails = textSamples.filter((t) => t.contrast < t.aa);

        const targets = [...document.querySelectorAll('a, button, [role="button"], input, textarea, select')]
          .filter(visible)
          .map((el) => {
            const r = el.getBoundingClientRect();
            return {
              label: (el.getAttribute('aria-label') || el.innerText || '').trim().slice(0, 40),
              w: Math.round(r.width), h: Math.round(r.height),
              tag: el.tagName.toLowerCase(),
            };
          });

        const overflow = [...document.querySelectorAll('body *')]
          .filter(visible)
          .filter((el) => el.getBoundingClientRect().right > innerWidth + 1)
          .slice(0, 8)
          .map((el) => ({
            tag: el.tagName.toLowerCase(),
            cls: (el.className || '').toString().slice(0, 70),
            right: Math.round(el.getBoundingClientRect().right),
            text: el.textContent.trim().slice(0, 34),
          }));

        const headings = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')]
          .filter(visible)
          .map((h) => h.tagName + ': ' + h.innerText.trim().replace(/\s+/g, ' ').slice(0, 52));

        const h1 = document.querySelector('h1');
        const h1Lines = h1 ? Math.round(h1.getBoundingClientRect().height / parseFloat(getComputedStyle(h1).lineHeight)) : 0;

        const imgs = [...document.querySelectorAll('img')].map((i) => ({
          src: i.currentSrc.split('/').pop(), alt: i.getAttribute('alt'), w: Math.round(i.getBoundingClientRect().width),
        }));

        return {
          docWidth: [document.documentElement.scrollWidth, innerWidth],
          textSamples: textSamples.sort((a, b) => a.contrast - b.contrast),
          smallTextCount: smallText.length,
          failingCount: fails.length,
          failing: fails.slice(0, 14),
          smallTargets: targets.filter((t) => t.h < 24).slice(0, 14),
          targetCount: targets.length,
          smallTargetCount: targets.filter((t) => t.h < 24).length,
          overflow,
          headings,
          h1Lines,
          imgs,
          landmarks: {
            header: document.querySelectorAll('header').length,
            nav: document.querySelectorAll('nav').length,
            main: document.querySelectorAll('main').length,
            footer: document.querySelectorAll('footer').length,
          },
        };
      });

      report[route][device] = data;
      await page.close();
    }
  }

  await browser.close();
  fs.writeFileSync(path.join(__dirname, 'evidence.json'), JSON.stringify(report, null, 2));
  for (const route of ROUTES) {
    for (const d of ['desktop', 'mobile']) {
      const r = report[route][d];
      console.log(`\n== ${route} ${d} ==`);
      console.log('docW', r.docWidth, 'h1Lines', r.h1Lines, 'targets', r.targetCount, 'smallTargets', r.smallTargetCount);
      console.log('failing contrast', r.failingCount, 'of', r.textSamples.length, '| smallText', r.smallTextCount);
      r.failing.slice(0, 6).forEach((f) => console.log('  FAIL', f.size + 'px', f.contrast + ':1', 'need ' + f.aa, '|', f.text, '|', f.color, 'on', f.bg));
      console.log('headings:', r.headings.join(' > '));
      if (r.overflow.length) console.log('overflow:', JSON.stringify(r.overflow));
    }
  }
})();

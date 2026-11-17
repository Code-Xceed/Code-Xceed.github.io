// Phase 1-2 verification: claims, outline, modal behaviour, contrast, targets.
const puppeteer = require('C:/Users/CodeX/Desktop/New-Portfolio/node_modules/puppeteer-core');
const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({ executablePath: EDGE, headless: 'new' });
  const out = {};

  // 1. Home: copy, outline, CTA, statuses
  const home = await browser.newPage();
  await home.setViewport({ width: 1440, height: 900 });
  await home.goto('http://localhost:5199/', { waitUntil: 'domcontentloaded' });
  await new Promise((r) => setTimeout(r, 1200));

  out.home = await home.evaluate(() => {
    const txt = document.body.innerText;
    const cta = document.querySelector('a[href^="mailto:"]');
    return {
      mailtoPresent: !!cta,
      mailtoHref: cta?.getAttribute('href'),
      availabilityVisible: /Available for freelance/.test(txt),
      ctaText: cta?.innerText.trim(),
      badgeLabels: [...document.querySelectorAll('.font-mono')].map((e) => e.innerText.trim()).filter((t) => ['maintained', 'archived', 'active'].includes(t)),
      bannedClaims: ['35ms', '20MB', 'Pro in', 'Good at', '17 months', '2 years', 'cheat engine', 'Vibe'].filter((s) => txt.includes(s)),
      headings: [...document.querySelectorAll('h1,h2,h3,h4')].map((h) => h.tagName + ': ' + h.innerText.trim().replace(/\s+/g, ' ').slice(0, 44)),
      nav: document.querySelectorAll('nav').length,
      header: document.querySelectorAll('header').length,
    };
  });

  // 2. Video route: dialog semantics, focus entry, inert home
  const vid = await browser.newPage();
  await vid.setViewport({ width: 1440, height: 900 });
  await vid.goto('http://localhost:5199/interests/video-editing/', { waitUntil: 'domcontentloaded' });
  await new Promise((r) => setTimeout(r, 1200));
  out.video = await vid.evaluate(() => {
    const dialog = document.querySelector('[role="dialog"]');
    const canvas = document.querySelector('.home-canvas-resting, .home-canvas-receded');
    return {
      h1Count: document.querySelectorAll('h1').length,
      canvasInert: canvas?.hasAttribute('inert'),
      canvasAriaHidden: canvas?.getAttribute('aria-hidden'),
      dialogLabel: dialog?.getAttribute('aria-label'),
      dialogFocused: document.activeElement === dialog,
      title: document.title,
    };
  });
  const tabs = [];
  for (let i = 0; i < 5; i++) {
    await vid.keyboard.press('Tab');
    tabs.push(await vid.evaluate(() => {
      const a = document.activeElement;
      return { tag: a.tagName, label: (a.getAttribute('aria-label') || a.innerText || '').trim().slice(0, 26), inDialog: !!a.closest('[role="dialog"]') };
    }));
  }
  out.videoTabOrder = tabs;

  // 3. Screenshots for visual check
  await home.screenshot({ path: path.join(__dirname, 'shots', 'after-home-desktop.png'), fullPage: true });
  await home.setViewport({ width: 390, height: 844, deviceScaleFactor: 1 });
  await home.reload({ waitUntil: 'domcontentloaded' });
  await new Promise((r) => setTimeout(r, 1000));
  await home.screenshot({ path: path.join(__dirname, 'shots', 'after-home-mobile.png'), fullPage: true });

  console.log(JSON.stringify(out, null, 2));
  await browser.close();
})();


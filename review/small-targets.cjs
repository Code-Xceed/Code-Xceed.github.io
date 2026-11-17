const puppeteer = require("C:/Users/CodeX/Desktop/New-Portfolio/node_modules/puppeteer-core");
(async () => {
  const b = await puppeteer.launch({ executablePath: "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe", headless: "new" });
  const p = await b.newPage();
  await p.setViewport({ width: 1440, height: 900 });
  await p.goto("http://localhost:5199/interests/minecraft/", { waitUntil: "domcontentloaded" });
  await new Promise((r) => setTimeout(r, 1200));
  const list = await p.evaluate(() => [...document.querySelectorAll('a,button,[tabindex="0"]')]
    .filter((el) => { const r = el.getBoundingClientRect(); return r.width > 0 && r.height < 24; })
    .map((el) => ({ h: Math.round(el.getBoundingClientRect().height), label: (el.getAttribute("aria-label") || el.innerText || "").trim().slice(0, 40), cls: el.className.toString().slice(0, 60) })));
  console.log(JSON.stringify(list, null, 2));
  await b.close();
})();

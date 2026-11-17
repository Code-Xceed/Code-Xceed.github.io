const puppeteer = require("C:/Users/CodeX/Desktop/New-Portfolio/node_modules/puppeteer-core");
const EDGE = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
(async () => {
  const b = await puppeteer.launch({ executablePath: EDGE, headless: "new" });
  const p = await b.newPage();
  await p.setViewport({ width: 1440, height: 900 });
  const errs = [];
  p.on("pageerror", (e) => errs.push("pageerror: " + e.message.slice(0, 300)));
  p.on("console", (m) => { if (m.type() === "error") errs.push("console: " + m.text().slice(0, 300)); });
  await p.goto("http://localhost:5199/interests/video-editing/", { waitUntil: "domcontentloaded" });
  await new Promise((r) => setTimeout(r, 2000));
  const state = await p.evaluate(() => ({
    rootChildren: document.getElementById("root")?.children.length,
    dialog: !!document.querySelector('[role="dialog"]'),
    bodyLen: document.body.innerText.length,
  }));
  console.log(JSON.stringify({ errs, state }, null, 2));
  await b.close();
})();

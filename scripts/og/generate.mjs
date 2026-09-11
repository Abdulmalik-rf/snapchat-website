/**
 * يولّد صورة المشاركة public/og.png (1200×630) من محتوى src/content/site.ts
 * باستخدام Chromium (تشكيل عربي وBidi صحيحان — محرّك next/og لا يدعمهما).
 *
 * التشغيل:  pnpm og
 * يحتاج Google Chrome مثبّتًا، أو حدّد مسار متصفح عبر CHROME_PATH=/path/to/chrome
 */
import { chromium } from "playwright-core";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";
import { writeFile, mkdir, access } from "node:fs/promises";
import { site } from "../../src/content/site.ts";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "../..");
const fontPath = path.join(here, "IBMPlexSansArabic-Bold.ttf");

/** يحمّل خط IBM Plex Sans Arabic Bold (رخصة OFL) من Google Fonts عند أول تشغيل ويحفظه محليًا */
async function ensureFont() {
  try {
    await access(fontPath);
    return;
  } catch {}
  const css = await fetch("https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@700&display=swap", {
    headers: { "User-Agent": "Mozilla/4.0" }, // وكيل قديم = روابط TTF بدل woff2
  }).then((r) => r.text());
  const url = css.match(/https:\/\/fonts\.gstatic\.com[^)]+\.ttf/)?.[0];
  if (!url) throw new Error("تعذّر العثور على رابط الخط في استجابة Google Fonts");
  const buf = Buffer.from(await fetch(url).then((r) => r.arrayBuffer()));
  await writeFile(fontPath, buf);
  console.log("✓ downloaded font →", path.relative(root, fontPath));
}
await ensureFont();
const fontUrl = pathToFileURL(fontPath).href;
const esc = (s) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

const html = `<!doctype html>
<html lang="ar" dir="rtl">
<head>
<meta charset="utf-8">
<style>
  @font-face { font-family: "Plex"; src: url("${fontUrl}") format("truetype"); font-weight: 700; }
  * { box-sizing: border-box; margin: 0; }
  html, body { width: 1200px; height: 630px; overflow: hidden; }
  body {
    font-family: "Plex", "IBM Plex Sans Arabic", sans-serif; font-weight: 700; color: #f5f5f7;
    background: radial-gradient(circle at 12% 18%, rgba(255,252,0,.38) 0%, rgba(10,10,12,0) 42%), #0a0a0c;
    padding: 64px; display: flex; flex-direction: column; justify-content: space-between;
  }
  .brand { display: flex; align-items: center; gap: 16px; }
  .mark { width: 56px; height: 56px; border-radius: 999px; background: #fffc00; display: grid; place-items: center; }
  .brand b { font-size: 30px; display: block; }
  .brand small { font-size: 20px; color: #a1a1aa; }
  h1 { font-size: 78px; line-height: 1.18; max-width: 1000px; }
  h1 .y { color: #fffc00; }
  p { font-size: 31px; line-height: 1.5; color: #d4d4d8; max-width: 980px; margin-top: 16px; }
  .pills { display: flex; gap: 14px; }
  .pill { font-size: 26px; padding: 12px 24px; border-radius: 999px; border: 2px solid rgba(255,252,0,.5); background: rgba(255,255,255,.06); }
  .pill.hi { background: #fffc00; color: #0a0a0c; border-color: #fffc00; }
  .nums { font-variant-numeric: lining-nums; }
</style>
</head>
<body>
  <div class="brand">
    <div class="mark"><svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#0a0a0c" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></div>
    <div><b>${esc(site.brand.name)}</b><small>${esc(site.brand.nameAr)}</small></div>
  </div>
  <div>
    <h1>${esc(site.hero.h1).replace("Snapchat", '<span class="y">Snapchat</span>')}</h1>
    <p>${esc(site.hero.subheadline)}</p>
  </div>
  <div class="pills">
    ${site.packages.map((p) => `<div class="pill nums${p.highlight ? " hi" : ""}">${p.price} ${esc(p.currency)}</div>`).join("")}
  </div>
</body>
</html>`;

const tmp = path.join(here, ".og.html");
await writeFile(tmp, html, "utf8");

const browser = await chromium.launch(
  process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : { channel: "chrome" },
);
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
await page.goto(pathToFileURL(tmp).href);
await page.evaluate(() => document.fonts.ready);
await mkdir(path.join(root, "public"), { recursive: true });
const out = path.join(root, "public/og.png");
await page.screenshot({ path: out, type: "png" });
await browser.close();
console.log("✓ wrote", path.relative(root, out));

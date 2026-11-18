// One-off: renders the sample statute PDF (public/dokumenty/statut-przyklad.pdf) linked in the footer
// until the owner sends the real document (content/placeholders.json → statutePdf).
// Run: node scripts/placeholder-statute.mjs   (needs Google Chrome; uses Playwright)
import { chromium } from "@playwright/test";
import fs from "node:fs";

const html = `<!doctype html><html lang="pl"><head><meta charset="utf-8"><style>
  @page { size: A4; margin: 0; }
  body { margin: 0; font-family: "Helvetica Neue", Arial, sans-serif; color: #2e1538; }
  .page { height: 297mm; box-sizing: border-box; padding: 32mm 24mm; background: #fdf9f1; position: relative; }
  .bar { position: absolute; inset: 0 0 auto 0; height: 14mm; background: #462451; }
  .tag { display: inline-block; margin-top: 10mm; padding: 2mm 5mm; border: 0.6mm dashed #c480d6; border-radius: 10mm; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; font-size: 10pt; color: #5e3375; }
  h1 { font-size: 26pt; margin: 8mm 0 4mm; color: #462451; text-transform: uppercase; letter-spacing: 0.5px; }
  p { font-size: 12pt; line-height: 1.6; max-width: 150mm; }
  .muted { color: #5e3375; }
</style></head><body><div class="page"><div class="bar"></div>
  <span class="tag">Dokument przykładowy</span>
  <h1>Statut Fundacji Empatia na rzecz Zwierząt</h1>
  <p>Ten plik jest tylko miejscem na właściwy dokument. Tutaj pojawi się statut fundacji w formacie PDF.</p>
  <p class="muted">Fundacja Empatia na rzecz Zwierząt · Dla tych, którzy mają tylko nas</p>
</div></body></html>`;

const browser = await chromium.launch({ channel: "chrome" });
const page = await browser.newPage();
await page.setContent(html, { waitUntil: "load" });
fs.mkdirSync("public/dokumenty", { recursive: true });
await page.pdf({ path: "public/dokumenty/statut-przyklad.pdf", format: "A4", printBackground: true });
await browser.close();
console.log("public/dokumenty/statut-przyklad.pdf", fs.statSync("public/dokumenty/statut-przyklad.pdf").size, "bytes");

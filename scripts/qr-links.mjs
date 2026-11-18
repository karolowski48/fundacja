// QR codes for the /linki/ page (collection boxes, business cards, print).
// Requires `qrencode` (brew install qrencode). Run: npm run qr
// Output: print/qr/ - plain SVG + PNG (error correction M) and a PNG with the logo (error correction H).
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync } from "node:fs";
import sharp from "sharp";

const settings = JSON.parse(readFileSync("content/settings.json", "utf8"));
const url = new URL("/linki/", settings.siteUrl).href; // never change this path - it is printed
const outDir = "print/qr";
const ink = "1F0F27"; // plum-950: darkest brand colour, ~18:1 on white
const moduleSize = 48; // px per module in PNG output
const margin = 4; // quiet zone in modules (QR spec minimum)

mkdirSync(outDir, { recursive: true });

const qrencode = (args) => execFileSync("qrencode", [...args, url]);

// 1) Plain, vector (for print) and raster.
qrencode(["-t", "SVG", "--svg-path", "-l", "M", "-m", String(margin), `--foreground=${ink}`, "-o", `${outDir}/qr-linki.svg`]);
qrencode(["-t", "PNG", "-l", "M", "-s", String(moduleSize), "-m", String(margin), `--foreground=${ink}`, "-o", `${outDir}/qr-linki.png`]);

// 2) With the logo in the middle. Level H survives ~30% damage; the badge covers ~8% of the code.
const base = qrencode(["-t", "PNG", "-l", "H", "-s", String(moduleSize), "-m", String(margin), `--foreground=${ink}`, "-o", "-"]);
const { width } = await sharp(base).metadata();
const codeWidth = width - 2 * margin * moduleSize;
const badge = Math.round(codeWidth * 0.28);
const pad = Math.round(badge * 0.08);
const logo = await sharp("source-images/brand/logo-transparent.png")
  .resize({ width: badge - 2 * pad, height: badge - 2 * pad, fit: "inside" })
  .toBuffer();
const badgeSvg = Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="${badge}" height="${badge}"><rect width="${badge}" height="${badge}" rx="${Math.round(badge * 0.18)}" fill="#ffffff"/></svg>`,
);
const badgePng = await sharp(badgeSvg).composite([{ input: logo, gravity: "center" }]).png().toBuffer();
await sharp(base)
  .composite([{ input: badgePng, gravity: "center" }])
  .png()
  .toFile(`${outDir}/qr-linki-logo.png`);

console.log(`QR for ${url} -> ${outDir}/qr-linki.svg, qr-linki.png, qr-linki-logo.png`);

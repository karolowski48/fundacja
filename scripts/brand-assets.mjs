// Generates favicons, PWA icons, the Open Graph image and the web logo from the brand sources.
// Run: npm run brand   (needs source-images/brand/logo-transparent.png — see scripts/extract-logo.mjs)
import sharp from "sharp";
import fs from "node:fs";

const PLUM_600 = "#7b4f9d";
const PLUM_800 = "#462451";
const CREAM = "#f9efd9";
const SUN = "#f7cf61";
const LOGO = "source-images/brand/logo-transparent.png";

const paw = (fill) => `<g fill="${fill}"><ellipse cx="24" cy="44" rx="8" ry="11" transform="rotate(-20 24 44)"/><ellipse cx="40" cy="28" rx="8.5" ry="12" transform="rotate(-8 40 28)"/><ellipse cx="60" cy="28" rx="8.5" ry="12" transform="rotate(8 60 28)"/><ellipse cx="76" cy="44" rx="8" ry="11" transform="rotate(20 76 44)"/><path d="M50 52c12 0 26 12 26 24 0 10-9 14-16 12-5-1.5-7-3-10-3s-5 1.5-10 3c-7 2-16-2-16-12 0-12 14-24 26-24z"/></g>`;

// Round icon (favicon / app/icon.png): plum circle with a cream paw
const roundIcon = (size) => Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="${PLUM_600}"/><g transform="translate(17 15) scale(.66)">${paw(CREAM)}</g></svg>`);
// Square icon (apple-touch / maskable): full-bleed plum, paw inside the safe zone
const squareIcon = (size, scale = 0.56) => {
  const off = (100 - 100 * scale) / 2;
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 100 100"><rect width="100" height="100" fill="${PLUM_600}"/><g transform="translate(${off} ${off - 2}) scale(${scale})">${paw(CREAM)}</g></svg>`);
};

fs.mkdirSync("public/brand", { recursive: true });
fs.mkdirSync("app", { recursive: true });
await sharp(roundIcon(512)).png().toFile("app/icon.png");
await sharp(squareIcon(180)).png().toFile("app/apple-icon.png");
await sharp(squareIcon(192)).png().toFile("public/brand/icon-192.png");
await sharp(squareIcon(512, 0.5)).png().toFile("public/brand/icon-maskable-512.png");

// favicon.ico = ICO container with an embedded 32×32 PNG (supported by every current browser)
const png32 = await sharp(roundIcon(32)).png().toBuffer();
const header = Buffer.alloc(22);
header.writeUInt16LE(0, 0); header.writeUInt16LE(1, 2); header.writeUInt16LE(1, 4);
header.writeUInt8(32, 6); header.writeUInt8(32, 7); header.writeUInt8(0, 8); header.writeUInt8(0, 9);
header.writeUInt16LE(1, 10); header.writeUInt16LE(32, 12);
header.writeUInt32LE(png32.length, 14); header.writeUInt32LE(22, 18);
fs.writeFileSync("app/favicon.ico", Buffer.concat([header, png32]));

// Web logo: full-size PNG (JSON-LD, social) + WebP widths for the page
await sharp(LOGO).resize({ width: 600 }).png({ palette: true, quality: 92, compressionLevel: 9 }).toFile("public/brand/logo.png");
for (const w of [160, 320, 640]) {
  await sharp(LOGO).resize({ width: w }).webp({ quality: 86, alphaQuality: 90 }).toFile(`public/brand/logo-${w}.webp`);
}

// Open Graph 1200×630: plum background with paws, logo left, tagline right
const pattern = fs.readFileSync("public/brand/pattern-paw.svg", "utf8").replace('fill-opacity=".11"', 'fill-opacity=".14"');
const patternTile = await sharp(Buffer.from(pattern)).png().toBuffer();
const logo = await sharp(LOGO).resize({ height: 440 }).toBuffer();
const logoMeta = await sharp(logo).metadata();
const text = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="560" height="630">
  <style>.h{font-family:'Avenir Next Condensed','Arial Narrow',sans-serif;font-weight:700;letter-spacing:1px}.s{font-family:'Avenir Next','Helvetica Neue',sans-serif;font-weight:600}</style>
  <text class="h" x="0" y="228" font-size="64" fill="${CREAM}">DLA TYCH,</text>
  <text class="h" x="0" y="300" font-size="64" fill="${CREAM}">KTÓRZY MAJĄ</text>
  <text class="h" x="0" y="372" font-size="64" fill="${SUN}">TYLKO NAS</text>
  <rect x="0" y="404" width="96" height="6" rx="3" fill="${SUN}"/>
  <text class="s" x="0" y="458" font-size="28" fill="${CREAM}">Fundacja Empatia na rzecz Zwierząt</text>
</svg>`);
await sharp({ create: { width: 1200, height: 630, channels: 4, background: PLUM_800 } })
  .composite([
    { input: patternTile, tile: true, left: 0, top: 0 },
    { input: logo, left: Math.round(330 - logoMeta.width / 2), top: Math.round(315 - logoMeta.height / 2) },
    { input: text, left: 640, top: 0 },
  ])
  .flatten({ background: PLUM_800 })
  .jpeg({ quality: 86, mozjpeg: true })
  .toFile("app/opengraph-image.jpg");
fs.copyFileSync("app/opengraph-image.jpg", "app/twitter-image.jpg");
for (const f of ["opengraph-image", "twitter-image"]) fs.writeFileSync(`app/${f}.alt.txt`, "Logo Fundacji Empatia na rzecz Zwierząt i hasło: Dla tych, którzy mają tylko nas");
console.log("brand assets done");

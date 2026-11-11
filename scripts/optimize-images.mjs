// Converts source photos into responsive WebP files + public/images/manifest.json.
// Run after adding or changing anything in source-images/:  npm run images
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const OUT = "public/images";
const DEFAULT_WIDTHS = [480, 768, 1200, 1600];
const STORY_WIDTHS = [320, 640];

/** @type {{ name: string; src: string; widths?: number[]; quality?: number; aspect?: number; position?: string }[]} */
const IMAGES = [
  // hero
  { name: "hero-kittens", src: "source-images/photos/kittens-cage.jpg" },
  { name: "hero-adas", src: "source-images/photos/adas.jpg", widths: [360, 600, 900] },
  // about
  { name: "feeding-winter", src: "source-images/photos/feeding-winter.jpg" },
  { name: "notes", src: "source-images/zrzutka/uPiHKHYx5qD2Aibj.jpg", widths: [320, 640] },
  { name: "sylwia-dog", src: "source-images/cut/collage-sylwia-dog.jpg", widths: [320, 640, 828] },
  // how we help
  { name: "help-feeding", aspect: 4 / 3, src: "source-images/zrzutka/cover-c58ccf772d28e40a8c24ffbf154c519c.jpg", widths: [480, 768, 1200] },
  { name: "help-treatment", aspect: 4 / 3, src: "source-images/zrzutka/cover-beedecab2052349b4841d7e44c84e7b3.jpg", widths: [480, 768, 1200] },
  { name: "help-trap", aspect: 4 / 3, position: "south", src: "source-images/zrzutka/tqThKD3Mhf2IBsMp.jpg", widths: [480, 768, 1200], quality: 60 },
  { name: "help-shelter", aspect: 4 / 3, src: "source-images/zrzutka/mHuNTRRq9U0Ewm4H.jpg", widths: [480, 768, 1200] },
  { name: "help-colony", aspect: 4 / 3, src: "source-images/cut/collage-colony-container.jpg", widths: [480, 768, 1054] },
  { name: "help-kittens-grass", aspect: 4 / 3, src: "source-images/cut/collage-kittens-grass.jpg", widths: [480, 822] },
  // who we help
  { name: "species-cats", src: "source-images/cut/collage-tuxedo-cats.jpg", widths: [240, 480, 800] },
  { name: "species-dog", src: "source-images/cut/collage-sylwia-dog.jpg", widths: [240, 480, 800] },
  { name: "species-rabbit", src: "source-images/cut/collage-rabbit.jpg", widths: [240, 480, 800] },
  { name: "species-bird", src: "source-images/cut/collage-bird.jpg", widths: [240, 480, 800] },
  { name: "species-chinchilla", src: "source-images/cut/collage-chinchilla.jpg", widths: [240, 480, 800] },
  { name: "help-rabbit", aspect: 4 / 3, src: "source-images/cut/collage-rabbit.jpg", widths: [480, 742] },
  // gallery
  { name: "gallery-trap-cat", src: "source-images/zrzutka/U0qWBBMbtMiVPlup.jpg", widths: [480, 768, 1200] },
  { name: "gallery-kittens-grass", src: "source-images/zrzutka/kQi6PsYWtAQeV2A0.jpg", widths: [480, 768, 1200] },
  // donate
  { name: "lanyard", src: "source-images/brand/lanyard.png", widths: [480, 768, 1200] },
];

// every "kiedyś / teraz" pair cut from the rollup
for (const f of fs.readdirSync("source-images/cut").filter((f) => f.startsWith("story-")).sort()) {
  IMAGES.push({ name: f.replace(/\.jpe?g$/, ""), src: `source-images/cut/${f}`, widths: STORY_WIDTHS });
}

fs.mkdirSync(OUT, { recursive: true });
const manifest = {};
for (const img of IMAGES) {
  let base = sharp(img.src).rotate(); // apply EXIF orientation
  if (img.aspect) {
    const meta = await sharp(await base.toBuffer()).metadata();
    const w = Math.min(meta.width, Math.round(meta.height * img.aspect));
    const h = Math.round(w / img.aspect);
    base = sharp(await base.toBuffer()).resize({ width: w, height: h, fit: "cover", position: img.position ?? "centre" });
  }
  const { data: oriented, info } = await base.toBuffer({ resolveWithObject: true });
  const widths = [...new Set((img.widths ?? DEFAULT_WIDTHS).map((w) => Math.min(w, info.width)))].sort((a, b) => a - b);
  for (const w of widths) {
    const file = path.join(OUT, `${img.name}-${w}.webp`);
    if (!fs.existsSync(file) || fs.statSync(file).mtimeMs < fs.statSync(img.src).mtimeMs) {
      await sharp(oriented).resize({ width: w }).webp({ quality: img.quality ?? 72, effort: 6 }).toFile(file);
    }
  }
  const blur = await sharp(oriented).resize({ width: 12 }).webp({ quality: 40 }).toBuffer();
  manifest[img.name] = {
    width: info.width,
    height: info.height,
    widths,
    blur: `data:image/webp;base64,${blur.toString("base64")}`,
  };
}
fs.writeFileSync(path.join(OUT, "manifest.json"), JSON.stringify(manifest, null, 2) + "\n");

const total = fs.readdirSync(OUT).filter((f) => f.endsWith(".webp")).reduce((s, f) => s + fs.statSync(path.join(OUT, f)).size, 0);
console.log(`${Object.keys(manifest).length} images, ${(total / 1024 / 1024).toFixed(1)} MB of WebP in ${OUT}`);

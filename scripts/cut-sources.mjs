// One-off: cut the "kiedyś / teraz" pairs out of the rollup and single tiles out of the collage.
// Input: source-images/brand/rollup-kiedys-teraz.jpg, source-images/photos/collage.jpg
// Output: source-images/cut/*.jpg
import sharp from "sharp";
import fs from "node:fs";

const OUT = "source-images/cut";
fs.mkdirSync(OUT, { recursive: true });

const rollup = "source-images/brand/rollup-kiedys-teraz.jpg";
// [name, top, bottom, left, right] — boxes detected on the 3591×6917 original
const pairs = [
  ["hades", 981, 1592, 364, 1611],
  ["coco-chanel", 1734, 2369, 363, 1608],
  ["balbinka", 2483, 3107, 353, 1601],
  ["buraski", 3229, 3841, 352, 1601],
  ["suzi", 3965, 4576, 352, 1600],
  ["petunia", 4691, 5299, 352, 1600],
  ["mordka", 995, 1598, 1907, 3156],
  ["brownie", 1725, 2360, 1919, 3162],
  ["miki", 2483, 3101, 1919, 3162],
  ["krakers", 3216, 3828, 1918, 3163],
  ["biedroneczka", 3957, 4572, 1919, 3163],
  ["adas", 4689, 5302, 1934, 3179],
];
const ARROW = 70; // the black arrow overlaps the top edge of both photos
const INSET = 8;
for (const [name, top, bottom, left, right] of pairs) {
  const mid = Math.round((left + right) / 2);
  const h = bottom - top - ARROW - INSET;
  const y = top + ARROW;
  await sharp(rollup).extract({ left: left + INSET, top: y, width: mid - left - 2 * INSET, height: h }).jpeg({ quality: 92 }).toFile(`${OUT}/story-${name}-before.jpg`);
  await sharp(rollup).extract({ left: mid + INSET, top: y, width: right - mid - 2 * INSET, height: h }).jpeg({ quality: 92 }).toFile(`${OUT}/story-${name}-after.jpg`);
}

const collage = "source-images/photos/collage.jpg";
// [name, left, top, width, height] on the 3464×1310 original
const tiles = [
  ["tuxedo-cats", 0, 0, 735, 525],
  ["chinchilla", 752, 0, 800, 622],
  ["kittens-grass", 1570, 0, 822, 622],
  ["rabbit", 0, 545, 742, 765],
  ["bird", 762, 640, 785, 670],
  ["sylwia-dog", 1562, 642, 828, 668],
  ["colony-container", 2410, 642, 1054, 668],
];
for (const [name, left, top, width, height] of tiles) {
  await sharp(collage).extract({ left, top, width, height }).jpeg({ quality: 92 }).toFile(`${OUT}/collage-${name}.jpg`);
}
console.log("done");

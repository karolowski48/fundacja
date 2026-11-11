// Builds small Polish-only variable fonts (one file per family instead of latin + latin-ext pairs).
// Sources: Google Fonts repository (SIL Open Font License 1.1) in source-images/fonts/.
// Run after changing the character set:  npm run fonts
import fs from "node:fs";
import subsetFont from "subset-font";

const ascii = Array.from({ length: 0x7e - 0x20 + 1 }, (_, i) => String.fromCharCode(0x20 + i)).join("");
const latin1 = Array.from({ length: 0xff - 0xa0 + 1 }, (_, i) => String.fromCharCode(0xa0 + i)).join("");
const polish = "ĄąĆćĘęŁłŃńŚśŹźŻż";
const typography = "–—‘’‚“”„…•·€™←→↑↓−×";
const text = ascii + latin1 + polish + typography;

const fonts = [
  // weight ranges limited to what the design uses (see CLAUDE.md §5.2)
  { src: "source-images/fonts/Oswald[wght].ttf", out: "app/fonts/oswald-pl.woff2", wght: { min: 500, max: 700 } },
  { src: "source-images/fonts/Nunito[wght].ttf", out: "app/fonts/nunito-pl.woff2", wght: { min: 400, max: 800 } },
];

fs.mkdirSync("app/fonts", { recursive: true });
for (const font of fonts) {
  const subset = await subsetFont(fs.readFileSync(font.src), text, { targetFormat: "woff2", variationAxes: { wght: font.wght } });
  fs.writeFileSync(font.out, subset);
  console.log(`${font.out}: ${(subset.length / 1024).toFixed(1)} KB`);
}

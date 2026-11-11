// One-off: remove the flat background around the logo with an edge flood fill + soft alpha fringe.
// Usage: node scripts/extract-logo.mjs <input> <output.png> <hardTolerance> <softTolerance> [localStep]
import sharp from "sharp";

const [input, output, hardArg = "40", softArg = "110", localArg = "0"] = process.argv.slice(2);
const HARD = Number(hardArg), SOFT = Number(softArg), LOCAL = Number(localArg);
const { data, info } = await sharp(input).removeAlpha().raw().toBuffer({ resolveWithObject: true });
const W = info.width, H = info.height, N = W * H;

// Reference background = median of the border pixels
const border = [];
for (let x = 0; x < W; x++) border.push(x, (H - 1) * W + x);
for (let y = 0; y < H; y++) border.push(y * W, y * W + W - 1);
const med = (k) => { const v = border.map((p) => data[p * 3 + k]).sort((a, b) => a - b); return v[v.length >> 1]; };
const bg = [med(0), med(1), med(2)];
const dist = (p, ref) => Math.hypot(data[p * 3] - ref[0], data[p * 3 + 1] - ref[1], data[p * 3 + 2] - ref[2]);
const px = (p) => [data[p * 3], data[p * 3 + 1], data[p * 3 + 2]];

// Flood fill from every border pixel. With LOCAL > 0 the fill follows gradual background changes
// (vignette), comparing each pixel to its already-filled neighbour instead of the global colour.
const isBg = new Uint8Array(N);
const stack = [];
for (const p of border) if (dist(p, bg) < HARD * 1.5) { isBg[p] = 1; stack.push(p); }
while (stack.length) {
  const p = stack.pop();
  const x = p % W, y = (p / W) | 0;
  for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
    const nx = x + dx, ny = y + dy;
    if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
    const q = ny * W + nx;
    if (isBg[q]) continue;
    const ok = LOCAL > 0 ? dist(q, px(p)) < LOCAL && dist(q, bg) < HARD * 2.5 : dist(q, bg) < HARD;
    if (ok) { isBg[q] = 1; stack.push(q); }
  }
}

// Alpha: 0 for background; soft ramp for foreground pixels touching the background (anti-aliased edge)
const out = Buffer.alloc(N * 4);
for (let p = 0; p < N; p++) {
  let a = 255;
  if (isBg[p]) a = 0;
  else {
    const x = p % W, y = (p / W) | 0;
    let near = false;
    for (let dy = -2; dy <= 2 && !near; dy++) for (let dx = -2; dx <= 2; dx++) {
      const nx = x + dx, ny = y + dy;
      if (nx >= 0 && ny >= 0 && nx < W && ny < H && isBg[ny * W + nx]) { near = true; break; }
    }
    if (near) a = Math.round(255 * Math.min(1, Math.max(0, (dist(p, bg) - HARD) / (SOFT - HARD))));
  }
  let [r, g, b] = px(p);
  if (a > 0 && a < 255) { // remove the background tint from semi-transparent edge pixels
    const f = a / 255;
    r = Math.min(255, Math.max(0, (r - (1 - f) * bg[0]) / f));
    g = Math.min(255, Math.max(0, (g - (1 - f) * bg[1]) / f));
    b = Math.min(255, Math.max(0, (b - (1 - f) * bg[2]) / f));
  }
  out[p * 4] = r; out[p * 4 + 1] = g; out[p * 4 + 2] = b; out[p * 4 + 3] = a;
}
await sharp(out, { raw: { width: W, height: H, channels: 4 } }).trim({ threshold: 1 }).png().toFile(output);
console.log("bg", bg, "->", output);

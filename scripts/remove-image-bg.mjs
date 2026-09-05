import sharp from "sharp";

const input = process.argv[2];
const modeArg = process.argv[3];
const tight = process.argv.includes("--tight");

if (!input) {
  console.error("Usage: node scripts/remove-image-bg.mjs <image-path> [white|black|auto] [--tight]");
  process.exit(1);
}

const whiteThreshold = tight ? 236 : 248;
const blackThreshold = tight ? 32 : 22;
const fringeLuminance = tight ? 228 : 0;
const fringePasses = tight ? 6 : 0;

function luminance(r, g, b) {
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function detectMode(pixels, width, height, channels) {
  const corners = [
    0,
    width - 1,
    (height - 1) * width,
    (height - 1) * width + (width - 1),
  ];
  const avg =
    corners.reduce((sum, i) => {
      const o = i * channels;
      return sum + luminance(pixels[o], pixels[o + 1], pixels[o + 2]);
    }, 0) / corners.length;

  return avg < 40 ? "black" : "white";
}

function isBackground(r, g, b, a, mode) {
  if (a === 0) return false;
  if (mode === "black") {
    return r <= blackThreshold && g <= blackThreshold && b <= blackThreshold;
  }
  return r >= whiteThreshold && g >= whiteThreshold && b >= whiteThreshold;
}

const image = sharp(input);
const { data, info } = await image.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const { width, height, channels } = info;
const pixels = new Uint8Array(data);
const mode = modeArg && modeArg !== "auto" ? modeArg : detectMode(pixels, width, height, channels);
const visited = new Uint8Array(width * height);
const queue = [];

function idx(x, y) {
  return y * width + x;
}

function pushIfBackground(x, y) {
  const i = idx(x, y);
  if (visited[i]) return;
  const offset = i * channels;
  const r = pixels[offset];
  const g = pixels[offset + 1];
  const b = pixels[offset + 2];
  const a = pixels[offset + 3];
  if (!isBackground(r, g, b, a, mode)) return;
  visited[i] = 1;
  queue.push(i);
}

for (let x = 0; x < width; x++) {
  pushIfBackground(x, 0);
  pushIfBackground(x, height - 1);
}
for (let y = 0; y < height; y++) {
  pushIfBackground(0, y);
  pushIfBackground(width - 1, y);
}

while (queue.length > 0) {
  const i = queue.pop();
  const x = i % width;
  const y = (i - x) / width;
  const neighbors = [
    [x - 1, y],
    [x + 1, y],
    [x, y - 1],
    [x, y + 1],
  ];
  for (const [nx, ny] of neighbors) {
    if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
    pushIfBackground(nx, ny);
  }
}

for (let i = 0; i < width * height; i++) {
  if (!visited[i]) continue;
  pixels[i * channels + 3] = 0;
}

function hasTransparentNeighbor(x, y) {
  const neighbors = [
    [x - 1, y],
    [x + 1, y],
    [x, y - 1],
    [x, y + 1],
  ];
  for (const [nx, ny] of neighbors) {
    if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
    if (pixels[idx(nx, ny) * channels + 3] === 0) return true;
  }
  return false;
}

for (let pass = 0; pass < fringePasses; pass++) {
  const toClear = [];
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = idx(x, y);
      const offset = i * channels;
      if (pixels[offset + 3] === 0) continue;
      const r = pixels[offset];
      const g = pixels[offset + 1];
      const b = pixels[offset + 2];
      if (luminance(r, g, b) < fringeLuminance) continue;
      if (!hasTransparentNeighbor(x, y)) continue;
      toClear.push(i);
    }
  }
  if (toClear.length === 0) break;
  for (const i of toClear) {
    pixels[i * channels + 3] = 0;
  }
}

await sharp(pixels, { raw: { width, height, channels } }).png().toFile(input);
console.log(
  `Removed edge-connected ${mode} background${tight ? " (tight)" : ""}: ${input} (${width}x${height})`,
);

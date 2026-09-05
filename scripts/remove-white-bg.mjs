import sharp from "sharp";
import fs from "fs";

const input = process.argv[2];
if (!input) {
  console.error("Usage: node scripts/remove-white-bg.mjs <image-path>");
  process.exit(1);
}

const threshold = 248;

function isBackground(r, g, b, a) {
  return a > 0 && r >= threshold && g >= threshold && b >= threshold;
}

const image = sharp(input);
const { data, info } = await image.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const { width, height, channels } = info;
const pixels = new Uint8Array(data);
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
  if (!isBackground(r, g, b, a)) return;
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

await sharp(pixels, { raw: { width, height, channels } }).png().toFile(input);
console.log(`Removed edge-connected white background: ${input} (${width}x${height})`);

/**
 * Ingests the raw hero frame sequence from "Bell bit hero frames/" into
 * public/assets/bellbit/hero/, producing:
 *   - frames/frame-XXX.webp      desktop sequence, full res, WebP (~55% smaller than raw JPEG)
 *   - frames-mobile/frame-XXX.webp lighter subset, downscaled, for small screens
 *   - poster.webp                  first frame, used as the immediate/SSR poster
 *   - manifest.json               frame counts, dimensions, pad widths, extensions
 *
 * Supports source filenames:
 *   - frame_000000.jpg  (current export)
 *   - ezgif-frame-001.jpg (legacy export)
 *
 * Run with: npm run process-hero-frames
 */
import { readdir, mkdir, writeFile, rm } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const SOURCE_DIR = path.join(ROOT, "Bell bit hero frames");
const OUT_BASE = path.join(ROOT, "public", "assets", "bellbit", "hero");
const OUT_FRAMES = path.join(OUT_BASE, "frames");
const OUT_MOBILE = path.join(OUT_BASE, "frames-mobile");

const MOBILE_STRIDE = 3;
const MOBILE_WIDTH = 640;

/** Full-resolution desktop WebP — q80 is visually lossless for scroll scrub at ~40% smaller than source JPEG. */
const DESKTOP_WEBP_QUALITY = 80;
const DESKTOP_WEBP_EFFORT = 4;

const MOBILE_WEBP_QUALITY = 80;
const MOBILE_WEBP_EFFORT = 4;

const FRAME_EXT = "webp";

const FRAME_PATTERNS = [
  /^frame_(\d+)\.jpg$/i,
  /^ezgif-frame-(\d+)\.jpg$/i,
  /^frame-(\d+)\.jpg$/i,
];

function parseFrameNumber(filename) {
  for (const pattern of FRAME_PATTERNS) {
    const match = filename.match(pattern);
    if (match) return parseInt(match[1], 10);
  }
  return null;
}

function pad(n, width) {
  return String(n).padStart(width, "0");
}

function frameName(index, padWidth) {
  return `frame-${pad(index, padWidth)}.${FRAME_EXT}`;
}

async function encodeDesktopFrame(sourcePath, destPath) {
  await sharp(sourcePath)
    .webp({ quality: DESKTOP_WEBP_QUALITY, effort: DESKTOP_WEBP_EFFORT })
    .toFile(destPath);
}

async function main() {
  const files = (await readdir(SOURCE_DIR))
    .map((file) => ({ file, index: parseFrameNumber(file) }))
    .filter((entry) => entry.index !== null)
    .sort((a, b) => a.index - b.index)
    .map((entry) => entry.file);

  if (files.length === 0) {
    throw new Error(
      `No frames found in ${SOURCE_DIR}. Expected frame_000000.jpg-style names.`
    );
  }

  const frameCount = files.length;
  const padWidth = String(frameCount).length;

  await rm(OUT_BASE, { recursive: true, force: true });
  await mkdir(OUT_FRAMES, { recursive: true });
  await mkdir(OUT_MOBILE, { recursive: true });

  const firstPath = path.join(SOURCE_DIR, files[0]);
  const meta = await sharp(firstPath).metadata();
  const width = meta.width;
  const height = meta.height;

  console.log(`Found ${frameCount} frames at ${width}x${height}`);
  console.log(
    `Encoding desktop → WebP q${DESKTOP_WEBP_QUALITY}, mobile → ${MOBILE_WIDTH}px WebP q${MOBILE_WEBP_QUALITY}`
  );

  for (let i = 0; i < files.length; i++) {
    await encodeDesktopFrame(
      path.join(SOURCE_DIR, files[i]),
      path.join(OUT_FRAMES, frameName(i + 1, padWidth))
    );
    if ((i + 1) % 60 === 0 || i + 1 === frameCount) {
      console.log(`  desktop ${i + 1}/${frameCount}`);
    }
  }

  const mobileFiles = files.filter((_, i) => i % MOBILE_STRIDE === 0);
  if (mobileFiles[mobileFiles.length - 1] !== files[files.length - 1]) {
    mobileFiles.push(files[files.length - 1]);
  }
  const mobileHeight = Math.round((height / width) * MOBILE_WIDTH);
  const mobilePadWidth = String(mobileFiles.length).length;

  for (let i = 0; i < mobileFiles.length; i++) {
    await sharp(path.join(SOURCE_DIR, mobileFiles[i]))
      .resize(MOBILE_WIDTH, mobileHeight)
      .webp({ quality: MOBILE_WEBP_QUALITY, effort: MOBILE_WEBP_EFFORT })
      .toFile(path.join(OUT_MOBILE, frameName(i + 1, mobilePadWidth)));
    if ((i + 1) % 40 === 0 || i + 1 === mobileFiles.length) {
      console.log(`  mobile ${i + 1}/${mobileFiles.length}`);
    }
  }

  await sharp(firstPath)
    .webp({ quality: DESKTOP_WEBP_QUALITY, effort: DESKTOP_WEBP_EFFORT })
    .toFile(path.join(OUT_BASE, `poster.${FRAME_EXT}`));

  const manifest = {
    frameCount,
    frameWidth: width,
    frameHeight: height,
    frameExtension: FRAME_EXT,
    mobileFrameCount: mobileFiles.length,
    mobileFrameWidth: MOBILE_WIDTH,
    mobileFrameHeight: mobileHeight,
    mobileFrameExtension: FRAME_EXT,
    posterExtension: FRAME_EXT,
    padWidth,
    mobilePadWidth,
    encode: {
      desktop: { format: "webp", quality: DESKTOP_WEBP_QUALITY },
      mobile: { format: "webp", quality: MOBILE_WEBP_QUALITY, width: MOBILE_WIDTH },
    },
    generatedAt: new Date().toISOString(),
  };

  await writeFile(path.join(OUT_BASE, "manifest.json"), JSON.stringify(manifest, null, 2));

  console.log(`Wrote ${frameCount} desktop frames, ${mobileFiles.length} mobile frames.`);
  console.log("Manifest:", manifest);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

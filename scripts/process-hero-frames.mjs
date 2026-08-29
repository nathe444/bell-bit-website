/**
 * Ingests the raw hero frame sequence ("Bell bit hero frames/ezgif-frame-XXX.jpg")
 * into public/assets/bellbit/hero/, producing:
 *   - frames/frame-XXX.jpg        desktop sequence, renumbered, unmodified quality
 *   - frames-mobile/frame-XXX.jpg lighter subset, downscaled, for small screens
 *   - poster.jpg                  first frame, used as the immediate/SSR poster
 *   - manifest.json                { frameCount, mobileFrameCount, width, height, mobileWidth, mobileHeight }
 *
 * Run with: node scripts/process-hero-frames.mjs
 */
import { readdir, mkdir, copyFile, writeFile, rm } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const SOURCE_DIR = path.join(ROOT, "Bell bit hero frames");
const OUT_BASE = path.join(ROOT, "public", "assets", "bellbit", "hero");
const OUT_FRAMES = path.join(OUT_BASE, "frames");
const OUT_MOBILE = path.join(OUT_BASE, "frames-mobile");

const MOBILE_STRIDE = 3; // keep every 3rd frame for the mobile sequence
const MOBILE_WIDTH = 640;

function pad(n, width) {
  return String(n).padStart(width, "0");
}

async function main() {
  const files = (await readdir(SOURCE_DIR))
    .filter((f) => /^ezgif-frame-\d+\.jpg$/i.test(f))
    .sort((a, b) => {
      const na = parseInt(a.match(/(\d+)/)[1], 10);
      const nb = parseInt(b.match(/(\d+)/)[1], 10);
      return na - nb;
    });

  if (files.length === 0) {
    throw new Error(`No frames found in ${SOURCE_DIR}`);
  }

  const frameCount = files.length;
  const padWidth = String(frameCount).length;

  await rm(OUT_BASE, { recursive: true, force: true });
  await mkdir(OUT_FRAMES, { recursive: true });
  await mkdir(OUT_MOBILE, { recursive: true });

  const first = sharp(path.join(SOURCE_DIR, files[0]));
  const meta = await first.metadata();
  const width = meta.width;
  const height = meta.height;

  console.log(`Found ${frameCount} frames at ${width}x${height}`);

  // Desktop sequence: copy as-is (already well compressed by the ezgif export).
  await Promise.all(
    files.map((file, i) =>
      copyFile(
        path.join(SOURCE_DIR, file),
        path.join(OUT_FRAMES, `frame-${pad(i + 1, padWidth)}.jpg`)
      )
    )
  );

  // Mobile sequence: subset + downscale.
  const mobileFiles = files.filter((_, i) => i % MOBILE_STRIDE === 0);
  if (mobileFiles[mobileFiles.length - 1] !== files[files.length - 1]) {
    mobileFiles.push(files[files.length - 1]); // always end on the resolved final frame
  }
  const mobileHeight = Math.round((height / width) * MOBILE_WIDTH);
  const mobilePadWidth = String(mobileFiles.length).length;

  await Promise.all(
    mobileFiles.map((file, i) =>
      sharp(path.join(SOURCE_DIR, file))
        .resize(MOBILE_WIDTH, mobileHeight)
        .jpeg({ quality: 72 })
        .toFile(path.join(OUT_MOBILE, `frame-${pad(i + 1, mobilePadWidth)}.jpg`))
    )
  );

  await copyFile(
    path.join(SOURCE_DIR, files[0]),
    path.join(OUT_BASE, "poster.jpg")
  );

  const manifest = {
    frameCount,
    frameWidth: width,
    frameHeight: height,
    mobileFrameCount: mobileFiles.length,
    mobileFrameWidth: MOBILE_WIDTH,
    mobileFrameHeight: mobileHeight,
    padWidth,
    mobilePadWidth,
    generatedAt: new Date().toISOString(),
  };

  await writeFile(
    path.join(OUT_BASE, "manifest.json"),
    JSON.stringify(manifest, null, 2)
  );

  console.log(`Wrote ${frameCount} desktop frames, ${mobileFiles.length} mobile frames.`);
  console.log("Manifest:", manifest);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

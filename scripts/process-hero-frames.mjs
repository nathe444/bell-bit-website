/**
 * Ingests the raw hero frame sequence from "Bell bit hero frames/" into
 * public/assets/bellbit/hero/, producing:
 *   - frames/frame-XXX.{avif|webp}   desktop sequence
 *   - frames-mobile/frame-XXX.{avif|webp}  lighter subset for small screens
 *   - poster.{avif|webp}             first frame, SSR / boot poster
 *   - manifest.json
 *
 * Size vs quality (scroll-scrub is motion — slight compression is invisible):
 *   1. Right-size width (1440px) — biggest win, no visible loss on canvas cover-fit
 *   2. AVIF at q60–65 — ~30% smaller than WebP at the same look
 *   3. Desktop stride 2 — half the files; scrub still feels smooth
 *   4. Encoder effort 6 — smaller files at the same quality setting (slower build)
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

/** Export every Nth source frame on desktop (2 = half the files, still smooth scrub). */
const DESKTOP_STRIDE = 2;
/** Export every Nth source frame on mobile. */
const MOBILE_STRIDE = 3;

/** Cap desktop width — 1440 is enough for full-viewport cover at 2× DPR on most laptops. */
const DESKTOP_MAX_WIDTH = 1440;
const MOBILE_WIDTH = 640;

/** "avif" (~30% smaller than webp at same look) or "webp" (widest legacy support). */
const OUTPUT_FORMAT = "avif";

const ENCODER_EFFORT = 6;

/** AVIF quality 55–65 ≈ WebP q78–82 for photographic content. */
const DESKTOP_AVIF_QUALITY = 62;
const MOBILE_AVIF_QUALITY = 58;

/** Fallback if OUTPUT_FORMAT === "webp". */
const DESKTOP_WEBP_QUALITY = 80;
const MOBILE_WEBP_QUALITY = 75;

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
  return `frame-${pad(index, padWidth)}.${OUTPUT_FORMAT}`;
}

function resizeDesktop(image) {
  return image.resize({
    width: DESKTOP_MAX_WIDTH,
    withoutEnlargement: true,
  });
}

function encode(image) {
  if (OUTPUT_FORMAT === "avif") {
    return image.avif({
      quality: DESKTOP_AVIF_QUALITY,
      effort: ENCODER_EFFORT,
      chromaSubsampling: "4:2:0",
    });
  }
  return image.webp({
    quality: DESKTOP_WEBP_QUALITY,
    effort: ENCODER_EFFORT,
    smartSubsample: true,
  });
}

function encodeMobile(image) {
  if (OUTPUT_FORMAT === "avif") {
    return image.avif({
      quality: MOBILE_AVIF_QUALITY,
      effort: ENCODER_EFFORT,
      chromaSubsampling: "4:2:0",
    });
  }
  return image.webp({
    quality: MOBILE_WEBP_QUALITY,
    effort: ENCODER_EFFORT,
    smartSubsample: true,
  });
}

async function encodeDesktopFrame(sourcePath, destPath) {
  await encode(resizeDesktop(sharp(sourcePath))).toFile(destPath);
}

async function main() {
  const files = (await readdir(SOURCE_DIR))
    .map((file) => ({ file, index: parseFrameNumber(file) }))
    .filter((entry) => entry.index !== null)
    .sort((a, b) => a.index - b.index)
    .map((entry) => entry.file);

  if (files.length === 0) {
    throw new Error(
      `No frames found in ${SOURCE_DIR}. Expected frame_000000.jpg-style names.`,
    );
  }

  const sourceFrameCount = files.length;

  await rm(OUT_BASE, { recursive: true, force: true });
  await mkdir(OUT_FRAMES, { recursive: true });
  await mkdir(OUT_MOBILE, { recursive: true });

  const firstPath = path.join(SOURCE_DIR, files[0]);
  const meta = await sharp(firstPath).metadata();
  const sourceWidth = meta.width;
  const sourceHeight = meta.height;
  const desktopWidth = Math.min(sourceWidth, DESKTOP_MAX_WIDTH);
  const desktopHeight = Math.round((sourceHeight / sourceWidth) * desktopWidth);

  console.log(`Found ${sourceFrameCount} source frames at ${sourceWidth}x${sourceHeight}`);
  console.log(
    `Encoding ${OUTPUT_FORMAT} — desktop ${desktopWidth}px stride ${DESKTOP_STRIDE}, mobile ${MOBILE_WIDTH}px stride ${MOBILE_STRIDE}, effort ${ENCODER_EFFORT}`,
  );

  const desktopFiles =
    DESKTOP_STRIDE <= 1 ? files : files.filter((_, i) => i % DESKTOP_STRIDE === 0);
  if (desktopFiles[desktopFiles.length - 1] !== files[files.length - 1]) {
    desktopFiles.push(files[files.length - 1]);
  }
  const desktopFrameCount = desktopFiles.length;
  const desktopPadWidth = String(desktopFrameCount).length;

  for (let i = 0; i < desktopFiles.length; i++) {
    await encodeDesktopFrame(
      path.join(SOURCE_DIR, desktopFiles[i]),
      path.join(OUT_FRAMES, frameName(i + 1, desktopPadWidth)),
    );
    if ((i + 1) % 60 === 0 || i + 1 === desktopFrameCount) {
      console.log(`  desktop ${i + 1}/${desktopFrameCount}`);
    }
  }

  const mobileFiles = files.filter((_, i) => i % MOBILE_STRIDE === 0);
  if (mobileFiles[mobileFiles.length - 1] !== files[files.length - 1]) {
    mobileFiles.push(files[files.length - 1]);
  }
  const mobileHeight = Math.round((sourceHeight / sourceWidth) * MOBILE_WIDTH);
  const mobilePadWidth = String(mobileFiles.length).length;

  for (let i = 0; i < mobileFiles.length; i++) {
    await encodeMobile(
      sharp(path.join(SOURCE_DIR, mobileFiles[i])).resize(MOBILE_WIDTH, mobileHeight),
    ).toFile(path.join(OUT_MOBILE, frameName(i + 1, mobilePadWidth)));
    if ((i + 1) % 40 === 0 || i + 1 === mobileFiles.length) {
      console.log(`  mobile ${i + 1}/${mobileFiles.length}`);
    }
  }

  await encode(resizeDesktop(sharp(firstPath))).toFile(
    path.join(OUT_BASE, `poster.${OUTPUT_FORMAT}`),
  );

  const manifest = {
    frameCount: desktopFrameCount,
    sourceFrameCount,
    desktopStride: DESKTOP_STRIDE,
    frameWidth: desktopWidth,
    frameHeight: desktopHeight,
    frameExtension: OUTPUT_FORMAT,
    mobileFrameCount: mobileFiles.length,
    mobileFrameWidth: MOBILE_WIDTH,
    mobileFrameHeight: mobileHeight,
    mobileFrameExtension: OUTPUT_FORMAT,
    posterExtension: OUTPUT_FORMAT,
    padWidth: desktopPadWidth,
    mobilePadWidth,
    encode: {
      desktop: {
        format: OUTPUT_FORMAT,
        maxWidth: DESKTOP_MAX_WIDTH,
        ...(OUTPUT_FORMAT === "avif"
          ? { quality: DESKTOP_AVIF_QUALITY }
          : { quality: DESKTOP_WEBP_QUALITY }),
        stride: DESKTOP_STRIDE,
        effort: ENCODER_EFFORT,
      },
      mobile: {
        format: OUTPUT_FORMAT,
        width: MOBILE_WIDTH,
        ...(OUTPUT_FORMAT === "avif"
          ? { quality: MOBILE_AVIF_QUALITY }
          : { quality: MOBILE_WEBP_QUALITY }),
        stride: MOBILE_STRIDE,
        effort: ENCODER_EFFORT,
      },
    },
    generatedAt: new Date().toISOString(),
  };

  await writeFile(path.join(OUT_BASE, "manifest.json"), JSON.stringify(manifest, null, 2));

  console.log(
    `Wrote ${desktopFrameCount} desktop + ${mobileFiles.length} mobile ${OUTPUT_FORMAT} frames.`,
  );
  console.log("Manifest:", manifest);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

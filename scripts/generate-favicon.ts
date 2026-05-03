/**
 * Generate `src/app/favicon.ico` from `src/app/icon.png`.
 *
 * Resizes the source to standard favicon sizes (16, 32, 48) using `sharp`
 * (already installed as a Next.js transitive dep) and then packs all three
 * into a multi-resolution `.ico` via `png-to-ico`.
 *
 * Usage:
 *   npx tsx scripts/generate-favicon.ts
 *   # or
 *   npm run favicon
 */
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";
import pngToIco from "png-to-ico";

const SRC = path.join("src", "app", "icon.png");
const DEST = path.join("src", "app", "favicon.ico");
const SIZES = [16, 32, 48];

async function main() {
  const source = readFileSync(SRC);

  const pngBuffers = await Promise.all(
    SIZES.map((size) =>
      sharp(source)
        .resize(size, size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .png()
        .toBuffer()
    )
  );

  const ico = await pngToIco(pngBuffers);
  writeFileSync(DEST, ico);
  console.log(
    `Wrote ${DEST} (${ico.byteLength} bytes) from ${SRC} at sizes ${SIZES.join(", ")}`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

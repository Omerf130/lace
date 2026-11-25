/**
 * Lightweight regression check for category image resolution logic.
 * Run: npx tsx scripts/validate-category-resolution.ts
 */
import { resolveOneCategoryImage } from "../src/lib/resolveCategoryImages";

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error("FAIL:", message);
    process.exit(1);
  }
}

const custom = resolveOneCategoryImage("https://example.com/w.jpg", "https://model");
assert(custom.source === "custom" && custom.url === "https://example.com/w.jpg", "custom wins");

const model = resolveOneCategoryImage("", "https://model");
assert(model.source === "model" && model.url === "https://model", "model fallback");

const placeholder = resolveOneCategoryImage(undefined, null);
assert(placeholder.source === "placeholder" && placeholder.url === null, "placeholder");

console.log("All category resolution checks passed.");
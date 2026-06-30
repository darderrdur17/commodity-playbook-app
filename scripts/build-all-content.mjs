/**
 * Regenerate src/data from content-sources HTML (runs on every Vercel build).
 */
import { spawnSync } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

const scripts = [
  "extract-glossary.mjs",
  "extract-shared-content.mjs",
  "build-case-studies-details.mjs",
  "extract-html-features.mjs",
];

for (const script of scripts) {
  const result = spawnSync("node", [path.join(__dirname, script)], {
    cwd: ROOT,
    stdio: "inherit",
  });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

console.log("[build:content] All content extracts completed.");

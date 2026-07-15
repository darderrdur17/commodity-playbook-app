/**
 * Resolve content file paths from repo content-sources/ (used on Vercel and locally).
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const REPO_SOURCES = path.join(ROOT, "content-sources");

/** @param {string} relativePath — path relative to content root (e.g. "Elite Pack/case-study-07.html") */
export function resolveContentPath(relativePath) {
  const p = path.join(REPO_SOURCES, relativePath);
  return fs.existsSync(p) ? p : null;
}

export function readContentFile(relativePath) {
  const p = resolveContentPath(relativePath);
  if (!p) {
    throw new Error(
      `Content file not found: ${relativePath}\nExpected in content-sources/.`
    );
  }
  return fs.readFileSync(p, "utf8");
}

/** Binary assets vendored under content-sources/assets/{assetKey} */
export function resolveRepoAssetPath(assetKey) {
  const candidates = [
    path.join(REPO_SOURCES, "assets", assetKey),
    path.join(ROOT, "public", "assets", assetKey),
  ];
  for (const p of candidates) {
    if (fs.existsSync(p)) return p;
  }
  return null;
}

export { REPO_SOURCES, ROOT };

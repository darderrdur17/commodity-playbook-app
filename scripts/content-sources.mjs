/**
 * Resolve content file paths — repo content-sources/ first, Shared Folder fallback (local dev).
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const REPO_SOURCES = path.join(ROOT, "content-sources");
const SHARED_SOURCES = path.join(ROOT, "..", "CommodityPlaybook - Shared Folder");

/** @param {string} relativePath — path relative to content root (e.g. "Elite Pack/case-study-07.html") */
export function resolveContentPath(relativePath) {
  const candidates = [
    path.join(REPO_SOURCES, relativePath),
    path.join(SHARED_SOURCES, relativePath),
  ];
  for (const p of candidates) {
    if (fs.existsSync(p)) return p;
  }
  return null;
}

export function readContentFile(relativePath) {
  const p = resolveContentPath(relativePath);
  if (!p) {
    throw new Error(
      `Content file not found: ${relativePath}\nExpected in content-sources/ (for Vercel) or Shared Folder (local).`
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

export { REPO_SOURCES, SHARED_SOURCES, ROOT };

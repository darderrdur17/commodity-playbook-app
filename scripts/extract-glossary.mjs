#!/usr/bin/env node
/**
 * Regenerate src/data/glossary.ts from desk-glossary_updated_24.06.html
 * Usage: node scripts/extract-glossary.mjs
 *
 * Source priority:
 * 1. content-sources/ in repo (used on Vercel — Shared Folder is NOT in git)
 * 2. ../CommodityPlaybook - Shared Folder/ (local dev fallback)
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outPath = path.resolve(__dirname, "../src/data/glossary.ts");

const CANDIDATE_PATHS = [
  path.resolve(__dirname, "../content-sources/desk-glossary_updated_24.06.html"),
  path.resolve(
    __dirname,
    "../../CommodityPlaybook - Shared Folder/Starter Pack/3. desk-glossary_updated_24.06.html"
  ),
];

function resolveHtmlPath() {
  for (const p of CANDIDATE_PATHS) {
    if (fs.existsSync(p)) return p;
  }
  return null;
}

const htmlPath = resolveHtmlPath();
if (!htmlPath) {
  if (fs.existsSync(outPath)) {
    console.warn(
      "Glossary HTML source not found — keeping existing src/data/glossary.ts (Vercel-safe fallback)."
    );
    process.exit(0);
  }
  console.error(
    "Glossary HTML not found. Expected content-sources/desk-glossary_updated_24.06.html in the repo."
  );
  process.exit(1);
}

const html = fs.readFileSync(htmlPath, "utf8");
const match = html.match(/const TERMS = \[([\s\S]*?)\];/);
if (!match) {
  console.error("Could not find TERMS array in HTML");
  process.exit(1);
}

const CAT_LABELS = {
  phys: "Physical markets",
  price: "Pricing & Derivatives",
  risk: "Risk & P&L",
  ops: "Operations & Scheduling",
  ship: "Shipping",
  lng: "Gas & LNG",
  oil: "Oil & Products",
  metal: "Metals & Mining",
  mi: "Market Intelligence & Analytics",
};

const BADGE_TEXT = {
  phys: "Physical",
  price: "Pricing",
  risk: "Risk",
  ops: "Ops",
  ship: "Shipping",
  lng: "Gas & LNG",
  oil: "Oil",
  metal: "Metals",
  mi: "Intel",
};

const CAT_ORDER = ["phys", "price", "risk", "ops", "ship", "lng", "oil", "metal", "mi"];

const entryRe =
  /\{cat:"([^"]+)",term:"((?:\\.|[^"\\])*)",def:"((?:\\.|[^"\\])*)",ctx:"((?:\\.|[^"\\])*)"\}/g;

const terms = [];
let m;
while ((m = entryRe.exec(match[1])) !== null) {
  const unescape = (s) =>
    s.replace(/\\'/g, "'").replace(/\\"/g, '"').replace(/\\n/g, "\n");
  terms.push({
    cat: m[1],
    term: unescape(m[2]),
    def: unescape(m[3]),
    ctx: unescape(m[4]),
  });
}

console.log(`Parsed ${terms.length} terms from ${path.relative(process.cwd(), htmlPath)}`);

const categories = CAT_ORDER.map((c) => CAT_LABELS[c]);
const badges = Object.fromEntries(CAT_ORDER.map((c) => [CAT_LABELS[c], BADGE_TEXT[c]]));

const lines = terms.map((t) => {
  const category = CAT_LABELS[t.cat];
  if (!category) console.warn(`Unknown category: ${t.cat} for ${t.term}`);
  const json = (s) => JSON.stringify(s);
  return `  {
    term: ${json(t.term)},
    definition: ${json(t.def)},
    context: ${json(t.ctx)},
    category: ${json(category ?? t.cat)},
  }`;
});

const file = `export interface GlossaryTerm {
  term: string;
  definition: string;
  context?: string;
  category: string;
}

export const GLOSSARY_CATEGORIES = [
${categories.map((c) => `  ${JSON.stringify(c)},`).join("\n")}
] as const;

/** Short badge labels — matches desk-glossary_updated_24.06.html */
export const GLOSSARY_CATEGORY_BADGES: Record<string, string> = {
${Object.entries(badges)
  .map(([k, v]) => `  ${JSON.stringify(k)}: ${JSON.stringify(v)},`)
  .join("\n")}
};

export const GLOSSARY_TERMS: GlossaryTerm[] = [
${lines.join(",\n")}
];
`;

fs.writeFileSync(outPath, file);
console.log(`Wrote ${outPath}`);

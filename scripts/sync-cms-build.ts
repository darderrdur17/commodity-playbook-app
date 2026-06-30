/**
 * Push latest glossary + resume templates from repo into Neon CMS during Vercel build.
 * Skips silently when DATABASE_URL is unset (local builds without DB).
 */
import { syncGlossaryFromDefaults } from "../src/lib/content/repository";
import { syncResumeTemplateAssets } from "../src/lib/content/resume-template-seed";

async function main() {
  if (!process.env.DATABASE_URL) {
    console.log("[sync-cms] DATABASE_URL not set — skipping CMS sync (local build OK).");
    return;
  }

  const glossary = await syncGlossaryFromDefaults();
  console.log(`[sync-cms] Glossary synced: ${glossary.termCount} terms`);

  const resumes = await syncResumeTemplateAssets();
  console.log(
    `[sync-cms] Resume templates synced: ${resumes.synced}/${resumes.total}${resumes.missing ? ` (${resumes.missing} missing files)` : ""}`
  );
}

main()
  .catch((err) => {
    console.error("[sync-cms] Failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    const { prisma } = await import("../src/lib/prisma");
    await prisma.$disconnect();
  });

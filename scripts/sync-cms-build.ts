/**
 * Push latest content from repo into Neon CMS during Vercel build.
 * Skips silently when DATABASE_URL is unset (local builds without DB).
 */
import { syncAllContentModulesFromDefaults } from "../src/lib/content/repository";
import { syncContentAssetsFromRepo } from "../src/lib/content/content-asset-seed";
import { syncResumeTemplateAssets } from "../src/lib/content/resume-template-seed";

async function main() {
  if (!process.env.DATABASE_URL) {
    console.log("[sync-cms] DATABASE_URL not set — skipping CMS sync (local build OK).");
    return;
  }

  const modules = await syncAllContentModulesFromDefaults();
  console.log(
    `[sync-cms] Content modules synced: ${modules.total} (${modules.created} created, ${modules.updated} updated, ${modules.unchanged} unchanged)`
  );

  const assets = await syncContentAssetsFromRepo();
  console.log(
    `[sync-cms] Download assets: ${assets.total} expected, ${assets.syncedFromRepo} from repo, ${assets.placeholders} placeholders, ${assets.skipped} unchanged`
  );

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

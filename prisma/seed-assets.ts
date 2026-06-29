import { PrismaClient } from "@prisma/client";
import { collectExpectedContentAssets } from "../src/lib/content/expected-assets";
import { createPlaceholderPdf } from "../src/lib/content/placeholder-pdf";

const prisma = new PrismaClient();

export async function seedContentAssetsIfMissing() {
  const admin = await prisma.user.findFirst({
    where: { role: "ADMIN" },
    select: { id: true },
  });

  const expected = collectExpectedContentAssets();
  let created = 0;
  let skipped = 0;

  for (const asset of expected) {
    const existing = await prisma.contentAsset.findUnique({
      where: { assetKey: asset.assetKey },
      select: { id: true },
    });
    if (existing) {
      skipped++;
      continue;
    }

    const data = createPlaceholderPdf(asset.label);
    await prisma.contentAsset.create({
      data: {
        fileName: asset.fileName,
        mimeType: "application/pdf",
        size: data.length,
        data,
        moduleSlug: asset.moduleSlug,
        assetKey: asset.assetKey,
        requiredTier: asset.requiredTier,
        label: asset.label,
        uploadedById: admin?.id,
      },
    });
    created++;
  }

  return { created, skipped, total: expected.length };
}

if (require.main === module) {
  seedContentAssetsIfMissing()
    .then((result) => {
      console.log(
        `Content assets: ${result.created} created, ${result.skipped} already present (${result.total} expected).`
      );
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    })
    .finally(() => prisma.$disconnect());
}

import fs from "fs";
import path from "path";
import { prisma } from "@/lib/prisma";
import { collectExpectedContentAssets } from "@/lib/content/expected-assets";
import { createPlaceholderPdf } from "@/lib/content/placeholder-pdf";

const REPO_ASSETS = path.resolve(process.cwd(), "content-sources/assets");
const PUBLIC_ASSETS = path.resolve(process.cwd(), "public/assets");

function resolveAssetFilePath(assetKey: string): string | null {
  for (const base of [REPO_ASSETS, PUBLIC_ASSETS]) {
    const p = path.join(base, assetKey);
    if (fs.existsSync(p)) return p;
  }
  return null;
}

function mimeForFileName(fileName: string): string {
  if (fileName.endsWith(".pdf")) return "application/pdf";
  if (fileName.endsWith(".docx")) {
    return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
  }
  if (fileName.endsWith(".png")) return "image/png";
  if (fileName.endsWith(".jpg") || fileName.endsWith(".jpeg")) return "image/jpeg";
  return "application/octet-stream";
}

/** Sync playbook + starter-pack download files from repo; placeholder if missing in DB. */
export async function syncContentAssetsFromRepo() {
  const admin = await prisma.user.findFirst({
    where: { role: "ADMIN" },
    select: { id: true },
  });

  const expected = collectExpectedContentAssets();
  let syncedFromRepo = 0;
  let placeholders = 0;
  let skipped = 0;

  for (const asset of expected) {
    const filePath = resolveAssetFilePath(asset.assetKey);
    const existing = await prisma.contentAsset.findUnique({
      where: { assetKey: asset.assetKey },
      select: { id: true },
    });

    if (filePath) {
      const data = fs.readFileSync(filePath);
      const payload = {
        fileName: asset.fileName,
        mimeType: mimeForFileName(asset.fileName),
        size: data.length,
        data,
        moduleSlug: asset.moduleSlug,
        assetKey: asset.assetKey,
        requiredTier: asset.requiredTier,
        label: asset.label,
        uploadedById: admin?.id,
      };
      if (existing) {
        await prisma.contentAsset.update({ where: { id: existing.id }, data: payload });
      } else {
        await prisma.contentAsset.create({ data: payload });
      }
      syncedFromRepo++;
      continue;
    }

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
    placeholders++;
  }

  return {
    total: expected.length,
    syncedFromRepo,
    placeholders,
    skipped,
  };
}

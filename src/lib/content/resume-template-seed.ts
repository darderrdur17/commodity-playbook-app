import fs from "fs";
import path from "path";
import { prisma } from "@/lib/prisma";
import { buildContentAssetKey } from "@/lib/content/asset-files";
import { RESUME_TEMPLATES } from "@/data/resume-templates";

const SHARED_RESUME_DIR = path.resolve(
  process.cwd(),
  "../CommodityPlaybook - Shared Folder/Pro Pack/2.Persona Analysis Quiz_Resume Templates"
);
const PUBLIC_TEMPLATES_DIR = path.resolve(process.cwd(), "public/templates");

function resolveTemplatePath(fileName: string): string | null {
  const candidates = [
    path.join(SHARED_RESUME_DIR, fileName),
    path.join(PUBLIC_TEMPLATES_DIR, fileName),
  ];
  for (const p of candidates) {
    if (fs.existsSync(p)) return p;
  }
  return null;
}

const DOCX_MIME = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

/** Seed or refresh Pro resume .docx files from the shared Starter Pack folder. */
export async function syncResumeTemplateAssets() {
  const admin = await prisma.user.findFirst({
    where: { role: "ADMIN" },
    select: { id: true },
  });

  let synced = 0;
  let missing = 0;

  for (const template of RESUME_TEMPLATES) {
    const filePath = resolveTemplatePath(template.templateFile);
    const assetKey = buildContentAssetKey("resume-templates", template.templateFile);

    if (!filePath) {
      missing++;
      continue;
    }

    const data = fs.readFileSync(filePath);
    const existing = await prisma.contentAsset.findUnique({
      where: { assetKey },
      select: { id: true },
    });

    const payload = {
      fileName: template.templateFile,
      mimeType: DOCX_MIME,
      size: data.length,
      data,
      moduleSlug: "resume-templates",
      assetKey,
      requiredTier: "PRO" as const,
      label: `${template.label} · Resume Template`,
      uploadedById: admin?.id,
    };

    if (existing) {
      await prisma.contentAsset.update({ where: { id: existing.id }, data: payload });
    } else {
      await prisma.contentAsset.create({ data: payload });
    }
    synced++;
  }

  return { synced, missing, total: RESUME_TEMPLATES.length };
}

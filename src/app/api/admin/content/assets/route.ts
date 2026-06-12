import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import {
  resolveContentAssetMimeType,
  validateContentAssetFile,
} from "@/lib/content/asset-files";
import {
  attachUploadedAssetToModule,
  listContentAssets,
  upsertContentAsset,
} from "@/lib/content/repository";
import type { ContentSlug } from "@/lib/content/modules";
import { getModuleMeta } from "@/lib/content/modules";
import type { Tier } from "@prisma/client";

export async function GET(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const moduleSlug = req.nextUrl.searchParams.get("module") || undefined;
  const assets = await listContentAssets(moduleSlug);
  return NextResponse.json({ assets });
}

export async function POST(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "file is required" }, { status: 400 });
  }

  const validationError = validateContentAssetFile(file.name, file.size);
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const mimeType = resolveContentAssetMimeType(file.name, file.type);
  const moduleSlug = (form.get("moduleSlug") as string) || undefined;
  const assetKey = (form.get("assetKey") as string) || undefined;
  const label = (form.get("label") as string) || undefined;
  const requiredTier = (form.get("requiredTier") as Tier) || "PRO";

  const asset = await upsertContentAsset({
    fileName: file.name,
    mimeType,
    data: buffer,
    moduleSlug,
    assetKey,
    requiredTier,
    label,
    uploadedById: session.user.id,
  });

  if (moduleSlug && getModuleMeta(moduleSlug)) {
    await attachUploadedAssetToModule(
      moduleSlug as ContentSlug,
      { id: asset.id, fileName: asset.fileName, assetKey: asset.assetKey },
      session.user.id
    );
  }

  return NextResponse.json({
    id: asset.id,
    fileName: asset.fileName,
    size: asset.size,
    url: `/api/content/assets/${asset.id}`,
    assetKey: asset.assetKey,
    moduleSlug: asset.moduleSlug,
    replaced: Boolean(assetKey),
  });
}

import { PLAYBOOK_ASSETS } from "@/data/playbook-assets";
import { STARTER_INFOGRAPHICS } from "@/data/starter-pack";
import type { Tier } from "@prisma/client";

export interface ExpectedAsset {
  assetKey: string;
  fileName: string;
  moduleSlug: string;
  requiredTier: Tier;
  label: string;
}

export function collectExpectedContentAssets(): ExpectedAsset[] {
  const assets: ExpectedAsset[] = [];

  for (const [chapterId, sections] of Object.entries(PLAYBOOK_ASSETS)) {
    for (const [sectionId, items] of Object.entries(sections)) {
      for (const item of items) {
        if (!item.fileKey) continue;
        assets.push({
          assetKey: item.fileKey,
          fileName: item.fileKey.split("/").pop() ?? `${item.title}.pdf`,
          moduleSlug: "playbook",
          requiredTier: "PRO",
          label: `${chapterId.toUpperCase()}.${sectionId.replace(/^\D+/, "")} · ${item.title}`,
        });
      }
    }
  }

  for (const info of STARTER_INFOGRAPHICS) {
    assets.push({
      assetKey: info.fileKey,
      fileName: info.fileKey.split("/").pop() ?? `${info.id}.pdf`,
      moduleSlug: "starter-pack",
      requiredTier: "STARTER",
      label: info.title,
    });
  }

  return assets;
}

import assetsJson from "./playbook-assets.json";

export interface SectionAsset {
  type: "Infographic" | "Framework" | "Worked Example" | string;
  title: string;
  description: string;
  fileKey?: string;
}

type AssetsByChapter = Record<string, Record<string, SectionAsset[]>>;

export const PLAYBOOK_ASSETS = assetsJson as AssetsByChapter;

export function getSectionAssets(chapterId: string, sectionId: string): SectionAsset[] {
  return PLAYBOOK_ASSETS[chapterId]?.[sectionId] ?? [];
}

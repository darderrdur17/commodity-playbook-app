import type { PersonaId } from "@/lib/persona-quiz";
import { PERSONA_ARCHETYPES } from "@/data/persona-archetypes";
import { buildContentAssetKey } from "@/lib/content/asset-files";

/** Resolve tier-gated CMS asset URL or static fallback for a persona template .docx */
export function resolveResumeTemplateDownloadUrl(
  personaId: PersonaId,
  assetUrls: Record<string, string> = {}
): string {
  const templateFile = PERSONA_ARCHETYPES[personaId].templateFile;
  return resolveResumeTemplateFileUrl(templateFile, assetUrls);
}

export function resolveResumeTemplateFileUrl(
  templateFile: string,
  assetUrls: Record<string, string> = {}
): string {
  const assetKey = buildContentAssetKey("resume-templates", templateFile);
  return (
    assetUrls[templateFile] ||
    assetUrls[assetKey] ||
    assetUrls[`resume-templates/${templateFile}`] ||
    `/templates/${templateFile}`
  );
}

export function apiPersonaToPersonaId(persona: string | null | undefined): PersonaId | null {
  if (!persona) return null;
  const map: Record<string, PersonaId> = {
    CAREER_SWITCHER: "switcher",
    INSIDER: "insider",
    ANALYST_TRADER: "analyst",
    VENDOR: "vendor",
    FRESH_GRAD: "fresh_grad",
  };
  return map[persona] ?? null;
}

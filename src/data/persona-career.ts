import type { ApiPersona } from "@/lib/persona-map";
import type { PersonaId } from "@/lib/persona-quiz";

export interface PersonaCareerGuide {
  headline: string;
  tip: string;
  /** Career roadmap role slugs to highlight */
  recommendedRoleSlugs: string[];
  /** Resume template persona id */
  resumePersonaId: PersonaId;
  /** Q2 timeline quarter to emphasise (0-based) — resume rewrite is Q2 */
  focusQuarterIndex: number;
}

export const PERSONA_CAREER_GUIDES: Record<ApiPersona, PersonaCareerGuide> = {
  FRESH_GRAD: {
    headline: "Pick one entry track — then prove commercial curiosity",
    tip: "Lock in analytics, scheduling/ops, or risk before you apply. Use the Fresh Graduate template and build one market evidence piece in Q2.",
    recommendedRoleSlugs: [
      "quantitative-data-analyst",
      "scheduling-operations",
      "risk-analyst",
      "trading-analyst",
    ],
    resumePersonaId: "fresh_grad",
    focusQuarterIndex: 1,
  },
  CAREER_SWITCHER: {
    headline: "Translate your background into desk language",
    tip: "Target front-office analyst and origination roles. The Switcher template leads with Market Knowledge — mirror that in your Q2 resume rewrite.",
    recommendedRoleSlugs: ["trading-analyst", "commercial-origination", "research-analyst"],
    resumePersonaId: "switcher",
    focusQuarterIndex: 1,
  },
  INSIDER: {
    headline: "Bridge operations experience to commercial roles",
    tip: "Scheduling and ops → desk is the most common internal path. Reframe every bullet as a commercial decision your Insider template enables.",
    recommendedRoleSlugs: [
      "scheduling-operations",
      "commercial-origination",
      "trading-analyst",
      "etrm-specialist",
    ],
    resumePersonaId: "insider",
    focusQuarterIndex: 1,
  },
  ANALYST_TRADER: {
    headline: "Connect models to positions and P&L",
    tip: "Quant and trading analyst roles reward market views, not just modelling skill. Use the Analyst-to-Trader template in Q2 and attach a view to every project.",
    recommendedRoleSlugs: [
      "quantitative-data-analyst",
      "trading-analyst",
      "research-analyst",
      "risk-analyst",
    ],
    resumePersonaId: "analyst",
    focusQuarterIndex: 1,
  },
  VENDOR: {
    headline: "Reframe intelligence work as market knowledge",
    tip: "Vendor Solutions and research-adjacent roles value desk fluency. Strip sales metrics — the Vendor template shows how to lead with coverage and decisions enabled.",
    recommendedRoleSlugs: [
      "vendor-solutions-presales",
      "research-analyst",
      "trading-analyst",
      "quantitative-data-analyst",
    ],
    resumePersonaId: "vendor",
    focusQuarterIndex: 1,
  },
};

/** Map quiz Q3 entry track to additional role slugs */
export const ENTRY_TRACK_ROLE_SLUGS: Record<string, string[]> = {
  front: ["trading-analyst", "commercial-origination", "trader"],
  analytics: ["quantitative-data-analyst", "trading-analyst", "research-analyst"],
  ops: ["scheduling-operations", "etrm-specialist"],
  risk: ["risk-analyst", "commodity-trade-finance"],
  open: ["quantitative-data-analyst", "scheduling-operations", "risk-analyst"],
};

export function getPersonaCareerGuide(persona: string | null | undefined) {
  if (!persona) return null;
  return PERSONA_CAREER_GUIDES[persona as ApiPersona] ?? null;
}

export function getRecommendedRoleSlugs(
  persona: string | null | undefined,
  entryTrack?: string | null
): string[] {
  const guide = getPersonaCareerGuide(persona);
  const base = guide?.recommendedRoleSlugs ?? [];
  const fromTrack = entryTrack ? (ENTRY_TRACK_ROLE_SLUGS[entryTrack] ?? []) : [];
  return [...new Set([...base, ...fromTrack])];
}

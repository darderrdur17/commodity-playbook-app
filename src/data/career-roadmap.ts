import rawRoles from "./career-roadmap-raw.json";

export type RoleCategory = "front" | "ops" | "middle" | "adjacent";

export interface CareerRole {
  id: number;
  slug: string;
  cat: RoleCategory;
  categoryLabel: string;
  title: string;
  tags: { label: string; variant: string }[];
  summary: string;
  difficulty: "low" | "med" | "high";
  timeline: string;
  firms: string;
  what: string;
  backgrounds: string[];
  redFlags: string[];
  comp: { label: string; range: string }[];
  upgrade: string;
}

const CAT_LABELS: Record<RoleCategory, string> = {
  front: "Front Office",
  ops: "Operations",
  middle: "Middle Office",
  adjacent: "Adjacent",
};

function stripHtml(html: string) {
  return html.replace(/<\/?strong>/g, "").replace(/&amp;/g, "&");
}

export const CAREER_ROLES: CareerRole[] = (rawRoles as typeof rawRoles).map((r) => ({
  id: r.id,
  slug: r.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
  cat: r.cat as RoleCategory,
  categoryLabel: CAT_LABELS[r.cat as RoleCategory],
  title: r.title,
  tags: r.tags.map((t) => ({ label: t.l, variant: t.c })),
  summary: r.summary,
  difficulty: r.diff as CareerRole["difficulty"],
  timeline: r.timeline,
  firms: r.firms,
  what: stripHtml(r.what),
  backgrounds: r.backgrounds.map(stripHtml),
  redFlags: r.redflags,
  comp: r.comp.map((c) => ({ label: c.l, range: stripHtml(c.r) })),
  upgrade: stripHtml(r.upgrade),
}));

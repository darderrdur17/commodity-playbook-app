import type { Tier } from "@prisma/client";

export type ContentSlug =
  | "glossary"
  | "playbook"
  | "resume-templates"
  | "career-roadmap"
  | "interview-questions"
  | "knowledge-test"
  | "case-studies"
  | "desk-channel"
  | "job-openings";

export interface ContentModuleMeta {
  slug: ContentSlug;
  title: string;
  description: string;
  requiredTier: Tier;
}

export const CONTENT_MODULE_META: ContentModuleMeta[] = [
  {
    slug: "glossary",
    title: "Desk Glossary",
    description: "Searchable commodity trading terms",
    requiredTier: "STARTER",
  },
  {
    slug: "playbook",
    title: "Full Playbook",
    description: "5 chapters, 40 sections of playbook content",
    requiredTier: "PRO",
  },
  {
    slug: "resume-templates",
    title: "Resume Templates",
    description: "Persona-specific resume templates and quiz",
    requiredTier: "PRO",
  },
  {
    slug: "career-roadmap",
    title: "Career Roadmap",
    description: "10 role blueprints with comp and upgrade paths",
    requiredTier: "PRO",
  },
  {
    slug: "interview-questions",
    title: "Interview Questions",
    description: "50 desk interview Q&As with model answers",
    requiredTier: "PRO",
  },
  {
    slug: "knowledge-test",
    title: "Knowledge Test",
    description: "20-question gap analysis quiz",
    requiredTier: "PRO",
  },
  {
    slug: "case-studies",
    title: "Case Studies",
    description: "10 trading scenarios with P&L breakdowns",
    requiredTier: "ELITE",
  },
  {
    slug: "desk-channel",
    title: "Desk Channel",
    description: "40 practitioner Q&As across 5 segments",
    requiredTier: "ELITE",
  },
  {
    slug: "job-openings",
    title: "Job Openings",
    description: "Curated commodity trading roles",
    requiredTier: "ELITE",
  },
];

export function getModuleMeta(slug: string): ContentModuleMeta | undefined {
  return CONTENT_MODULE_META.find((m) => m.slug === slug);
}

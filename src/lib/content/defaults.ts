import { CHAPTERS } from "@/data/playbook";
import playbookSections from "@/data/playbook-sections.json";
import { CASE_STUDIES, CASE_STUDY_DETAILS } from "@/data/case-studies";
import { DESK_CATEGORIES, DESK_QA } from "@/data/desk-channel";
import { GLOSSARY_TERMS } from "@/data/glossary";
import { INTERVIEW_QUESTIONS, INTERVIEW_CATEGORIES } from "@/data/interview-questions";
import { KNOWLEDGE_TEST } from "@/data/knowledge-test";
import { CAREER_ROLES } from "@/data/career-roadmap";
import { RESUME_TEMPLATES, PERSONA_QUIZ_QUESTIONS } from "@/data/resume-templates";
import { JOB_OPENINGS, JOB_REGIONS, JOB_LEVELS, JOB_SEGMENTS } from "@/data/job-openings";
import type { ContentSlug } from "./modules";

export function getDefaultPayload(slug: ContentSlug): unknown {
  switch (slug) {
    case "glossary":
      return { terms: GLOSSARY_TERMS };
    case "playbook":
      return { chapters: CHAPTERS, sections: playbookSections };
    case "case-studies":
      return { studies: CASE_STUDIES, details: CASE_STUDY_DETAILS };
    case "desk-channel":
      return { categories: DESK_CATEGORIES, questions: DESK_QA };
    case "interview-questions":
      return { questions: INTERVIEW_QUESTIONS, categories: INTERVIEW_CATEGORIES };
    case "knowledge-test":
      return { questions: KNOWLEDGE_TEST };
    case "career-roadmap":
      return { roles: CAREER_ROLES };
    case "resume-templates":
      return { templates: RESUME_TEMPLATES, quiz: PERSONA_QUIZ_QUESTIONS };
    case "job-openings":
      return {
        jobs: JOB_OPENINGS,
        regions: JOB_REGIONS,
        levels: JOB_LEVELS,
        segments: JOB_SEGMENTS,
      };
    default:
      return {};
  }
}

export function getAllDefaultPayloads(): Record<ContentSlug, unknown> {
  return {
    glossary: getDefaultPayload("glossary"),
    playbook: getDefaultPayload("playbook"),
    "resume-templates": getDefaultPayload("resume-templates"),
    "career-roadmap": getDefaultPayload("career-roadmap"),
    "interview-questions": getDefaultPayload("interview-questions"),
    "knowledge-test": getDefaultPayload("knowledge-test"),
    "case-studies": getDefaultPayload("case-studies"),
    "desk-channel": getDefaultPayload("desk-channel"),
    "job-openings": getDefaultPayload("job-openings"),
  };
}

import extrasJson from "./career-roadmap-extras.json";

export interface FunctionMatrixRow {
  role: string;
  difficulty: string;
  category: string;
  pathToDesk: string;
  keySkills: string;
}

export interface TimelineQuarter {
  quarter: string;
  title: string;
  items: string[];
}

export interface NavigationGuideSection {
  title: string;
  body: string;
  bullets: string[];
}

export interface NavigationGuide {
  eyebrow: string;
  title: string;
  description: string;
  sections: NavigationGuideSection[];
}

export interface CompBenchmarkCard {
  role: string;
  range: string;
  note: string;
}

export interface CompBenchmarks {
  eyebrow: string;
  title: string;
  description: string;
  cards: CompBenchmarkCard[];
  footnote: string;
}

type CareerRoadmapExtrasJson = {
  functionMatrix: FunctionMatrixRow[];
  timeline12Month: TimelineQuarter[];
};

const extras = extrasJson as CareerRoadmapExtrasJson;

export const FUNCTION_MATRIX: FunctionMatrixRow[] = extras.functionMatrix;
export const TIMELINE_12_MONTH: TimelineQuarter[] = extras.timeline12Month;

export { NAVIGATION_GUIDE, COMP_BENCHMARKS } from "./career-roadmap-guide";

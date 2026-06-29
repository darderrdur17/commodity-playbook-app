import extras from "./career-roadmap-extras.json";

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

export const FUNCTION_MATRIX: FunctionMatrixRow[] = extras.functionMatrix;
export const TIMELINE_12_MONTH: TimelineQuarter[] = extras.timeline12Month;

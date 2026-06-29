import bank from "./interview-questions-bank.json";

export type InterviewTab = "technical" | "commercial" | "behavioural" | "elimination";
export type InterviewDifficulty = "easy" | "med" | "hard";

export interface InterviewQuestion {
  id: string;
  tab: InterviewTab;
  category: string;
  question: string;
  modelAnswer: string;
  difficulty?: InterviewDifficulty;
  framework?: string;
  interviewTip?: string;
  weakAnswer?: string;
  why?: string;
}

export interface InterviewTabMeta {
  id: InterviewTab;
  label: string;
  count: number;
}

export const INTERVIEW_TABS: InterviewTabMeta[] = bank.tabs as InterviewTabMeta[];
export const INTERVIEW_QUESTIONS: InterviewQuestion[] = bank.questions as InterviewQuestion[];

export const INTERVIEW_CATEGORIES = [
  "All",
  ...Array.from(new Set(INTERVIEW_QUESTIONS.map((q) => q.category))),
];

export const INTERVIEW_DIFFICULTIES: { id: InterviewDifficulty | "all"; label: string }[] = [
  { id: "all", label: "All levels" },
  { id: "easy", label: "Easy" },
  { id: "med", label: "Medium" },
  { id: "hard", label: "Hard" },
];

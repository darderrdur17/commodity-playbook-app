export type PersonaId = "switcher" | "insider" | "analyst" | "vendor" | "fresh_grad";

export type ApiPersona =
  | "FRESH_GRAD"
  | "CAREER_SWITCHER"
  | "INSIDER"
  | "ANALYST_TRADER"
  | "VENDOR";

export interface QuizAnswers {
  q1?: string;
  q2?: string;
  q3?: string;
  q4?: string;
  q5?: string;
}

const PERSONAS: PersonaId[] = ["switcher", "insider", "analyst", "vendor", "fresh_grad"];

export const PERSONA_ID_TO_API: Record<PersonaId, ApiPersona> = {
  fresh_grad: "FRESH_GRAD",
  switcher: "CAREER_SWITCHER",
  insider: "INSIDER",
  analyst: "ANALYST_TRADER",
  vendor: "VENDOR",
};

function emptyScores(): Record<PersonaId, number> {
  return { switcher: 0, insider: 0, analyst: 0, vendor: 0, fresh_grad: 0 };
}

function addScores(target: Record<PersonaId, number>, weights: Partial<Record<PersonaId, number>>) {
  for (const p of PERSONAS) {
    if (weights[p]) target[p] += weights[p]!;
  }
}

export function scorePersonaQuiz(answers: QuizAnswers) {
  const scores = emptyScores();

  const q1Map: Record<string, Partial<Record<PersonaId, number>>> = {
    switcher: { switcher: 10 },
    insider: { insider: 10 },
    analyst: { analyst: 10 },
    vendor: { vendor: 10 },
    grad: { fresh_grad: 10 },
    fresh_grad: { fresh_grad: 10 },
  };
  if (answers.q1) addScores(scores, q1Map[answers.q1] ?? {});

  const q2Map: Record<string, Partial<Record<PersonaId, number>>> = {
    "0-1": { fresh_grad: 6, analyst: 1 },
    "1-3": { fresh_grad: 3, analyst: 2, insider: 2, switcher: 2 },
    "3-7": { switcher: 3, insider: 3, analyst: 3, vendor: 3 },
    "7+": { switcher: 4, vendor: 3, insider: 2, analyst: 1 },
  };
  if (answers.q2) addScores(scores, q2Map[answers.q2] ?? {});

  const q3Map: Record<string, Partial<Record<PersonaId, number>>> = {
    front: { switcher: 3, insider: 2, analyst: 2 },
    analytics: { analyst: 6 },
    ops: { insider: 6 },
    risk: { analyst: 3, switcher: 1 },
    open: { fresh_grad: 2 },
  };
  if (answers.q3) addScores(scores, q3Map[answers.q3] ?? {});

  const q4Map: Record<string, Partial<Record<PersonaId, number>>> = {
    translate: { switcher: 8 },
    commercial: { insider: 8 },
    technical: { analyst: 8 },
    thin: { fresh_grad: 8 },
    sales: { vendor: 8 },
  };
  if (answers.q4) addScores(scores, q4Map[answers.q4] ?? {});

  let personaId: PersonaId = "fresh_grad";
  let top = -1;
  let second = -1;
  for (const p of PERSONAS) {
    if (scores[p] > top) {
      second = top;
      top = scores[p];
      personaId = p;
    } else if (scores[p] > second) {
      second = scores[p];
    }
  }

  const total = PERSONAS.reduce((n, p) => n + scores[p], 0);
  const confidence = total > 0 ? Math.min(Math.max(Math.round(((top - second) / total) * 100), 35), 98) : 35;

  return { personaId, confidence, scores };
}

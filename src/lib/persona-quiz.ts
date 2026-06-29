export type PersonaId = "switcher" | "insider" | "analyst" | "vendor" | "fresh_grad";

export interface QuizAnswers {
  q1?: string;
  q2?: string;
  q3?: string;
  q4?: string;
  q5?: string;
}

export interface PersonaScoreResult {
  personaId: PersonaId;
  scores: Record<PersonaId, number>;
  confidence: number;
  marketFocus?: string;
  entryTrack?: string;
}

const PERSONAS: PersonaId[] = ["switcher", "insider", "analyst", "vendor", "fresh_grad"];

const MARKET_LABELS: Record<string, string> = {
  lng: "LNG and natural gas",
  crude: "Crude oil and refined products",
  multi: "Multiple commodities / broad downstream",
  other: "Broad commodity focus",
  oil: "Crude oil and refined products",
  gas: "Natural gas, LNG, or power",
  metals: "Base or precious metals",
  ags: "Agriculture or soft commodities",
};

const ENTRY_TRACK: Record<string, string> = {
  front: "Front office — trader or commercial path",
  analytics: "Analytics / quantitative research track",
  ops: "Scheduling, operations, or ETRM track",
  risk: "Risk management or trade finance track",
  open: "Explore analytics, ops, or risk before committing",
};

function emptyScores(): Record<PersonaId, number> {
  return { switcher: 0, insider: 0, analyst: 0, vendor: 0, fresh_grad: 0 };
}

function addScores(target: Record<PersonaId, number>, weights: Partial<Record<PersonaId, number>>) {
  for (const p of PERSONAS) {
    if (weights[p]) target[p] += weights[p]!;
  }
}

/** Weighted archetype scoring aligned with commodity-playbook-resume.html + career roadmap entry paths. */
export function scorePersonaQuiz(answers: QuizAnswers): PersonaScoreResult {
  const scores = emptyScores();

  // Q1 — primary background (strongest signal)
  const q1Map: Record<string, Partial<Record<PersonaId, number>>> = {
    switcher: { switcher: 10 },
    insider: { insider: 10 },
    analyst: { analyst: 10 },
    vendor: { vendor: 10 },
    grad: { fresh_grad: 10 },
    fresh_grad: { fresh_grad: 10 },
  };
  if (answers.q1) addScores(scores, q1Map[answers.q1] ?? {});

  // Q2 — experience years (validates or contradicts Q1)
  const q2Map: Record<string, Partial<Record<PersonaId, number>>> = {
    "0-1": { fresh_grad: 6, analyst: 1 },
    "1-3": { fresh_grad: 3, analyst: 2, insider: 2, switcher: 2 },
    "3-7": { switcher: 3, insider: 3, analyst: 3, vendor: 3 },
    "7+": { switcher: 4, vendor: 3, insider: 2, analyst: 1 },
  };
  if (answers.q2) addScores(scores, q2Map[answers.q2] ?? {});

  // Q3 — target function (career roadmap zones)
  const q3Map: Record<string, Partial<Record<PersonaId, number>>> = {
    front: { switcher: 3, insider: 2, analyst: 2 },
    analytics: { analyst: 6 },
    ops: { insider: 6 },
    risk: { analyst: 3, switcher: 1 },
    open: { fresh_grad: 2 },
  };
  if (answers.q3) addScores(scores, q3Map[answers.q3] ?? {});

  // Q4 — resume challenge (template-specific, high weight)
  const q4Map: Record<string, Partial<Record<PersonaId, number>>> = {
    translate: { switcher: 8 },
    commercial: { insider: 8 },
    technical: { analyst: 8 },
    thin: { fresh_grad: 8 },
    sales: { vendor: 8 },
    evidence: { fresh_grad: 8 },
    vendor: { vendor: 8 },
  };
  if (answers.q4) addScores(scores, q4Map[answers.q4] ?? {});

  // Q5 — market focus (light tie-breaker toward analyst/vendor for data-heavy markets)
  const q5Map: Record<string, Partial<Record<PersonaId, number>>> = {
    lng: { analyst: 1, insider: 1 },
    crude: { switcher: 1, insider: 1 },
    multi: { switcher: 1, vendor: 1 },
    other: { fresh_grad: 1 },
    oil: { switcher: 1, insider: 1 },
    gas: { analyst: 1, insider: 1 },
    metals: { analyst: 1 },
    ags: { vendor: 1 },
  };
  if (answers.q5) addScores(scores, q5Map[answers.q5] ?? {});

  // Resolve winner
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
  const confidence = total > 0 ? Math.round(((top - second) / total) * 100) : 0;

  return {
    personaId,
    scores,
    confidence: Math.min(Math.max(confidence, 35), 98),
    marketFocus: answers.q5 ? MARKET_LABELS[answers.q5] : undefined,
    entryTrack: answers.q3 ? ENTRY_TRACK[answers.q3] : undefined,
  };
}

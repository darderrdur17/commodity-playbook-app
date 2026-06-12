import { DESK_QA } from "./desk-channel";

export interface InterviewQuestion {
  id: string;
  category: string;
  question: string;
  modelAnswer: string;
  tags: string[];
  interviewTip?: string;
}

const EXTRA_QUESTIONS: InterviewQuestion[] = [
  {
    id: "iv-41",
    category: "Physical Markets",
    question: "What is the difference between physical and paper commodity trading?",
    modelAnswer:
      "Physical trading arranges the movement of real cargoes — vessels, ports, specs, delivery windows, and counterparty credit. Paper trading uses futures, swaps, and options to manage price risk. They are connected: physical desks hedge with paper; paper markets anchor to physical assessments. Physical requires freight, laytime, and operations fluency that paper-only backgrounds often lack.",
    tags: ["Physical", "Paper", "Hedging"],
    interviewTip: "Hiring managers want to hear logistics language, not just chart patterns.",
  },
  {
    id: "iv-42",
    category: "Physical Markets",
    question: "Name the six revenue levers a physical desk uses.",
    modelAnswer:
      "Flat price, time spread (contango/backwardation), location differential, quality differential, freight, and optionality. Most physical P&L combines two or three levers simultaneously — not outright directional bets on flat price alone.",
    tags: ["P&L", "Arbitrage", "Freight"],
  },
  {
    id: "iv-43",
    category: "Paper Markets",
    question: "What is basis risk in commodity hedging?",
    modelAnswer:
      "Basis risk is the risk that the hedge instrument does not move in line with the physical exposure. Hedging Dubai crude with Brent futures leaves Dubai-Brent basis risk. The hedge removes much flat price risk but not the differential between your physical grade, location, and the benchmark.",
    tags: ["Basis", "Hedge", "Risk"],
  },
  {
    id: "iv-44",
    category: "Freight & Logistics",
    question: "What is demurrage and when does it apply?",
    modelAnswer:
      "Demurrage is compensation paid to the vessel owner when loading or discharge exceeds allowed laytime. It is a direct P&L line for the charterer. A few hours in port can cost six figures on a VLCC — schedulers and traders track laytime clocks continuously.",
    tags: ["Demurrage", "Laytime", "Operations"],
  },
  {
    id: "iv-45",
    category: "Market Intelligence",
    question: "How do Platts and Argus assess physical benchmark prices?",
    modelAnswer:
      "PRAs collect transaction data and market intelligence during a defined window — often the last 30 minutes (MOC). Assessments reflect where physical cargoes actually traded or would trade. Thin markets give reporters more discretion; understanding methodology explains benchmark vs futures divergence.",
    tags: ["Platts", "Argus", "Benchmark"],
  },
  {
    id: "iv-46",
    category: "Risk",
    question: "What is VaR on a commodity desk — and what does it not capture?",
    modelAnswer:
      "VaR estimates maximum expected loss over a horizon at a confidence level given current positions. It captures mark-to-market volatility on financial exposures but may understate basis risk, physical delivery risk, option gamma, and liquidity in stress. Desks pair VaR with stress tests and hard position limits.",
    tags: ["VaR", "Limits", "Risk"],
  },
  {
    id: "iv-47",
    category: "Commercial",
    question: "Walk me through evaluating a cargo diversion decision.",
    modelAnswer:
      "Compare destination netbacks: sale price minus freight, canal fees, demurrage risk, and credit. If the alternate destination spread exceeds rerouting cost plus operational risk, diversion is commercial. Time pressure matters — nominations and terminal slots have hard windows.",
    tags: ["Diversion", "Arbitrage", "LNG"],
  },
  {
    id: "iv-48",
    category: "Cross-Market",
    question: "Why does DXY often correlate negatively with Brent?",
    modelAnswer:
      "Crude is USD-denominated. Dollar strength raises effective cost for non-USD buyers, can trigger managed-money unwind of long commodity/short USD trades, and signals tighter financial conditions. Physical tightness can be overwhelmed by financial selling when the dollar moves sharply.",
    tags: ["DXY", "Macro", "Brent"],
  },
  {
    id: "iv-49",
    category: "Refining",
    question: "What does a crack spread tell the desk?",
    modelAnswer:
      "The crack spread is the margin between crude input and product output (e.g. 3-2-1 gasoline plus distillate minus crude). Compression signals refinery margin pressure and potential run cuts; expansion signals strong product demand relative to crude. Desks trade cracks, not just flat crude.",
    tags: ["Crack Spread", "Refining", "Margin"],
  },
  {
    id: "iv-50",
    category: "Career",
    question: "How would you demonstrate commercial curiosity as a fresh graduate?",
    modelAnswer:
      "Build one concrete artifact: an EIA inventory tracker, a written market view with a clear thesis, or a forward-curve analysis in Python. Pick one entry track — analytics, scheduling, or risk — and show you understand physical market mechanics, not just finance theory.",
    tags: ["Career", "Graduate", "Positioning"],
    interviewTip: "One specific market artifact beats ten generic finance internships on a CV.",
  },
];

export const INTERVIEW_QUESTIONS: InterviewQuestion[] = [
  ...DESK_QA.map((q) => ({
    id: q.id,
    category: q.categoryLabel,
    question: q.question,
    modelAnswer: q.answer,
    tags: q.tags,
    interviewTip: q.deskSignal,
  })),
  ...EXTRA_QUESTIONS,
];

export const INTERVIEW_CATEGORIES = [
  "All",
  ...Array.from(new Set(INTERVIEW_QUESTIONS.map((q) => q.category))),
];

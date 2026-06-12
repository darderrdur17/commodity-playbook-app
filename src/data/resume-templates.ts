export interface ResumeTemplate {
  id: string;
  persona: string;
  label: string;
  roleBand: string;
  positioningChallenge: string;
  templateFile: string;
  keyMove?: string;
}

export const RESUME_TEMPLATES: ResumeTemplate[] = [
  {
    id: "switcher",
    persona: "CAREER_SWITCHER",
    label: "The Switcher",
    roleBand: "Banking · Management Consulting · Engineering · O&G Technical",
    positioningChallenge:
      "You have relevant skills but they are buried under the wrong language. Your financial modelling reads as banking, your project management reads as consulting. The template reframes everything using commodity trading vocabulary.",
    templateFile: "switcher_resume_template.docx",
    keyMove: "Translate every bullet into physical-market language — cargoes, spreads, hedges, not generic finance.",
  },
  {
    id: "insider",
    persona: "INSIDER",
    label: "The Insider",
    roleBand: "Scheduling · Operations · ETRM · Logistics · Trade Support",
    positioningChallenge:
      "Your operational experience is genuinely valuable — but it reads as execution, not commercial. The template reframes operational knowledge as the execution-to-commercial bridge that desk candidates can't offer.",
    templateFile: "insider_resume_template.docx",
    keyMove: "Quantify the commercial impact of operational decisions — demurrage saved, cargoes diverted, exposure reduced.",
  },
  {
    id: "analyst",
    persona: "ANALYST_TRADER",
    label: "Analyst-to-Trader",
    roleBand: "Analytics · Quantitative Research · Data Science · Risk Modelling",
    positioningChallenge:
      "Strongest technical profile, weakest commercial narrative. Models need P&L implications. The template shows you as quantitative commercial — someone who builds models to take positions, not just to report on them.",
    templateFile: "analyst_trader_resume_template.docx",
    keyMove: "Attach a market view to every model — what position would you take and why?",
  },
  {
    id: "vendor",
    persona: "VENDOR",
    label: "The Vendor",
    roleBand: "Platts · Argus · ICIS · Kpler · Vortexa · Wood Mackenzie",
    positioningChallenge:
      "Vendor candidates almost always write a sales resume for a market knowledge role. Remove revenue targets. Replace with: what market you covered, what analysis you produced, and what decision it enabled inside a trading firm.",
    templateFile: "vendor_resume_template.docx",
    keyMove: "Lead with market coverage and client decisions enabled — not quota attainment.",
  },
  {
    id: "fresh_grad",
    persona: "FRESH_GRAD",
    label: "Fresh Graduate",
    roleBand: "Student · Early career · Analytics / Scheduling / Risk entry tracks",
    positioningChallenge:
      "No trading experience is expected — but commercial curiosity is non-negotiable. The template shows you understand the market and have already started engaging with it before your first role.",
    templateFile: "fresh_grad_resume_template.docx",
    keyMove:
      "Pick one entry track (analytics, scheduling/ops, or risk) and build one piece of market evidence — an EIA tracker, a market view, or a Python analysis script.",
  },
];

export const PERSONA_QUIZ_QUESTIONS = [
  {
    id: "background",
    question: "What best describes your current background?",
    options: [
      { value: "switcher", label: "Banking, consulting, or engineering moving into commodities" },
      { value: "insider", label: "Operations, scheduling, logistics, or trade support" },
      { value: "analyst", label: "Analytics, quant, data science, or risk modelling" },
      { value: "vendor", label: "Price reporting, data vendor, or market intelligence" },
      { value: "fresh_grad", label: "Student or early-career graduate" },
    ],
  },
];

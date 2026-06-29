/** Persona glossary priorities — mirrors src/data/glossary-persona.ts for mobile */
export const PERSONA_GLOSSARY_GUIDES: Record<
  string,
  { headline: string; tip: string; priorityCategories: string[] }
> = {
  FRESH_GRAD: {
    headline: "Build desk fluency from zero",
    tip: "Start with physical market basics and pricing language — hiring managers listen for these before they look at your degree.",
    priorityCategories: [
      "Physical markets",
      "Pricing & Derivatives",
      "Market Intelligence & Analytics",
      "Oil & Products",
    ],
  },
  CAREER_SWITCHER: {
    headline: "Translate your skills into trading vocabulary",
    tip: "Focus on physical vs paper, basis, and product-specific terms — your finance background is an asset once you speak the desk's language.",
    priorityCategories: [
      "Physical markets",
      "Pricing & Derivatives",
      "Risk & P&L",
      "Oil & Products",
      "Gas & LNG",
    ],
  },
  INSIDER: {
    headline: "Bridge operations knowledge to commercial language",
    tip: "You already know how cargoes land — now learn how traders talk about them when negotiating, hedging, and managing P&L.",
    priorityCategories: [
      "Operations & Scheduling",
      "Physical markets",
      "Shipping",
      "Risk & P&L",
      "Pricing & Derivatives",
    ],
  },
  ANALYST_TRADER: {
    headline: "Connect models to commercial decisions",
    tip: "Prioritise pricing, risk, and market intelligence terms — the gap is explaining what your analysis enabled on the desk.",
    priorityCategories: [
      "Pricing & Derivatives",
      "Risk & P&L",
      "Market Intelligence & Analytics",
      "Oil & Products",
      "Gas & LNG",
    ],
  },
  VENDOR: {
    headline: "Speak the desk's language when selling intelligence",
    tip: "Traders evaluate vendors on whether you understand their workflow — start with how they consume data, price risk, and structure physical deals.",
    priorityCategories: [
      "Market Intelligence & Analytics",
      "Pricing & Derivatives",
      "Physical markets",
      "Oil & Products",
      "Risk & P&L",
    ],
  },
};

export const PERSONA_LABELS: Record<string, string> = {
  FRESH_GRAD: "Fresh Graduate",
  CAREER_SWITCHER: "Career Switcher",
  INSIDER: "Industry Insider",
  ANALYST_TRADER: "Analyst / Trader",
  VENDOR: "Vendor / Supplier",
};

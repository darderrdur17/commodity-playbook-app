export interface StarterInfographic {
  id: string;
  num: string;
  title: string;
  description: string;
  thumbClass: string;
  fileKey: string;
}

export const STARTER_INFOGRAPHICS: StarterInfographic[] = [
  {
    id: "ecosystem-map",
    num: "01",
    title: "Commodity Trading Ecosystem Map",
    description: "Every player connected — from upstream producers to end consumers.",
    thumbClass: "from-accent to-primary-300",
    fileKey: "starter-pack/ecosystem-map.pdf",
  },
  {
    id: "lng-flow",
    num: "02",
    title: "LNG Cargo Flow Mechanics",
    description: "From liquefaction plant to regasification terminal — the full journey.",
    thumbClass: "from-sky-100 to-sky-300",
    fileKey: "starter-pack/lng-flow.pdf",
  },
  {
    id: "crack-spread",
    num: "03",
    title: "Crack Spread Guide",
    description: "The refinery margin signal — 3-2-1 formula, seasonal patterns, what it tells you.",
    thumbClass: "from-violet-100 to-violet-300",
    fileKey: "starter-pack/crack-spread.pdf",
  },
  {
    id: "benchmarks",
    num: "04",
    title: "Price Benchmarks 101",
    description: "Brent, WTI, Dubai, JKM, TTF — why each exists and who uses them.",
    thumbClass: "from-amber-100 to-amber-300",
    fileKey: "starter-pack/benchmarks.pdf",
  },
  {
    id: "trade-finance",
    num: "05",
    title: "Trade Finance Flow",
    description: "Letters of credit, tolling, pre-finance — how commodity deals get funded.",
    thumbClass: "from-green-100 to-green-300",
    fileKey: "starter-pack/trade-finance.pdf",
  },
];

export interface StarterMarketNoteTopic {
  tag: string;
  tagColor: string;
  tagBg: string;
  title: string;
}

export const STARTER_MARKET_NOTE = {
  eyebrow: "Live · Every Tuesday Edition",
  title: "The Market Note That Builds Your Desk Credibility.",
  description:
    "Not just a market digest — a career intelligence briefing. Each note breaks down how the desk would explain it, so you walk into interviews and conversations already sounding like you are rooted to the same space.",
  subscribed: "You're subscribed. First note lands next Tuesday.",
  sampleTopics: [
    {
      tag: "MARKET",
      tagColor: "#2563eb",
      tagBg: "#dbeafe",
      title: "Why the EIA draw didn't move flat price — and how to explain that in an interview",
    },
    {
      tag: "CAREER",
      tagColor: "#b45309",
      tagBg: "#fef3c7",
      title: "What 'commercial awareness' actually means to a hiring desk",
    },
    {
      tag: "DESK",
      tagColor: "#15803d",
      tagBg: "#dcfce7",
      title: "How a physical trader sizes a position — the logic behind the number",
    },
    {
      tag: "INTERVIEW",
      tagColor: "#7c3aed",
      tagBg: "#ede9fe",
      title: "Five questions every commodity trading interview asks — and what they're testing",
    },
    {
      tag: "POSITION",
      tagColor: "#db2777",
      tagBg: "#fce7f3",
      title: "How to position a non-commodity background as commercial experience",
    },
  ] satisfies StarterMarketNoteTopic[],
};

export const STARTER_CHAPTER_PREVIEW = {
  label: "Chapter A · Free Preview",
  title: "Industry Foundations",
  freeSections: 3,
  totalSections: 8,
  sections: [
    { id: "a1", number: "A.1", title: "What is Physical Commodity Trading?", free: true },
    { id: "a2", number: "A.2", title: "The Energy Markets Landscape", free: true },
    { id: "a3", number: "A.3", title: "How a Trade Makes Money", free: true },
    { id: "a4", number: "A.4", title: "Refinery Economics & Crack Spreads", free: false },
    { id: "a5", number: "A.5", title: "Shipping, Freight & Cargo Economics", free: false },
    { id: "a6", number: "A.6", title: "Storage, Terminals & Inventory", free: false },
    { id: "a7", number: "A.7", title: "The Role of Price Reporting Agencies", free: false },
    { id: "a8", number: "A.8", title: "Risk Management on the Desk", free: false },
  ],
};

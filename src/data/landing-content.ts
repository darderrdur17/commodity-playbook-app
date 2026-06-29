export interface LandingFeature {
  icon: string;
  title: string;
  desc: string;
  tier?: "Pro" | "Elite";
}

export interface GroundLevelFeature {
  title: string;
  desc: string;
}

export interface ChapterCoverage {
  letter: string;
  title: string;
  desc: string;
}

export interface SalesWhoCard {
  role: string;
  title: string;
  desc: string;
  outcome: string;
}

export interface SalesPricingTier {
  name: string;
  price: string;
  billing: string;
  description: string;
  features: string[];
  cta: string;
  href: string;
  featured?: boolean;
}

export interface LandingTier {
  name: string;
  price: string;
  billing: string;
  badge: "starter" | "pro" | "elite";
  highlight: boolean;
  tooltip: string;
  description: string;
  features: string[];
  cta: string;
  href: string;
  opensModal?: boolean;
}

export interface LandingContent {
  career: {
    eyebrow: string;
    headline: string;
    headlineAccent: string;
    description: string;
    ctaPrimary: string;
    ctaSecondary: string;
    heroStats: { value: number; suffix: string; label: string }[];
  };
  sales: {
    eyebrow: string;
    headline: string;
    headlineAccent: string;
    description: string;
    ctaPrimary: string;
    ctaSecondary: string;
    stats: { value: number; suffix: string; label: string; animate?: boolean }[];
    whoCards: SalesWhoCard[];
    roi: {
      eyebrow: string;
      title: string;
      titleAccent: string;
      description: string;
      stats: { value: string; label: string }[];
      quote: string;
      quoteAuthor: string;
    };
    pricing: SalesPricingTier[];
  };
  stats: { value: number; suffix: string; label: string }[];
  groundLevelView: {
    eyebrow: string;
    title: string;
    description: string;
    features: GroundLevelFeature[];
  };
  chapterCoverage: {
    eyebrow: string;
    title: string;
    description: string;
    chapters: ChapterCoverage[];
  };
  caseStudySample: {
    eyebrow: string;
    title: string;
    description: string;
    tag: string;
    sampleTitle: string;
    sampleMeta: string;
    steps: { label: string; text: string }[];
    unlockText: string;
  };
  whatsInside: {
    titleLine1: string;
    titleLine2: string;
    description: string;
    features: LandingFeature[];
  };
  pricing: {
    title: string;
    subtitle: string;
    tiers: LandingTier[];
  };
  membersStrip: {
    label: string;
    companies: string[];
  };
  footerTagline: string;
}

export const DEFAULT_LANDING_CONTENT: LandingContent = {
  career: {
    eyebrow: "The Insider's Guide for Professional Career Builders",
    headline: "Understand Commodity Trading the Way",
    headlineAccent: "the Desk Actually Works.",
    description:
      "The playbook that many practitioners used to break in, move up, and build careers that last. Whether you're entering the industry, switching roles, or moving from operations to the front office; from fresh grad to senior coverage - every step mapped.",
    ctaPrimary: "Start Free — Starter Pack",
    ctaSecondary: "Preview Content",
    heroStats: [
      { value: 20, suffix: "+", label: "Years desk experience" },
      { value: 5, suffix: "", label: "Full playbook chapters" },
      { value: 120, suffix: "", label: "Downloadable assets" },
      { value: 10, suffix: "+", label: "Deep case studies" },
    ],
  },
  sales: {
    eyebrow: "For Sales Professionals Selling Into Commodity Trading",
    headline: "Sell Into Commodity Trading with",
    headlineAccent: "Desk-Level Credibility.",
    description:
      "Your buyers are traders, risk managers, schedulers, and analysts who can tell within two minutes whether you understand their world. The Playbook gives you the inside knowledge to have conversations at their level — not presentations at yours.",
    ctaPrimary: "Start Free — Starter Pack",
    ctaSecondary: "What You'll Learn",
    stats: [
      { value: 2, suffix: " min", label: "How fast traders judge your credibility", animate: false },
      { value: 5, suffix: "", label: "Basic functions covered" },
      { value: 40, suffix: "+", label: "Practitioner Q&As to learn from" },
      { value: 20, suffix: "+", label: "Years desk experience behind this content" },
    ],
    whoCards: [
      { role: "ETRM & Trading Software", title: "Enterprise Software Sales", desc: "You sell Endur, RightAngle, Allegro, or a competing ETRM. The real decision is made by the trading desk.", outcome: "After the Playbook, I stopped presenting to operations and started having commercial conversations with the desk. First call conversion improved immediately." },
      { role: "Market Data & Intelligence", title: "Data Platform Sales", desc: "You sell Kpler, Vortexa, Platts, Argus, or a competing data service. Your buyers already know the market — they're testing whether you do too.", outcome: "Understanding how desks actually use AIS data changed how I demo. Win rate on enterprise accounts up 35%." },
      { role: "Risk & Compliance Technology", title: "Risk Technology Sales", desc: "You sell VaR systems, surveillance tools, or credit risk platforms. The buying committee will probe your market understanding in detail.", outcome: "The Playbook's risk chapter gave me the vocabulary to have real conversations with the CRO. Accelerated our deal cycle by 6 weeks." },
      { role: "Shipping & Freight Technology", title: "Maritime & Logistics Sales", desc: "You sell vessel tracking, freight analytics, or chartering technology. Your buyers think in laytime, demurrage, and NOR.", outcome: "I finally understood what demurrage costs a trading desk per day. That one number reframed every conversation about our product's ROI." },
      { role: "Trade Finance & Banking", title: "Commodity Finance Sales", desc: "You sell letters of credit, commodity finance structures, or payment solutions to commodity trading firms.", outcome: "Understanding the B/L and LOI process meant I could map our solution to an actual operational pain point." },
      { role: "Consulting & Advisory", title: "Strategy & Management Consulting", desc: "You sell advisory services on strategy, operations, digital transformation, or market entry.", outcome: "Our team used the Playbook as pre-engagement preparation for an LNG client. That distinction won the work." },
    ],
    roi: {
      eyebrow: "The Commercial Case",
      title: "One Deal Pays for",
      titleAccent: "a Year of Pro.",
      description: "Pro is SGD 299/month. If understanding the commodity trading desk helps you close one additional deal per year, the return is not close.",
      stats: [
        { value: "$250K–$2M+", label: "Typical ETRM / data platform ACV" },
        { value: "SGD 3,588", label: "Full year of Pro access" },
        { value: "2 min", label: "How fast traders assess your credibility" },
        { value: "6 wks", label: "Reported reduction in deal cycle" },
      ],
      quote: "I used to lose deals in the first five minutes. After the Playbook, I could hold a commercial conversation with a head of trading for forty-five.",
      quoteAuthor: "James K., Enterprise Sales, London",
    },
    pricing: [
      { name: "Starter", price: "SGD 149", billing: "one-time", description: "The foundation for anyone selling into commodity trading firms.", features: ["5 infographics + weekly digest", "Chapter A preview (3 sections)", "Desk Glossary (196 terms)", "Sales-specific onboarding guide"], cta: "Get Starter — SGD 149", href: "/signup" },
      { name: "Pro", price: "SGD 299", billing: "per month", description: "For sales professionals who need ongoing desk intelligence.", features: ["Everything in Starter", "Full Playbook — all 5 chapters", "10+ case studies with commercial impact", "Desk Channel — 40 Q&As", "Anonymous Mentor Connect"], cta: "Get Pro — SGD 299/mo", href: "/signup?plan=pro", featured: true },
    ],
  },
  stats: [
    { value: 196, suffix: "", label: "Glossary (trading-related) terms" },
    { value: 10, suffix: "+", label: "Deep case studies" },
  ],
  groundLevelView: {
    eyebrow: "What's Inside",
    title: "The Ground-Level View.",
    description: "Most people learn commodity markets from textbooks and headlines. This Playbook starts where the desk starts — cargoes, freight, arbitrage windows, and the commercial decisions that determine whether a trade makes money.",
    features: [
      { title: "Industry Foundations", desc: "Master the mechanics of oil, LNG, and gas. Physical vs paper, refining economics, pricing benchmarks, and exactly what drives margins on the desk." },
      { title: "Resume & Positioning", desc: "Five archetype-specific resume templates with a quiz to find yours. The exact language that commodity trading hiring managers look for." },
      { title: "Market Thinking", desc: "How to read the EIA report, the COT data, the forward curve, and AIS vessel positioning — and what commercial decision each signal supports." },
      { title: "Shipping & Freight", desc: "Voyage charters, time charters, demurrage, laytime, and AIS vessel tracking — the logistics layer every desk depends on." },
      { title: "Interview Preparation", desc: "50 commodity trading interview questions with model answers by archetype. The Market Knowledge Test scores your gaps." },
      { title: "Practitioner Access", desc: "The Desk Channel Q&A library — 40 real questions answered by vetted practitioners. Plus Anonymous Mentor Connect." },
    ],
  },
  chapterCoverage: {
    eyebrow: "The Full Playbook",
    title: "What We Cover. Everything You Need.",
    description: "Each chapter has 8 sections, a worked example, a framework, and downloadable assets. 40 sections and 120 assets in total.",
    chapters: [
      { letter: "A", title: "Industry Foundations", desc: "Physical vs paper, the six revenue levers, pricing benchmarks, and how an oil trade actually makes money." },
      { letter: "B", title: "Physical & Paper Markets", desc: "MOC price assessment, spreads, the carry trade, OPEC signals, DES vs FOB, and managed money positioning." },
      { letter: "C", title: "Shipping, Freight & Cargo", desc: "Vessel types, charter party mechanics, demurrage, AIS tracking, laytime, and the full cargo lifecycle." },
      { letter: "D", title: "Market Intelligence", desc: "Kpler, Platts, Argus, EIA, COT, Baltic Exchange — what each tells you and how to read it commercially." },
      { letter: "E", title: "Commercial Risk & Decisions", desc: "VaR, basis risk, stop-loss discipline, sanctions, credit risk, and how a desk manages positions in real time." },
    ],
  },
  caseStudySample: {
    eyebrow: "Global and Asia Case Studies",
    title: "Real Scenarios. Real Commercial Logic.",
    description: "Each case study reconstructs a real market event the way a desk lived it — starting from the signal that appeared first, through the read, the supporting evidence, and the commercial decision it forced.",
    tag: "Free Sample · Case C",
    sampleTitle: "COVID Contango — Singapore's Anchorage Fills",
    sampleMeta: "April–June 2020 · Crude oil · Trading & shipping",
    steps: [
      { label: "1 · The Signal", text: "On 20 April 2020, WTI front-month settled at −$37.63/bbl. Brent's M1/M6 spread gapped out to roughly $18/bbl: a textbook contango." },
      { label: "2 · The Read", text: "A contango that steep pays you to wait. If the gap between buying now and selling forward beats storage costs, storage itself becomes the trade." },
      { label: "3 · The Evidence", text: "AIS vessel-tracking showed VLCCs anchoring off Singapore before any official inventory report confirmed the build." },
      { label: "4 · The Decision", text: "Desks that locked storage early captured the carry. Timing, not direction, made the money." },
    ],
    unlockText: "That's one of 10+ worked case studies. Unlocks with Elite.",
  },
  whatsInside: {
    titleLine1: "Every resource you need,",
    titleLine2: "nothing you don't.",
    description:
      "Built from 20+ years inside trading, analytics, and market intelligence by practitioners, validated by desk veterans. Structured for how commodity professionals actually learn and work.",
    features: [
      {
        icon: "BookOpen",
        title: "Full Playbook",
        desc: "5 chapters covering every facet of commodity trading — markets, operations, finance, analytics, and career strategy.",
        tier: "Pro",
      },
      {
        icon: "Target",
        title: "Persona Quiz & Resumes",
        desc: "Discover your archetype and download a tailored resume template built for commodity desk vocabulary.",
        tier: "Pro",
      },
      {
        icon: "Map",
        title: "Career Roadmap",
        desc: "10 role blueprints with comp benchmarks, skills matrices, and 90-day action plans for every stage.",
        tier: "Pro",
      },
      {
        icon: "FileText",
        title: "Case Studies",
        desc: "10 real-world trading scenarios with full breakdowns — price dynamics, P&L, risk decisions, and lessons learned.",
        tier: "Elite",
      },
      {
        icon: "MessageSquare",
        title: "Desk Channel",
        desc: "40 practitioner Q&As across Physical Trading, Finance, Analytics, Operations, and Sales — the unfiltered desk view.",
        tier: "Elite",
      },
      {
        icon: "Users",
        title: "Mentor Connect",
        desc: "One question. One mentor. One honest answer. Anonymous access to practitioners across 5 segments.",
        tier: "Elite",
      },
    ],
  },
  pricing: {
    title: "Simple, transparent pricing to access your level",
    subtitle: "Start free. Upgrade when you're ready. No hidden fees, no subscriptions until Elite.",
    tiers: [
      {
        name: "Starter",
        price: "Free",
        billing: "forever",
        badge: "starter",
        highlight: false,
        tooltip: "The foundation for anyone entering commodity markets.",
        description: "Explore the playbook and get your first desk-ready resources.",
        features: [
          "5 desk infographics",
          "Chapter A preview (3 free sections)",
          "Desk Glossary (196 terms)",
          "Weekly Market Digest",
          "Job Board waitlist",
        ],
        cta: "Get Starter Free",
        href: "/signup",
        opensModal: true,
      },
      {
        name: "Pro",
        price: "SGD 99",
        billing: "one-time",
        badge: "pro",
        highlight: true,
        tooltip: "For professionals and learners going deeper into how commodity trading works.",
        description: "Everything you need to position yourself and land the role.",
        features: [
          "Full Playbook — all 5 chapters",
          "Persona Analysis Quiz",
          "Tailored resume templates (5+)",
          "Career Roadmap (10 role blueprints)",
          "Interview Questions + Answers (50+)",
          "Market Knowledge Test (gap analysis)",
        ],
        cta: "Get Pro",
        href: "/signup?plan=pro",
      },
      {
        name: "Elite",
        price: "SGD 299",
        billing: "per month",
        badge: "elite",
        highlight: false,
        tooltip: "For long-term serious learners with long-term downstream careers.",
        description: "Full commercial education plus live intelligence and mentor access.",
        features: [
          "Everything in Pro",
          "Deep-dive Global & Asia Case Studies (10+ ongoing)",
          "Desk Channel — Intelligent answers vetted by real practitioners (40+ Q&As)",
          "Anonymous Mentor Connect",
          "Market Job Openings Tracker (Coming soon)",
        ],
        cta: "Get Elite",
        href: "/signup?plan=elite",
      },
    ],
  },
  membersStrip: {
    label: "Members now working at",
    companies: ["Vitol", "Glencore", "S&P Global", "Kpler", "Mitsui Corp"],
  },
  footerTagline:
    "The definitive Playbook guide to understanding commodity trading — how markets work, how revenue is made, and how to build a career or close a sale inside them. From first desk to senior coverage.",
};

import type { NavigationGuide, CompBenchmarks } from "./career-roadmap-extras";

/** CMS-managed via career-roadmap module — not overwritten by build:content */
export const NAVIGATION_GUIDE: NavigationGuide = {
  eyebrow: "Moving with purpose",
  title: "Career Navigation Guide",
  description:
    "Breaking in is only the first move. The professionals who build long careers in commodity trading know when to lateral, when to hold, and how to reposition across functions and markets without resetting their credibility.",
  sections: [
    {
      title: "Lateral vs. vertical — know which move you're making",
      body: "A promotion deepens your authority in the same function. A lateral move changes your function, commodity, or market. Both are valid — but they require different preparation. Lateral moves into front office from ops or middle office only work when you can demonstrate commercial impact, not just process expertise.",
      bullets: [
        "Stay vertical when you're building P&L track record or deepening a specialist edge the desk relies on.",
        "Go lateral when you've hit a ceiling in your current function and can articulate the commercial value you bring to the next one.",
        "Never lateral without a 90-day plan — hiring managers can tell when you're running from a role rather than running toward one.",
      ],
    },
    {
      title: "Cross-function moves that actually happen",
      body: "The commodity industry has well-worn internal promotion paths — but they are earned, not assumed. Scheduling to commercial is the most established ops-to-desk route. Quant to trading happens when a model becomes indispensable to the book. Risk to desk is rarer but real when you've built market credibility alongside your limits work.",
      bullets: [
        "Operations → Commercial: quantify the P&L impact of your scheduling decisions before you ask for the move.",
        "Middle office → Front office: build a market view alongside your day job — desks promote people who already think commercially.",
        "Adjacent → Core desk: vendor, research, and trade finance professionals succeed when they arrive with a specific commodity thesis, not generic market knowledge.",
      ],
    },
    {
      title: "Cross-market moves — Singapore, London, Hong Kong",
      body: "Each hub has a different hiring culture. Singapore rewards breadth and relationship density. London rewards specialisation and speed. Hong Kong sits between both — strong on physical Asia flows, smaller books, higher volatility in hiring cycles. Moving markets is easier at the analyst and mid level than at senior trader.",
      bullets: [
        "Time your move to a hiring cycle — Q1 and Q3 are typically strongest for junior and mid-level intake across APAC and Europe.",
        "Build market-specific credibility before you apply: a Singapore candidate moving to London needs a clear commodity specialism, not just 'APAC experience'.",
        "Comp structures differ materially — London bonus culture, Singapore base-heavy NOC roles, and HK's mix of both. Normalise offers before you compare.",
      ],
    },
    {
      title: "Offer navigation and timing",
      body: "The offer conversation is where most candidates give away value — not because they ask for too much, but because they don't understand how discretionary bonus actually works at trading firms versus refiners and NOCs. Know your walk-away number. Know whether the role is base-heavy or bonus-linked. Know who determines the bonus.",
      bullets: [
        "Ask how bonus is determined — discretionary pool, individual P&L, or firm-wide — before accepting any headline number.",
        "A counter-offer from your current employer is a signal to diagnose, not an automatic accept. What changed that wasn't available six months ago?",
        "If you're switching functions, optimise for learning curve and sponsor access over a 10% base premium — the upgrade path matters more than year-one comp.",
      ],
    },
  ],
};

export const COMP_BENCHMARKS: CompBenchmarks = {
  eyebrow: "Singapore market · 2025",
  title: "Comp Benchmarks",
  description:
    "What the desk actually pays — not what HR advertises. Ranges based on market intelligence across Singapore-based roles.",
  cards: [
    { role: "Junior Analyst / Scheduler", range: "SGD 60–90k", note: "Base · 0–3 years" },
    { role: "Mid Analyst / Risk", range: "SGD 90–140k", note: "Base · 3–6 years" },
    { role: "Senior Analyst / Lead Scheduler", range: "SGD 140–200k", note: "Base · 6–10 years" },
    { role: "Junior Trader / Commercial", range: "SGD 120–180k", note: "Base + discretionary bonus" },
    { role: "Mid-level Trader", range: "SGD 200–400k+", note: "Total comp · 5–10 years" },
    { role: "Senior Trader / Book Runner", range: "SGD 600k–2M+", note: "P&L-linked · 10+ years" },
  ],
  footnote:
    "Bonus at major traders (Vitol, Trafigura, Glencore) can be 50–200%+ of base. NOC and refiner comp skews base-heavy with lower bonus variance.",
};

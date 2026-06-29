import type { PersonaId } from "@/lib/persona-quiz";

export interface PersonaArchetype {
  id: PersonaId;
  emoji: string;
  color: string;
  bgClass: string;
  name: string;
  label: string;
  desc: string;
  industryPosition: string;
  keyMove: string;
  templateFile: string;
}

export const PERSONA_ARCHETYPES: Record<PersonaId, PersonaArchetype> = {
  switcher: {
    id: "switcher",
    emoji: "🔄",
    color: "#B45309",
    bgClass: "bg-amber-50",
    name: "The Switcher",
    label: "Cross-Industry Commercial Pivot",
    desc: "You are coming from finance, consulting, engineering, or a technical O&G role. Your skills are genuinely relevant — but they are buried under the wrong language. Hiring managers need commodity trading vocabulary, commercial awareness, and market knowledge before they look at your job titles.",
    industryPosition:
      "You sit outside the industry right now, targeting entry through the Switcher path. This is the most common profile for Singapore-based finance and consulting professionals targeting LNG and crude trading firms. The Switcher path works best for front-office analyst, commercial analyst, or origination roles.",
    keyMove:
      "Lead with a Market Knowledge section above your work experience. Use the commercial awareness bullet formula: [what you tracked or modelled] + [the market signal it revealed] + [the action or decision it enabled].",
    templateFile: "switcher_resume_template.docx",
  },
  insider: {
    id: "insider",
    emoji: "🏠",
    color: "#0F766E",
    bgClass: "bg-teal-50",
    name: "The Insider",
    label: "Execution-to-Commercial Bridge",
    desc: "You already work inside a commodity trading firm — in scheduling, operations, ETRM, or a support function. You understand the physical market better than most external candidates. The challenge is that your resume reads as execution, not commercial.",
    industryPosition:
      "You are inside the industry — and that is your single biggest advantage. The desk trusts operational people who understand how deals actually land. Your positioning challenge is demonstrating you have been close enough to commercial decisions to understand them — not just implement them.",
    keyMove:
      "Add a Commercial & Desk Interaction section. Document every instance where your operational work directly touched a trading desk decision — cargo diversion opportunities, scheduling windows that reduced freight cost, demurrage saved.",
    templateFile: "insider_resume_template.docx",
  },
  analyst: {
    id: "analyst",
    emoji: "📊",
    color: "#5B21B6",
    bgClass: "bg-violet-50",
    name: "The Analyst-to-Trader",
    label: "Quantitative Commercial Profile",
    desc: "You have the strongest technical profile of any archetype — but the weakest commercial narrative. Your models are good; your ability to explain what commercial decision they enabled is not yet developed.",
    industryPosition:
      "Analytics professionals occupy a high-value role — but only when they connect outputs to commercial decisions. Your path to a desk role runs through demonstrating market views, not just modelling skill.",
    keyMove:
      "Add a Market Views section with 2–3 dated, specific calls you made and what happened. A call that was wrong but well-reasoned is still worth including.",
    templateFile: "analyst_trader_resume_template.docx",
  },
  vendor: {
    id: "vendor",
    emoji: "📡",
    color: "#0830a0",
    bgClass: "bg-primary-soft",
    name: "The Market Intelligence Vendor",
    label: "Intelligence-to-Desk Transition",
    desc: "You work at Platts, Argus, ICIS, Kpler, Vortexa, Wood Mac, or a similar firm. You have spent years advising trading desks — which means you understand the market AND how traders consume intelligence.",
    industryPosition:
      "The Vendor archetype has the most unusual profile in commodity trading. You have been inside the room with more desks than most analysts — but your job title says sales or client solutions.",
    keyMove:
      "Remove all revenue metrics. Replace with: what market you covered, what analysis you produced, and what commercial decision it enabled inside a trading firm.",
    templateFile: "vendor_resume_template.docx",
  },
  fresh_grad: {
    id: "fresh_grad",
    emoji: "🎓",
    color: "#9A3412",
    bgClass: "bg-orange-50",
    name: "The Fresh Graduate",
    label: "Entry-Level Commercial Positioning",
    desc: "You are a student, fresh graduate, or early-career professional. No trading experience is expected — but commercial curiosity is non-negotiable. The template maps you to the right entry track because applying to all three simultaneously signals indecision.",
    industryPosition:
      "Fresh graduates compete for junior analyst and scheduler roles — typically in analytics, trade support, or scheduling rather than the front office. Your edge comes from demonstrated market engagement: an EIA tracker, a market view, or a Python analysis script.",
    keyMove:
      "Decide on one entry track — analytics, scheduling/ops, or risk — before you apply. Then build one piece of market evidence that differentiates you from every other graduate with a generic finance CV.",
    templateFile: "fresh_grad_resume_template.docx",
  },
};

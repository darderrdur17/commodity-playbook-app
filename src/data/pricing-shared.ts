import { DEFAULT_LANDING_CONTENT, type SalesPricingTier } from "./landing-content";

/** Career track subscription copy — landing, in-app gates, and upgrade prompts */
export const PRO_SUBSCRIPTION = {
  price: "SGD 59",
  period: "per month",
  note: "cancel anytime",
  label: "SGD 59/month",
  fullNote: "SGD 59/month — cancel anytime",
  cta: "Get Pro",
  unlockCta: "Unlock Pro",
} as const;

export const ELITE_SUBSCRIPTION = {
  price: "SGD 99",
  period: "per month",
  note: "cancel anytime",
  label: "SGD 99/month",
  fullNote: "SGD 99/month — cancel anytime",
  cta: "Get Elite",
  unlockCta: "Unlock Elite",
} as const;

/** Sales track subscription copy — landing sales panel */
export const SALES_PRO_SUBSCRIPTION = {
  price: "SGD 99",
  period: "per month",
  label: "SGD 99/month",
  fullNote: "SGD 99/month — cancel anytime",
  cta: "Get Pro",
} as const;

export const SALES_ELITE_SUBSCRIPTION = {
  price: "SGD 199",
  period: "per month",
  label: "SGD 199/month",
  fullNote: "SGD 199/month — cancel anytime",
  cta: "Get Elite",
} as const;

export const SALES_PRICING_TIERS = DEFAULT_LANDING_CONTENT.sales.pricing;

function formatSalesTierCategory(tier: SalesPricingTier): string {
  const period = tier.billing === "per month" ? "month" : tier.billing;
  return `${tier.name} — ${tier.price}/${period}`;
}

/** Feature comparison rows for sales Pro / Elite — driven by landing-content tiers */
export function buildSalesFeatureTable(pricing: SalesPricingTier[]) {
  const pro = pricing.find((t) => t.name.toLowerCase() === "pro");
  const elite = pricing.find((t) => t.name.toLowerCase() === "elite");
  if (!pro || !elite) return [];

  return [
    {
      category: formatSalesTierCategory(pro),
      color: "#0F766E",
      items: pro.features.map((name) => ({ name, pro: true, elite: true })),
    },
    {
      category: formatSalesTierCategory(elite),
      color: "#065F46",
      items: elite.features
        .filter((f) => !/^everything in pro$/i.test(f))
        .map((name) => ({ name, pro: false, elite: true })),
    },
  ];
}

/** Shared pricing copy — landing page and /pricing stay in sync */
export const PRICING_HERO = {
  eyebrow: "Simple Pricing",
  title: "Simple pricing -",
  subtitle:
    "No lock-in on Pro and Elite. Cancel anytime. The only commitment is to getting ahead.",
};

export const PRICING_CONTENT_FOOTNOTE = "*New contents updated on periodic basis";

export const PRICING_CTA = {
  title: "Not sure yet? Join free.",
  description: "Get the Starter pack instantly — no card required. Upgrade when the time is right.",
  button: "Join Free",
};

export const PRICING_TIERS = DEFAULT_LANDING_CONTENT.pricing.tiers;

export const PRICING_FEATURE_TABLE = [
  {
    category: "Starter — Free",
    color: "#16a34a",
    items: PRICING_TIERS[0].features.map((name) => ({
      name,
      starter: true,
      pro: true,
      elite: true,
    })),
  },
  {
    category: "Pro — SGD 59/month",
    color: "#3280ff",
    items: PRICING_TIERS[1].features.map((name) => ({
      name,
      starter: false,
      pro: true,
      elite: true,
    })),
  },
  {
    category: "Elite — SGD 99/month",
    color: "#B45309",
    items: PRICING_TIERS[2].features.map((name) => ({
      name,
      starter: false,
      pro: false,
      elite: true,
    })),
  },
];

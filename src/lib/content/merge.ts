import type { LandingContent } from "@/data/landing-content";

type PlainObject = Record<string, unknown>;

function isPlainObject(value: unknown): value is PlainObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** CMS values win; defaults fill missing keys. */
export function deepMerge<T extends PlainObject>(defaults: T, overrides: Partial<T> | PlainObject): T {
  const result = { ...defaults };

  for (const key of Object.keys(overrides)) {
    const overrideVal = overrides[key];
    const defaultVal = defaults[key];

    if (overrideVal === undefined) continue;

    if (isPlainObject(overrideVal) && isPlainObject(defaultVal)) {
      result[key as keyof T] = deepMerge(
        defaultVal as PlainObject,
        overrideVal
      ) as T[keyof T];
      continue;
    }

    result[key as keyof T] = overrideVal as T[keyof T];
  }

  return result;
}

export function mergeByKey<T>(
  defaults: T[],
  overrides: T[],
  key: keyof T
): T[] {
  const overrideMap = new Map(overrides.map((item) => [String(item[key]), item]));
  return defaults.map((item) => {
    const match = overrideMap.get(String(item[key]));
    return match ? ({ ...item, ...match } as T) : item;
  });
}

/** Same as mergeByKey but repo defaults win over CMS on conflicting fields. */
export function mergeByKeyDefaultsWin<T>(
  defaults: T[],
  overrides: T[],
  key: keyof T
): T[] {
  const overrideMap = new Map(overrides.map((item) => [String(item[key]), item]));
  return defaults.map((item) => {
    const match = overrideMap.get(String(item[key]));
    return match ? ({ ...match, ...item } as T) : item;
  });
}

/** Merge CMS landing copy over code defaults without losing new chapters/tiers from deploys. */
export function mergeLandingContent(
  defaults: LandingContent,
  cms: Partial<LandingContent>
): LandingContent {
  const merged = deepMerge(
    defaults as unknown as PlainObject,
    cms as PlainObject
  ) as unknown as LandingContent;

  // Repo-managed sections — code defaults always win for headers + structure
  merged.chapterCoverage = {
    eyebrow: defaults.chapterCoverage.eyebrow,
    title: defaults.chapterCoverage.title,
    description: defaults.chapterCoverage.description,
    chapters: mergeByKeyDefaultsWin(
      defaults.chapterCoverage.chapters,
      cms.chapterCoverage?.chapters ?? [],
      "letter"
    ),
  };

  merged.caseStudySample = {
    eyebrow: defaults.caseStudySample.eyebrow,
    title: defaults.caseStudySample.title,
    titleAccent: defaults.caseStudySample.titleAccent,
    description: defaults.caseStudySample.description,
    categoryTags: defaults.caseStudySample.categoryTags,
    disclaimer: defaults.caseStudySample.disclaimer,
    viewMoreHref: defaults.caseStudySample.viewMoreHref,
    cards: mergeByKeyDefaultsWin(
      defaults.caseStudySample.cards,
      cms.caseStudySample?.cards ?? [],
      "slug"
    ),
  };

  merged.whatsInside = {
    ...defaults.whatsInside,
    features: mergeByKeyDefaultsWin(
      defaults.whatsInside.features,
      cms.whatsInside?.features ?? [],
      "title"
    ),
  };

  if (cms.pricing?.tiers?.length) {
    merged.pricing = {
      ...defaults.pricing,
      tiers: mergeByKeyDefaultsWin(defaults.pricing.tiers, cms.pricing.tiers, "name"),
    };
  } else {
    merged.pricing = defaults.pricing;
  }

  if (cms.sales?.whoCards?.length) {
    merged.sales = {
      ...merged.sales,
      whoCards: mergeByKey(defaults.sales.whoCards, cms.sales.whoCards, "title"),
    };
  }

  if (cms.career?.heroStats?.length) {
    merged.career = {
      ...merged.career,
      ...cms.career,
      heroStats: mergeByKey(defaults.career.heroStats, cms.career.heroStats, "label"),
    };
  }

  // Repo-managed career CTAs stay in sync with deploys
  merged.career = {
    ...merged.career,
    ctaPrimary: defaults.career.ctaPrimary,
    ctaSecondary: defaults.career.ctaSecondary,
  };

  if (cms.stats?.length) {
    merged.stats = mergeByKey(defaults.stats, cms.stats, "label");
  }

  // Sales pricing, ROI, and hero stats — no admin editor for these, so repo defaults
  // always win over stale CMS seed data. Must run last (no later cms.sales spread).
  merged.sales = {
    ...merged.sales,
    stats: mergeByKeyDefaultsWin(
      defaults.sales.stats,
      cms.sales?.stats ?? [],
      "label"
    ),
    pricing: defaults.sales.pricing,
    roi: {
      ...merged.sales.roi,
      title: defaults.sales.roi.title,
      titleAccent: defaults.sales.roi.titleAccent,
      description: defaults.sales.roi.description,
      quote: defaults.sales.roi.quote,
      quoteAuthor: defaults.sales.roi.quoteAuthor,
      quoteSubtitle: defaults.sales.roi.quoteSubtitle,
      stats: mergeByKeyDefaultsWin(
        defaults.sales.roi.stats,
        cms.sales?.roi?.stats ?? [],
        "label"
      ),
    },
  };

  return merged;
}

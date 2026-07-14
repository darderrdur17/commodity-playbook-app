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

/** Merge CMS landing copy over code defaults without losing new chapters/tiers from deploys. */
export function mergeLandingContent(
  defaults: LandingContent,
  cms: Partial<LandingContent>
): LandingContent {
  const merged = deepMerge(
    defaults as unknown as PlainObject,
    cms as PlainObject
  ) as unknown as LandingContent;

  if (cms.chapterCoverage?.chapters?.length) {
    merged.chapterCoverage = {
      ...merged.chapterCoverage,
      ...cms.chapterCoverage,
      chapters: mergeByKey(
        defaults.chapterCoverage.chapters,
        cms.chapterCoverage.chapters,
        "letter"
      ),
    };
  }

  if (cms.whatsInside?.features?.length) {
    merged.whatsInside = {
      ...merged.whatsInside,
      ...cms.whatsInside,
      features: mergeByKey(
        defaults.whatsInside.features,
        cms.whatsInside.features,
        "title"
      ),
    };
  }

  if (cms.pricing?.tiers?.length) {
    merged.pricing = {
      ...merged.pricing,
      ...cms.pricing,
      tiers: mergeByKey(defaults.pricing.tiers, cms.pricing.tiers, "name"),
    };
  }

  if (cms.sales?.whoCards?.length) {
    merged.sales = {
      ...merged.sales,
      ...cms.sales,
      whoCards: mergeByKey(defaults.sales.whoCards, cms.sales.whoCards, "title"),
    };
  }

  if (cms.sales?.pricing?.length) {
    merged.sales = {
      ...merged.sales,
      ...cms.sales,
      pricing: mergeByKey(defaults.sales.pricing, cms.sales.pricing, "name"),
    };
  }

  if (cms.sales?.roi?.stats?.length) {
    merged.sales.roi = {
      ...merged.sales.roi,
      ...cms.sales.roi,
      stats: mergeByKey(defaults.sales.roi.stats, cms.sales.roi.stats, "label"),
    };
  }

  if (cms.career?.heroStats?.length) {
    merged.career = {
      ...merged.career,
      ...cms.career,
      heroStats: mergeByKey(defaults.career.heroStats, cms.career.heroStats, "label"),
    };
  }

  if (cms.sales?.stats?.length) {
    merged.sales = {
      ...merged.sales,
      ...cms.sales,
      stats: mergeByKey(defaults.sales.stats, cms.sales.stats, "label"),
    };
  }

  if (cms.caseStudySample?.cards?.length) {
    merged.caseStudySample = {
      ...merged.caseStudySample,
      ...cms.caseStudySample,
      cards: mergeByKey(defaults.caseStudySample.cards, cms.caseStudySample.cards, "slug"),
    };
  }

  if (cms.stats?.length) {
    merged.stats = mergeByKey(defaults.stats, cms.stats, "label");
  }

  return merged;
}

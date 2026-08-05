/** Fixed app header height — keep logo + layout offsets in sync */
export const NAV_HEIGHT_PX = 88;

export const NAV_HEIGHT = `${NAV_HEIGHT_PX}px`;

export const NAV_OFFSET = `calc(${NAV_HEIGHT_PX}px + env(safe-area-inset-top, 0px))`;

export const MAIN_MIN_HEIGHT_BELOW_NAV = `calc(100svh - ${NAV_HEIGHT_PX}px - env(safe-area-inset-top, 0px))`;

/** Bottom safe-area — applied on footer, not main, so page content sits flush above footer */
export const FOOTER_BOTTOM_SAFE_PADDING =
  "max(1rem, env(safe-area-inset-bottom, 0px))";

/** Landing track selector + hero spacing (shared across career/sales) */
export const TRACK_BAR_TOP = NAV_OFFSET;

export const TRACK_BAR_SHELL =
  "sticky z-40 bg-white border-b border-border shadow-sm";

/** Same horizontal grid as .page-container — do not add extra tab px or content shifts right */
export const TRACK_BAR_INNER =
  "page-container flex items-center gap-3 sm:gap-4 min-h-[3.25rem] sm:min-h-[3.5rem]";

export const TRACK_TAB_BASE =
  "flex items-center py-3 sm:py-3.5 text-xs sm:text-sm font-semibold whitespace-nowrap border-b-2 -mb-px transition-all shrink-0";

/**
 * Shared content grid — matches Nav inner shell and .page-container in globals.css.
 * max-w-[1200px] mx-auto px-4 sm:px-10
 */
export const PAGE_GRID =
  "w-full max-w-[1200px] mx-auto px-4 sm:px-10";

/** Standard blue-section hero padding (starter pack pattern) */
export const PAGE_HERO_TOP = "pt-12 sm:pt-16 lg:pt-20";
export const PAGE_HERO_BOTTOM = "pb-16 sm:pb-24";

/** Landing career/sales heroes — same rhythm as PAGE_HERO (below track strip in document flow) */
export const LANDING_HERO_TOP = PAGE_HERO_TOP;
export const LANDING_HERO_BOTTOM = PAGE_HERO_BOTTOM;

/** Mid-page content sections (light or dark) */
export const PAGE_SECTION_PY = "py-16 sm:py-24";

/** Compact CTA bands before footer */
export const PAGE_CTA_PY = "py-14 sm:py-16";

/** Primary nav wordmark — header_logo1.png (explicit height; avoid h-full in grid nav) */
export const PROMINENT_WORDMARK_WRAPPER =
  "inline-flex items-center h-[76px] sm:h-[82px] md:h-[86px] max-h-full max-w-[min(100%,340px)] sm:max-w-[420px] md:max-w-[480px] lg:max-w-[540px] shrink-0 overflow-hidden";

/** Standalone wordmark (auth panels, etc.) — matches nav visual weight */
export const PROMINENT_WORDMARK_STANDALONE =
  "inline-flex items-center h-[76px] sm:h-[82px] md:h-[86px] max-w-[min(100%,340px)] sm:max-w-[420px] md:max-w-[480px] lg:max-w-[540px] shrink-0 overflow-hidden";

export const PROMINENT_WORDMARK_IMAGE =
  "h-full w-auto max-w-full object-contain object-left";

export const HERO_EYEBROW_BASE =
  "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium tracking-wide mb-6 sm:mb-7";

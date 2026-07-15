/** Fixed app header height — keep logo + layout offsets in sync */
export const NAV_HEIGHT_PX = 88;

export const NAV_HEIGHT = `${NAV_HEIGHT_PX}px`;

export const NAV_OFFSET = `calc(${NAV_HEIGHT_PX}px + env(safe-area-inset-top, 0px))`;

export const MAIN_MIN_HEIGHT_BELOW_NAV = `calc(100svh - ${NAV_HEIGHT_PX}px - env(safe-area-inset-top, 0px))`;

/** Landing track selector + hero spacing (shared across career/sales) */
export const TRACK_BAR_TOP = NAV_OFFSET;

export const TRACK_BAR_SHELL =
  "sticky z-40 bg-white border-b border-border shadow-sm";

export const TRACK_BAR_INNER =
  "max-w-[1200px] mx-auto px-4 sm:px-6 flex items-stretch gap-3 sm:gap-6 overflow-x-auto scrollbar-none";

export const TRACK_TAB_BASE =
  "flex items-center gap-2 px-4 sm:px-6 py-3.5 sm:py-4 text-xs sm:text-sm font-semibold whitespace-nowrap border-b-2 transition-all";

export const LANDING_HERO_TOP = "pt-12 sm:pt-16 lg:pt-20";
export const LANDING_HERO_BOTTOM = "pb-16 sm:pb-24 lg:pb-28";
export const PAGE_HERO_TOP = "pt-12 sm:pt-16 lg:pt-20";

/** Primary nav wordmark — header_logo1.png (explicit height; avoid h-full in grid nav) */
export const PROMINENT_WORDMARK_WRAPPER =
  "inline-flex items-center h-16 sm:h-[72px] md:h-20 max-h-full max-w-[min(100%,300px)] sm:max-w-[380px] md:max-w-[440px] lg:max-w-[500px] shrink-0 overflow-hidden";

/** Standalone wordmark (auth panels, etc.) — matches nav visual weight */
export const PROMINENT_WORDMARK_STANDALONE =
  "inline-flex items-center h-16 sm:h-[72px] md:h-20 max-w-[min(100%,300px)] sm:max-w-[380px] md:max-w-[440px] lg:max-w-[500px] shrink-0 overflow-hidden";

export const PROMINENT_WORDMARK_IMAGE =
  "h-full w-auto max-w-full object-contain object-left";

export const HERO_EYEBROW_BASE =
  "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium tracking-wide mb-6 sm:mb-7";

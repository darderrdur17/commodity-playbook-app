/** Fixed app header height — keep logo + layout offsets in sync */
export const NAV_HEIGHT_PX = 96;

export const NAV_HEIGHT = `${NAV_HEIGHT_PX}px`;

export const NAV_OFFSET = `calc(${NAV_HEIGHT_PX}px + env(safe-area-inset-top, 0px))`;

export const MAIN_MIN_HEIGHT_BELOW_NAV = `calc(100svh - ${NAV_HEIGHT_PX}px - env(safe-area-inset-top, 0px))`;

/**
 * Desktop journal — page scroll inside glass shell (not nested table scroll).
 * Mobile unchanged via max-md / journal-mobile.ts.
 */

/** Scroll surface on journal page — replaces md:overflow-hidden. */
export const JOURNAL_DESKTOP_SCROLL_SURFACE = [
  "md:overflow-y-auto md:overscroll-y-contain",
].join(" ");

/** Table list grows with content; parent MobileScrollSurface scrolls. */
export const JOURNAL_DESKTOP_LIST_CONTAINER = [
  "md:flex-none md:overflow-visible",
].join(" ");

export const JOURNAL_DESKTOP_LIST_FRAME = [
  "md:flex-none md:overflow-visible",
].join(" ");

export const JOURNAL_DESKTOP_LIST_SCROLL = [
  "md:flex-none md:overflow-visible",
].join(" ");

/** Extra bottom space inside shell so last block isn't clipped when scrolling. */
export const JOURNAL_DESKTOP_SCROLL_TRAIL = "md:pb-3";

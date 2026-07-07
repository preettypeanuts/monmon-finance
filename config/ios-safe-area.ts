/**
 * iOS safe area — used via CSS env() in globals.css.
 * Pattern matches working PWA: env(safe-area-inset-*, 0px) with no hardcoded fallbacks.
 *
 * @see app/globals.css --safe-area-*
 */

/** Runtime insets — defined in globals.css */
export const MOBILE_SAFE_TOP = "var(--mobile-safe-top)";
export const MOBILE_SAFE_BOTTOM = "var(--mobile-safe-bottom)";
export const MOBILE_SAFE_LEFT = "var(--mobile-safe-left)";
export const MOBILE_SAFE_RIGHT = "var(--mobile-safe-right)";

/** Horizontal chrome inset: 12px gutter + landscape notch safe area. */
export const MOBILE_SAFE_HORIZONTAL_INSET = [
  "pl-[calc(0.75rem+var(--mobile-safe-left))]",
  "pr-[calc(0.75rem+var(--mobile-safe-right))]",
].join(" ");

/** Chat / input dock — gutter above home indicator. */
export const MOBILE_INPUT_DOCK_SAFE_BOTTOM =
  "pb-[calc(0.75rem+var(--mobile-safe-bottom))]";

/** Full-screen auth pages (login / register). */
export const MOBILE_AUTH_SAFE_INSET = [
  "min-h-dvh",
  "pt-[var(--mobile-safe-top)]",
  "pb-[var(--mobile-safe-bottom)]",
  MOBILE_SAFE_HORIZONTAL_INSET,
].join(" ");

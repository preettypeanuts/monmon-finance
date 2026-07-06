import { MOBILE_LIQUID_GLASS_SURFACE } from "@/config/mobile-nav";
import { MOBILE_TOP_BAR_ROOT } from "@/config/mobile-chrome";

/** Page root wrapper for inbox mobile chrome. */
export const INBOX_MOBILE_PAGE = "inbox-mobile-page";

export function shouldHideMobileBottomNav(pathname: string): boolean {
  return pathname === "/";
}

export const INBOX_MOBILE_TOP_BAR_ROOT = MOBILE_TOP_BAR_ROOT;

/** Linear fade under top bar — sync with `.inbox-mobile-top-blur` in globals.css */
export const INBOX_MOBILE_TOP_BLUR = [
  "pointer-events-none fixed inset-x-0 top-0 z-[29]",
  "inbox-mobile-top-blur",
  "md:hidden",
].join(" ");

/** Linear fade above chat input — sync with `.inbox-mobile-bottom-blur` in globals.css */
export const INBOX_MOBILE_BOTTOM_BLUR = [
  "pointer-events-none fixed inset-x-0 bottom-0 z-[19]",
  "inbox-mobile-bottom-blur",
  "md:hidden",
].join(" ");

export const INBOX_MOBILE_TOP_BAR_ROW = [
  "relative flex w-full items-center justify-between gap-2",
  "px-3",
  "pt-[var(--mobile-safe-top)]",
  "h-[calc(var(--mobile-safe-top)+var(--mobile-top-bar-height))]",
].join(" ");

/** iOS-style circular orb — matches Inbox shortcut on other screens. */
export const INBOX_MOBILE_TOP_BAR_ORB = [
  "pointer-events-auto flex size-11 shrink-0 items-center justify-center rounded-full",
  MOBILE_LIQUID_GLASS_SURFACE,
  "text-foreground/90 transition-transform active:scale-95",
  "[&_svg]:size-[1.35rem]",
].join(" ");

export const INBOX_MOBILE_TOP_BAR_TITLE = [
  "pointer-events-none absolute inset-x-14 text-center",
  "text-[1.0625rem] font-semibold leading-tight tracking-tight text-foreground",
].join(" ");

/** Right drawer popup — sync with `.inbox-summary-drawer-popup` in globals.css */
export const INBOX_SUMMARY_DRAWER_POPUP = "inbox-summary-drawer-popup";

/** Visual only — keep `right-0` + transform defaults for slide animation. */
export const INBOX_SUMMARY_DRAWER_SURFACE = [
  INBOX_SUMMARY_DRAWER_POPUP,
  "gap-0 overflow-hidden rounded-none rounded-[1.75rem]",
  "border-0 border-l border-black/10 bg-background/20 backdrop-blur-2xl shadow-xl",
  "dark:border-white/10",
].join(" ");

/** Message thread inset when fixed top bar is used (no scrolling large title). */
export const INBOX_MESSAGE_BOTTOM_INSET =
  "pb-24 max-md:pb-[calc(5.5rem+max(0.75rem,env(safe-area-inset-bottom)))]";

export const INBOX_MESSAGE_CONTENT_INSET = [
  "px-3",
  "max-md:pt-[var(--mobile-top-bar-offset)]",
  "md:pt-3",
  INBOX_MESSAGE_BOTTOM_INSET,
].join(" ");

/** Chat input — flush to bottom safe area (no bottom nav). */
export const INBOX_CHAT_INPUT_DOCK = [
  "absolute inset-x-0 bottom-0 z-20 px-3",
  "pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-1",
].join(" ");

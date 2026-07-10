import { mobileOnly } from "@/config/mobile-layout";
import { GLASS_BACKDROP, GLASS_BORDER } from "./glass";

/** Full-bleed Apple Calendar shell on mobile. */
export const APPLE_CALENDAR_ROOT = [
  mobileOnly("min-w-0"),
  mobileOnly("bg-background"),
  mobileOnly("dark:bg-black"),
  mobileOnly("pb-2"),
].join(" ");

export const APPLE_CALENDAR_HEADER = mobileOnly("pt-1");

export const APPLE_CALENDAR_GRID_INSET = mobileOnly("px-0");

export const APPLE_CALENDAR_PILL = [
  "inline-flex h-9 items-center justify-center gap-1 rounded-full",
  "bg-black/6 px-3 text-sm font-medium text-foreground/90",
  "transition-colors active:bg-black/10",
  "dark:bg-[#1C1C1E] dark:text-white dark:active:bg-[#2C2C2E]",
].join(" ");

export const APPLE_CALENDAR_ACTIONS_PILL = [
  "inline-flex h-9 items-center overflow-hidden rounded-full",
  "bg-black/6 dark:bg-[#1C1C1E]",
].join(" ");

export const APPLE_CALENDAR_ACTION_BUTTON = [
  "flex size-9 items-center justify-center text-foreground/75",
  "transition-colors active:bg-black/10 dark:text-white/80 dark:active:bg-white/10",
].join(" ");

export const APPLE_CALENDAR_MONTH_TITLE = [
  "pb-2 pt-1",
  "text-[2.125rem] font-bold capitalize leading-tight tracking-tight",
  "text-foreground dark:text-white",
].join(" ");

export const APPLE_CALENDAR_EVENT_PILL = [
  "w-full truncate rounded-[4px] px-1.5 py-0.5",
  "text-[10px] font-medium leading-tight text-white",
].join(" ");

export const APPLE_CALENDAR_TODAY_BUTTON = [
  "pointer-events-auto fixed left-5 z-20 md:hidden",
  "bottom-[calc(var(--mobile-bottom-nav-offset)+0.625rem)]",
  APPLE_CALENDAR_PILL,
  GLASS_BACKDROP, GLASS_BORDER,
  "h-10 px-4 text-[15px] font-medium",
].join(" ");

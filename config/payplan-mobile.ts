import { mobileOnly } from "@/config/mobile-layout";
import {
  JOURNAL_FILTER_SEARCH_INPUT,
  JOURNAL_FILTER_TRIGGER,
  JOURNAL_FILTER_TRIGGER_ACTIVE,
  JOURNAL_FILTERS_MOBILE_ROW,
  JOURNAL_LIST_CONTAINER_MOBILE,
  JOURNAL_LIST_FRAME_MOBILE,
  JOURNAL_MOBILE_SOLID_DIVIDER,
  JOURNAL_MOBILE_SOLID_SURFACE,
} from "@/config/journal-mobile";
import { PLANS_MOBILE_SOLID_CARD, PLANS_WISH_CARD_MOBILE } from "@/config/plans";
import { MOBILE_LIQUID_GLASS_SURFACE } from "@/config/mobile-nav";

/** Reuse journal solid surface — same `.journal-mobile-solid-surface` in globals.css */
export const PAYPLAN_MOBILE_SOLID_SURFACE = JOURNAL_MOBILE_SOLID_SURFACE;

export const PAYPLAN_LIST_FRAME_MOBILE = JOURNAL_LIST_FRAME_MOBILE;
export const PAYPLAN_LIST_CONTAINER_MOBILE = JOURNAL_LIST_CONTAINER_MOBILE;
export const PAYPLAN_MOBILE_SOLID_DIVIDER = JOURNAL_MOBILE_SOLID_DIVIDER;

/** Card grid — solid muted cards on mobile (reuse wish card CSS). */
export const PAYPLAN_MANAGE_CARD_MOBILE = PLANS_WISH_CARD_MOBILE;
export const PAYPLAN_MOBILE_SOLID_CARD = PLANS_MOBILE_SOLID_CARD;

export const PAYPLAN_MANAGE_LIST_MOBILE = [
  mobileOnly("auto-rows-auto"),
  mobileOnly("max-h-none"),
  mobileOnly("overflow-visible"),
  mobileOnly("pb-0"),
].join(" ");

export const PAYPLAN_MANAGE_EMPTY_MOBILE = [
  PAYPLAN_MOBILE_SOLID_SURFACE,
  mobileOnly("!border-0"),
  mobileOnly("py-12"),
].join(" ");

export const PAYPLAN_FILTERS_MOBILE_ROW = JOURNAL_FILTERS_MOBILE_ROW;
export const PAYPLAN_FILTER_SEARCH_INPUT = JOURNAL_FILTER_SEARCH_INPUT;
export const PAYPLAN_FILTER_TRIGGER = JOURNAL_FILTER_TRIGGER;
export const PAYPLAN_FILTER_TRIGGER_ACTIVE = JOURNAL_FILTER_TRIGGER_ACTIVE;

export const PAYPLAN_MANAGE_SECTION_HEADER = "max-md:hidden";

export const PAYPLAN_MANAGE_TOOLBAR_DESKTOP =
  "hidden shrink-0 flex-wrap items-center md:flex";

export const PAYPLAN_CALENDAR_FRAME_MOBILE = PAYPLAN_MOBILE_SOLID_SURFACE;

export const PAYPLAN_CALENDAR_UPCOMING_FRAME_MOBILE = PAYPLAN_MOBILE_SOLID_SURFACE;

export const PAYPLAN_CALENDAR_TAB_LIST_MOBILE = [
  PAYPLAN_MOBILE_SOLID_SURFACE,
  mobileOnly("!shadow-none"),
  mobileOnly("[backdrop-filter:none!important]"),
  mobileOnly("[-webkit-backdrop-filter:none!important]"),
].join(" ");

/** Floating add — same footprint as Wish FAB. */
export const PAYPLAN_ADD_FAB = [
  "pointer-events-auto fixed right-3 z-30 md:hidden",
  "bottom-[calc(var(--mobile-bottom-nav-offset)+0.625rem)]",
  "flex size-14 items-center justify-center rounded-full",
  "bg-primary text-primary-foreground",
  "shadow-[0_8px_28px_rgba(0,0,0,0.22)]",
  "transition-transform active:scale-95",
].join(" ");

/** Segmented Kalender/Budget — fixed top bar, aligned with Inbox orb. */
export const PAYPLAN_TOP_BAR_TABS_LIST = [
  "pointer-events-auto !h-11 !w-auto shrink-0 items-center gap-0 !rounded-full !p-0 !bg-transparent",
  MOBILE_LIQUID_GLASS_SURFACE,
].join(" ");

/** Sync with `.payplan-top-bar-tab` in globals.css — active uses `--primary` (accent). */
export const PAYPLAN_TOP_BAR_TAB = "payplan-top-bar-tab";

export const PAYPLAN_TOP_BAR_TABS_TRIGGER = [
  PAYPLAN_TOP_BAR_TAB,
  "!size-11 !h-11 !flex-none items-center justify-center !rounded-full",
  "!border-0 !bg-transparent !p-0 !shadow-none",
  "text-muted-foreground/70 transition-[color,transform] active:scale-95",
  "!data-active:bg-transparent !data-active:shadow-none",
  "after:!hidden",
  "[&_svg]:!size-[1.35rem]",
].join(" ");

export const PAYPLAN_TOP_BAR_ACTIONS = "pointer-events-auto flex shrink-0 items-center gap-2";

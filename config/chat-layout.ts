import {
  MOBILE_INPUT_DOCK_SAFE_BOTTOM,
  MOBILE_SAFE_HORIZONTAL_INSET,
} from "@/config/ios-safe-area";

/** Horizontal inset for chat message thread. */
export const CHAT_MESSAGE_INSET_X = "px-3";

/** Top inset — mobile only; desktop thread is edge-to-edge vertically. */
export const CHAT_MESSAGE_INSET_TOP = "";

/** Bottom inset — mobile only; desktop uses INBOX_DESKTOP_MESSAGE_SCROLL_PADDING. */
export const CHAT_MESSAGE_INSET_BOTTOM =
  "max-md:pb-[calc(6rem+var(--mobile-bottom-nav-offset))]";

/** Message thread scroll — thumb visible only while scrolling (see globals.css). */
export const INBOX_MESSAGE_SCROLL_AREA = "inbox-message-scroll";

/** Floating input dock — overlays scroll content, sits above bottom nav. */
export const CHAT_INPUT_DOCK = [
  "absolute inset-x-0 bottom-0 z-20",
  MOBILE_SAFE_HORIZONTAL_INSET,
  MOBILE_INPUT_DOCK_SAFE_BOTTOM,
  "pt-1",
  "max-md:bottom-[var(--mobile-bottom-nav-offset)]",
].join(" ");

/** Slash / @ / ; picker menus above chat input. */
export const CHAT_SLASH_MENU =
  "absolute inset-x-0 bottom-full z-20 mb-2 max-h-56 overflow-y-auto rounded-2xl border border-black/8 bg-popover/95 p-0 shadow-2xl ring-1 ring-foreground/5 glass-backdrop dark:border-white/10 dark:ring-foreground/10";

export const CHAT_PICKER_MENU_HEADER =
  "border-b border-black/6 px-3.5 pt-3 pb-3.5 dark:border-white/8";

export const CHAT_PICKER_MENU_BODY =
  "flex flex-col gap-0.5 px-1.5 pb-2 pt-2.5";

export const CHAT_PICKER_MENU_TITLE =
  "text-xs font-semibold text-foreground/90";

export const CHAT_PICKER_MENU_DESC =
  "mt-1 text-[11px] leading-snug text-muted-foreground";

export const CHAT_SLASH_MENU_ITEM =
  "flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-accent focus-visible:bg-accent focus-visible:outline-none";

export const CHAT_SLASH_MENU_ITEM_ACTIVE = "bg-accent";

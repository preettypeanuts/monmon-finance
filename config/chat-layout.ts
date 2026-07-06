/** Horizontal inset for chat message thread. */
export const CHAT_MESSAGE_INSET_X = "px-3";

/** Top inset on desktop only — mobile uses MOBILE_CHROME_SCROLL_INSET_TOP. */
export const CHAT_MESSAGE_INSET_TOP = "md:pt-3";

/** Bottom inset — clears floating chat input (+ chrome on mobile). */
export const CHAT_MESSAGE_INSET_BOTTOM =
  "pb-24 max-md:pb-[calc(6rem+var(--mobile-bottom-nav-offset))]";

/** Floating input dock — overlays scroll content, sits above bottom nav. */
export const CHAT_INPUT_DOCK =
  "absolute inset-x-0 bottom-0 z-20 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-1 max-md:bottom-[var(--mobile-bottom-nav-offset)]";

/** Slash command menu above chat input. */
export const CHAT_SLASH_MENU =
  "absolute inset-x-0 bottom-full z-20 mb-2 max-h-56 overflow-y-auto rounded-2xl border border-black/8 bg-popover/95 p-1 shadow-2xl ring-1 ring-foreground/5 glass-backdrop dark:border-white/10 dark:ring-foreground/10";

export const CHAT_SLASH_MENU_ITEM =
  "flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-accent focus-visible:bg-accent focus-visible:outline-none";

export const CHAT_SLASH_MENU_ITEM_ACTIVE = "bg-accent";

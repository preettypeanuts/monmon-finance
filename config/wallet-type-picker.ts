export const WALLET_TYPE_PICKER_GRID = "grid grid-cols-2 gap-2";

export const WALLET_TYPE_PICKER_ITEM =
  "flex flex-col items-center justify-center gap-1.5 rounded-xl border px-3 py-3 text-sm font-medium transition-colors";

export const WALLET_TYPE_PICKER_ITEM_SELECTED =
  "border-primary bg-primary text-primary-foreground shadow-sm";

export const WALLET_TYPE_PICKER_ITEM_IDLE = [
  "border-black/6 bg-muted/45 text-muted-foreground",
  "hover:bg-muted/65 dark:border-white/8 dark:bg-muted/30 dark:hover:bg-muted/45",
].join(" ");

export const WALLET_TYPE_PICKER_ICON_SELECTED = "text-primary-foreground";

export const WALLET_TYPE_PICKER_ICON_IDLE = "text-foreground/55";

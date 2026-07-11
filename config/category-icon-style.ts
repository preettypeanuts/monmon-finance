import type { CSSProperties } from "react";

/** iOS-style squircle badge — gradient uses --cat-light / --cat-dark (see globals.css). */
export const CATEGORY_ICON_BADGE =
  "category-icon-badge flex shrink-0 items-center justify-center rounded-[28%] border-0";

export const CATEGORY_ICON_GLYPH =
  "text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.18)]";

export const CATEGORY_ICON_BADGE_SIZE = "size-8";

export interface CategoryIconAccent {
  light: string;
  dark: string;
}

/** Solid squircle accents — derived from existing category palette. */
export const CATEGORY_ICON_ACCENTS: Record<string, CategoryIconAccent> = {
  food: { light: "#3DBE58", dark: "#34C759" },
  groceries: { light: "#36C955", dark: "#30D158" },
  transport: { light: "#8566EE", dark: "#8E5AF7" },
  shopping: { light: "#FF6EB8", dark: "#FF70C1" },
  housing: { light: "#B8956F", dark: "#A89478" },
  utilities: { light: "#C9A800", dark: "#E6B800" },
  bills: { light: "#C9A800", dark: "#E6B800" },
  subscription: { light: "#B055E8", dark: "#BF5AF2" },
  entertainment: { light: "#FF4D73", dark: "#FF375F" },
  health: { light: "#45BEE8", dark: "#5AC8FA" },
  education: { light: "#52C8F5", dark: "#64D2FF" },
  personal: { light: "#F5920A", dark: "#FF9F0A" },
  family: { light: "#FF5A7E", dark: "#FF6482" },
  travel: { light: "#0077F0", dark: "#0A84FF" },
  pets: { light: "#A08262", dark: "#AC8E68" },
  gifts: { light: "#FF2458", dark: "#FF2D55" },
  business: { light: "#504ED0", dark: "#5856D6" },
  insurance: { light: "#289FD9", dark: "#32ADE6" },
  fees: { light: "#7A7A80", dark: "#8E8E93" },
  investment: { light: "#006FE6", dark: "#007AFF" },
  salary: { light: "#3DBE58", dark: "#34C759" },
  side_income: { light: "#36C955", dark: "#30D158" },
  other: { light: "#B8956F", dark: "#A89478" },
};

export const DEFAULT_CATEGORY_ICON_ACCENT: CategoryIconAccent = {
  light: "#B8956F",
  dark: "#A89478",
};

export function getCategoryIconAccent(categoryId: string): CategoryIconAccent {
  const normalized = categoryId === "bills" ? "utilities" : categoryId;
  return CATEGORY_ICON_ACCENTS[normalized] ?? DEFAULT_CATEGORY_ICON_ACCENT;
}

export function resolveCategoryAccent(
  categoryId: string,
  override?: {
    colorIsCustom: boolean;
    accentLight: string | null;
    accentDark: string | null;
  },
): CategoryIconAccent {
  if (
    override?.colorIsCustom &&
    override.accentLight &&
    override.accentDark
  ) {
    return {
      light: override.accentLight,
      dark: override.accentDark,
    };
  }

  return getCategoryIconAccent(categoryId);
}

export function categoryIconAccentStyle(
  accent: CategoryIconAccent,
): CSSProperties {
  return {
    "--cat-light": accent.light,
    "--cat-dark": accent.dark,
  } as CSSProperties;
}

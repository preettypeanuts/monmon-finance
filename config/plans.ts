import { GLASS_SURFACE, GLASS_TILE_BASE } from "@/config/glass";
import {
  PLANNER_MANAGE_CARD,
  PLANNER_MANAGE_CARD_DIVIDER_LINE,
  PLANNER_MANAGE_CARD_SURFACE,
} from "@/config/planner-manage";
import { SOLID_WIDGET_TILE_STYLES } from "@/config/solid-widget-tiles";
import { GRID_GAP } from "@/config/spacing";
import { SEPARATED_SURFACE } from "@/config/shape";
import type { SummaryTileIcon } from "@/config/summary-tiles";
import type { PlansInsightTone } from "@/types/plan";

/** Default glass fill that follows light/dark theme. */
export const PLANS_GLASS = GLASS_SURFACE;

export const PLANS_WIDGET_GRID =
  `grid grid-cols-1 sm:grid-cols-3 ${GRID_GAP}`;

/** Empty-state / neutral tile shell. */
export const PLANS_WIDGET_TILE = `${SEPARATED_SURFACE} ${PLANS_GLASS} px-3.5 py-3`;

export const PLANS_WIDGET_TILE_LAYOUT =
  "flex min-h-[5.5rem] flex-col justify-between px-3.5 py-3 sm:py-4";

export const PLANS_WIDGET_SURFACE = {
  active: SOLID_WIDGET_TILE_STYLES.primary,
  estimated: SOLID_WIDGET_TILE_STYLES.expense,
  balance: SOLID_WIDGET_TILE_STYLES.balance,
} as const;

export const PLANS_AI_SUMMARY_SHELL =
  "relative isolate min-h-28 overflow-hidden rounded-2xl ring-1 ring-white/20 dark:ring-white/10";

const INSIGHT_TILE_HIGHLIGHT =
  "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.32),0_8px_24px_rgba(0,0,0,0.08)] dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.14),0_10px_28px_rgba(0,0,0,0.35)]";

export interface PlansInsightToneStyle {
  surface: string;
  glowOrb: string;
  secondaryOrb: string;
  badgeSurface: string;
  iconSurface: string;
  labelColor: string;
  textColor: string;
  subtitleColor: string;
  metricSpend: string;
  metricBalance: string;
  metricRemaining: string;
}

/** AI summary surface adapts to spend-vs-balance tone. */
export const PLAN_INSIGHT_TONE_STYLES: Record<
  PlansInsightTone,
  PlansInsightToneStyle
> = {
  empty: {
    surface: `bg-linear-to-br from-[#E5E5EA] via-[#C7C7CC] to-[#8E8E93] dark:from-[#48484A] dark:via-[#3A3A3C] dark:to-[#2C2C2E] ${INSIGHT_TILE_HIGHLIGHT}`,
    glowOrb: "bg-white/40",
    secondaryOrb: "bg-black/10 dark:bg-white/8",
    badgeSurface: "bg-white/20 ring-1 ring-white/22 backdrop-blur-sm",
    iconSurface: "bg-white/14 ring-1 ring-white/18 backdrop-blur-sm",
    labelColor: "text-[#1C1C1E]/75 dark:text-white/70",
    textColor: "text-[#1C1C1E]/95 dark:text-white/95",
    subtitleColor: "text-[#1C1C1E]/90 dark:text-white/90",
    metricSpend: "text-[#1C1C1E]/95 dark:text-white/95",
    metricBalance: "text-[#1C1C1E]/95 dark:text-white/95",
    metricRemaining: "text-[#1C1C1E]/95 dark:text-white/95",
  },
  safe: {
    surface: `bg-linear-to-br from-[#B8F0C8] via-[#34C759] to-[#1B8F3A] dark:from-[#1F7A3A] dark:via-[#248A40] dark:to-[#0F5C28] ${INSIGHT_TILE_HIGHLIGHT}`,
    glowOrb: "bg-[#E8FFEF]/65",
    secondaryOrb: "bg-[#34C759]/30",
    badgeSurface: "bg-white/24 ring-1 ring-white/30 backdrop-blur-sm",
    iconSurface: "bg-white/18 ring-1 ring-white/25 backdrop-blur-sm",
    labelColor: "text-[#0A3D18]/75 dark:text-white/70",
    textColor: "text-[#06240E]/95 dark:text-white/95",
    subtitleColor: "text-[#0A3D18]/90 dark:text-white/90",
    metricSpend: "text-[#06240E]/95 dark:text-white/95",
    metricBalance: "text-[#06240E]/95 dark:text-white/95",
    metricRemaining: "text-[#06240E]/95 dark:text-white/95",
  },
  tight: {
    surface: `bg-linear-to-br from-[#FFE98A] via-[#FFD60A] to-[#F5A623] dark:from-[#D4B84A] dark:via-[#B89400] dark:to-[#8B6914] ${INSIGHT_TILE_HIGHLIGHT}`,
    glowOrb: "bg-[#FFFBE6]/70",
    secondaryOrb: "bg-[#FFB020]/35",
    badgeSurface: "bg-white/28 ring-1 ring-white/35 backdrop-blur-sm",
    iconSurface: "bg-white/22 ring-1 ring-white/30 backdrop-blur-sm",
    labelColor: "text-[#5C4A00]/80 dark:text-white/70",
    textColor: "text-[#2E2500]/95 dark:text-white/95",
    subtitleColor: "text-[#5C4A00]/90 dark:text-white/90",
    metricSpend: "text-[#2E2500]/95 dark:text-white/95",
    metricBalance: "text-[#2E2500]/95 dark:text-white/95",
    metricRemaining: "text-[#2E2500]/95 dark:text-white/95",
  },
  unsafe: {
    surface: `bg-linear-to-br from-[#FFC4C4] via-[#FF6B6B] to-[#D93838] dark:from-[#A83A3A] dark:via-[#8B2E2E] dark:to-[#5C1C1C] ${INSIGHT_TILE_HIGHLIGHT}`,
    glowOrb: "bg-[#FFE8E8]/55",
    secondaryOrb: "bg-[#FF3B30]/28",
    badgeSurface: "bg-white/24 ring-1 ring-white/28 backdrop-blur-sm",
    iconSurface: "bg-white/18 ring-1 ring-white/22 backdrop-blur-sm",
    labelColor: "text-[#5C1010]/75 dark:text-white/70",
    textColor: "text-[#2A0808]/95 dark:text-white/95",
    subtitleColor: "text-[#5C1010]/90 dark:text-white/90",
    metricSpend: "text-[#2A0808]/95 dark:text-white/95",
    metricBalance: "text-[#2A0808]/95 dark:text-white/95",
    metricRemaining: "text-[#2A0808]/95 dark:text-white/95",
  },
};

export function getPlansInsightToneStyle(
  tone: PlansInsightTone,
): PlansInsightToneStyle {
  return PLAN_INSIGHT_TONE_STYLES[tone];
}

export const PLANS_CARD = PLANNER_MANAGE_CARD;

export const PLANS_CARD_LIST = `grid grid-cols-1 pb-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 ${GRID_GAP}`;

export const PLANS_CARD_BODY =
  "flex min-h-0 flex-1 flex-col gap-3 px-3.5 py-3 sm:px-4 sm:py-3.5";

export const PLANS_CARD_FOOTER = "mt-auto shrink-0";

export const PLANS_CARD_DIVIDER = PLANNER_MANAGE_CARD_DIVIDER_LINE;

export const PLANS_CARD_FOOTER_CONTENT = "px-3.5 py-2.5 sm:px-4";

export const PLAN_STATUS_LABEL: Record<"active" | "done", string> = {
  active: "Aktif",
  done: "Selesai",
};

export type PlanWidgetId = "active" | "estimated" | "balance";

export interface PlanAccentStyle {
  icon: SummaryTileIcon | "heart" | "sparkle";
  iconColor: string;
  iconSurface: string;
  valueColor: string;
  badge: string;
}

/** Color codes for Plans summary widgets. */
export const PLAN_WIDGET_STYLES: Record<PlanWidgetId, PlanAccentStyle> = {
  active: {
    icon: "heart",
    iconColor: "text-[#007AFF]",
    iconSurface: "bg-[#007AFF]/15 dark:bg-[#007AFF]/20",
    valueColor: "text-[#007AFF]",
    badge:
      "bg-[#007AFF]/14 text-[#007AFF] ring-1 ring-[#007AFF]/25 dark:bg-[#007AFF]/18 dark:ring-[#007AFF]/30",
  },
  estimated: {
    icon: "shopping-bag",
    iconColor: "text-[#FF6B6B]",
    iconSurface: "bg-[#FF6B6B]/15 dark:bg-[#FF6B6B]/20",
    valueColor: "text-[#FF6B6B]",
    badge:
      "bg-[#FF6B6B]/14 text-[#FF6B6B] ring-1 ring-[#FF6B6B]/25 dark:bg-[#FF6B6B]/18 dark:ring-[#FF6B6B]/30",
  },
  balance: {
    icon: "wallet",
    iconColor: "text-[#8E5AF7]",
    iconSurface: "bg-[#8E5AF7]/15 dark:bg-[#8E5AF7]/20",
    valueColor: "text-[#8E5AF7]",
    badge:
      "bg-[#8E5AF7]/14 text-[#8E5AF7] ring-1 ring-[#8E5AF7]/25 dark:bg-[#8E5AF7]/18 dark:ring-[#8E5AF7]/30",
  },
};

/** Map category tile colors into compact accent tokens for plan cards. */
const CATEGORY_ACCENT: Record<string, Omit<PlanAccentStyle, "icon">> = {
  food: {
    iconColor: "text-[#34C759]",
    iconSurface: "bg-[#34C759]/15 dark:bg-[#34C759]/20",
    valueColor: "text-[#34C759]",
    badge:
      "bg-[#34C759]/14 text-[#34C759] ring-1 ring-[#34C759]/25 dark:bg-[#34C759]/18 dark:ring-[#34C759]/30",
  },
  groceries: {
    iconColor: "text-[#30D158]",
    iconSurface: "bg-[#30D158]/15 dark:bg-[#30D158]/20",
    valueColor: "text-[#30D158]",
    badge:
      "bg-[#30D158]/14 text-[#30D158] ring-1 ring-[#30D158]/25 dark:bg-[#30D158]/18 dark:ring-[#30D158]/30",
  },
  transport: {
    iconColor: "text-[#8E5AF7]",
    iconSurface: "bg-[#8E5AF7]/15 dark:bg-[#8E5AF7]/20",
    valueColor: "text-[#8E5AF7]",
    badge:
      "bg-[#8E5AF7]/14 text-[#8E5AF7] ring-1 ring-[#8E5AF7]/25 dark:bg-[#8E5AF7]/18 dark:ring-[#8E5AF7]/30",
  },
  shopping: {
    iconColor: "text-[#FF70C1]",
    iconSurface: "bg-[#FF70C1]/15 dark:bg-[#FF70C1]/20",
    valueColor: "text-[#FF70C1]",
    badge:
      "bg-[#FF70C1]/14 text-[#FF70C1] ring-1 ring-[#FF70C1]/25 dark:bg-[#FF70C1]/18 dark:ring-[#FF70C1]/30",
  },
  housing: {
    iconColor: "text-[#A89478] dark:text-[#C4B095]",
    iconSurface: "bg-[#A89478]/15 dark:bg-[#C4B095]/20",
    valueColor: "text-[#A89478] dark:text-[#C4B095]",
    badge:
      "bg-[#A89478]/14 text-[#A89478] ring-1 ring-[#A89478]/25 dark:bg-[#C4B095]/18 dark:text-[#C4B095] dark:ring-[#C4B095]/30",
  },
  utilities: {
    iconColor: "text-[#C9A800] dark:text-[#FFD60A]",
    iconSurface: "bg-[#FFD60A]/15 dark:bg-[#FFD60A]/20",
    valueColor: "text-[#C9A800] dark:text-[#FFD60A]",
    badge:
      "bg-[#FFD60A]/14 text-[#C9A800] ring-1 ring-[#FFD60A]/25 dark:bg-[#FFD60A]/18 dark:text-[#FFD60A] dark:ring-[#FFD60A]/30",
  },
  subscription: {
    iconColor: "text-[#BF5AF2]",
    iconSurface: "bg-[#BF5AF2]/15 dark:bg-[#BF5AF2]/20",
    valueColor: "text-[#BF5AF2]",
    badge:
      "bg-[#BF5AF2]/14 text-[#BF5AF2] ring-1 ring-[#BF5AF2]/25 dark:bg-[#BF5AF2]/18 dark:ring-[#BF5AF2]/30",
  },
  entertainment: {
    iconColor: "text-[#FF375F]",
    iconSurface: "bg-[#FF375F]/15 dark:bg-[#FF375F]/20",
    valueColor: "text-[#FF375F]",
    badge:
      "bg-[#FF375F]/14 text-[#FF375F] ring-1 ring-[#FF375F]/25 dark:bg-[#FF375F]/18 dark:ring-[#FF375F]/30",
  },
  health: {
    iconColor: "text-[#5AC8FA]",
    iconSurface: "bg-[#5AC8FA]/15 dark:bg-[#5AC8FA]/20",
    valueColor: "text-[#5AC8FA]",
    badge:
      "bg-[#5AC8FA]/14 text-[#5AC8FA] ring-1 ring-[#5AC8FA]/25 dark:bg-[#5AC8FA]/18 dark:ring-[#5AC8FA]/30",
  },
  education: {
    iconColor: "text-[#64D2FF]",
    iconSurface: "bg-[#64D2FF]/15 dark:bg-[#64D2FF]/20",
    valueColor: "text-[#64D2FF]",
    badge:
      "bg-[#64D2FF]/14 text-[#64D2FF] ring-1 ring-[#64D2FF]/25 dark:bg-[#64D2FF]/18 dark:ring-[#64D2FF]/30",
  },
  personal: {
    iconColor: "text-[#FF9F0A]",
    iconSurface: "bg-[#FF9F0A]/15 dark:bg-[#FF9F0A]/20",
    valueColor: "text-[#FF9F0A]",
    badge:
      "bg-[#FF9F0A]/14 text-[#FF9F0A] ring-1 ring-[#FF9F0A]/25 dark:bg-[#FF9F0A]/18 dark:ring-[#FF9F0A]/30",
  },
  family: {
    iconColor: "text-[#FF6482]",
    iconSurface: "bg-[#FF6482]/15 dark:bg-[#FF6482]/20",
    valueColor: "text-[#FF6482]",
    badge:
      "bg-[#FF6482]/14 text-[#FF6482] ring-1 ring-[#FF6482]/25 dark:bg-[#FF6482]/18 dark:ring-[#FF6482]/30",
  },
  travel: {
    iconColor: "text-[#0A84FF]",
    iconSurface: "bg-[#0A84FF]/15 dark:bg-[#0A84FF]/20",
    valueColor: "text-[#0A84FF]",
    badge:
      "bg-[#0A84FF]/14 text-[#0A84FF] ring-1 ring-[#0A84FF]/25 dark:bg-[#0A84FF]/18 dark:ring-[#0A84FF]/30",
  },
  pets: {
    iconColor: "text-[#AC8E68]",
    iconSurface: "bg-[#AC8E68]/15 dark:bg-[#AC8E68]/20",
    valueColor: "text-[#AC8E68]",
    badge:
      "bg-[#AC8E68]/14 text-[#AC8E68] ring-1 ring-[#AC8E68]/25 dark:bg-[#AC8E68]/18 dark:ring-[#AC8E68]/30",
  },
  gifts: {
    iconColor: "text-[#FF2D55]",
    iconSurface: "bg-[#FF2D55]/15 dark:bg-[#FF2D55]/20",
    valueColor: "text-[#FF2D55]",
    badge:
      "bg-[#FF2D55]/14 text-[#FF2D55] ring-1 ring-[#FF2D55]/25 dark:bg-[#FF2D55]/18 dark:ring-[#FF2D55]/30",
  },
  business: {
    iconColor: "text-[#5856D6]",
    iconSurface: "bg-[#5856D6]/15 dark:bg-[#5856D6]/20",
    valueColor: "text-[#5856D6]",
    badge:
      "bg-[#5856D6]/14 text-[#5856D6] ring-1 ring-[#5856D6]/25 dark:bg-[#5856D6]/18 dark:ring-[#5856D6]/30",
  },
  insurance: {
    iconColor: "text-[#32ADE6]",
    iconSurface: "bg-[#32ADE6]/15 dark:bg-[#32ADE6]/20",
    valueColor: "text-[#32ADE6]",
    badge:
      "bg-[#32ADE6]/14 text-[#32ADE6] ring-1 ring-[#32ADE6]/25 dark:bg-[#32ADE6]/18 dark:ring-[#32ADE6]/30",
  },
  fees: {
    iconColor: "text-[#8E8E93]",
    iconSurface: "bg-[#8E8E93]/15 dark:bg-[#8E8E93]/20",
    valueColor: "text-[#8E8E93]",
    badge:
      "bg-[#8E8E93]/14 text-[#8E8E93] ring-1 ring-[#8E8E93]/25 dark:bg-[#8E8E93]/18 dark:ring-[#8E8E93]/30",
  },
  investment: {
    iconColor: "text-[#007AFF]",
    iconSurface: "bg-[#007AFF]/15 dark:bg-[#007AFF]/20",
    valueColor: "text-[#007AFF]",
    badge:
      "bg-[#007AFF]/14 text-[#007AFF] ring-1 ring-[#007AFF]/25 dark:bg-[#007AFF]/18 dark:ring-[#007AFF]/30",
  },
};

const DEFAULT_CATEGORY_ACCENT: PlanAccentStyle = {
  icon: "shopping-bag",
  iconColor: "text-[#FF70C1]",
  iconSurface: "bg-[#FF70C1]/15 dark:bg-[#FF70C1]/20",
  valueColor: "text-[#FF70C1]",
  badge:
    "bg-[#FF70C1]/14 text-[#FF70C1] ring-1 ring-[#FF70C1]/25 dark:bg-[#FF70C1]/18 dark:ring-[#FF70C1]/30",
};

const CATEGORY_ICONS: Record<string, PlanAccentStyle["icon"]> = {
  food: "fork-knife",
  groceries: "fork-knife",
  transport: "car",
  shopping: "shopping-bag",
  housing: "wallet",
  utilities: "receipt",
  bills: "receipt",
  subscription: "receipt",
  entertainment: "dots-three",
  health: "receipt",
  education: "coins",
  personal: "shopping-bag",
  family: "coins",
  travel: "car",
  pets: "dots-three",
  gifts: "coins",
  business: "wallet",
  insurance: "receipt",
  fees: "receipt",
  investment: "wallet",
};

export function getPlanCategoryAccent(category: string): PlanAccentStyle {
  const normalized = category === "bills" ? "utilities" : category;
  const accent = CATEGORY_ACCENT[normalized];
  const icon = CATEGORY_ICONS[normalized] ?? "shopping-bag";

  if (!accent) {
    return DEFAULT_CATEGORY_ACCENT;
  }

  return { ...accent, icon };
}

/** Status accent for active vs done plans. */
export const PLAN_STATUS_ACCENT: Record<"active" | "done", PlanAccentStyle> = {
  active: PLAN_WIDGET_STYLES.active,
  done: {
    icon: "dots-three",
    iconColor: "text-[#8E8E93]",
    iconSurface: "bg-[#8E8E93]/15 dark:bg-[#8E8E93]/20",
    valueColor: "text-[#8E8E93]",
    badge:
      "bg-[#8E8E93]/14 text-[#8E8E93] ring-1 ring-[#8E8E93]/25 dark:bg-[#8E8E93]/18 dark:ring-[#8E8E93]/30",
  },
};

/** Shared icon map key for plan UI. */
export type PlanIconName = PlanAccentStyle["icon"];

export const PLANS_AI_ICON_SURFACE = `${GLASS_TILE_BASE} bg-muted/50`;

export const PLANS_RELATED_UPCOMING_SHELL = `${PLANNER_MANAGE_CARD_SURFACE} overflow-hidden`;

export const PLANS_RELATED_UPCOMING_HEADER = "px-3.5 py-3 sm:px-4";

export const PLANS_RELATED_UPCOMING_LIST = "flex flex-col";

export const PLANS_RELATED_UPCOMING_ROW =
  "flex items-center justify-between gap-3 px-3.5 py-3 sm:px-4";

export const PLANS_RELATED_UPCOMING_DIVIDER = PLANNER_MANAGE_CARD_DIVIDER_LINE;

export const PLANS_RELATED_UPCOMING_EMPTY =
  "px-3.5 py-6 text-center text-xs text-muted-foreground sm:px-4";

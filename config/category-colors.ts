import type { CategoryIconAccent } from "@/config/category-icon-style";

/** Preset squircle colors for category form picker. */
export const CATEGORY_COLOR_OPTIONS = [
  {
    id: "green",
    label: "Green",
    accent: { light: "#3DBE58", dark: "#34C759" },
  },
  { id: "teal", label: "Teal", accent: { light: "#289FD9", dark: "#32ADE6" } },
  {
    id: "purple",
    label: "Purple",
    accent: { light: "#8566EE", dark: "#8E5AF7" },
  },
  { id: "pink", label: "Pink", accent: { light: "#FF6EB8", dark: "#FF70C1" } },
  {
    id: "coral",
    label: "Coral",
    accent: { light: "#FF4D73", dark: "#FF375F" },
  },
  { id: "rose", label: "Rose", accent: { light: "#FF5A7E", dark: "#FF6482" } },
  { id: "red", label: "Red", accent: { light: "#FF2458", dark: "#FF2D55" } },
  {
    id: "orange",
    label: "Orange",
    accent: { light: "#F5920A", dark: "#FF9F0A" },
  },
  {
    id: "yellow",
    label: "Yellow",
    accent: { light: "#C9A800", dark: "#E6B800" },
  },
  { id: "cyan", label: "Cyan", accent: { light: "#45BEE8", dark: "#5AC8FA" } },
  { id: "sky", label: "Sky", accent: { light: "#52C8F5", dark: "#64D2FF" } },
  { id: "blue", label: "Blue", accent: { light: "#0077F0", dark: "#0A84FF" } },
  {
    id: "indigo",
    label: "Indigo",
    accent: { light: "#504ED0", dark: "#5856D6" },
  },
  {
    id: "violet",
    label: "Violet",
    accent: { light: "#B055E8", dark: "#BF5AF2" },
  },
  {
    id: "brown",
    label: "Brown",
    accent: { light: "#B8956F", dark: "#A89478" },
  },
  { id: "gray", label: "Gray", accent: { light: "#7A7A80", dark: "#8E8E93" } },
] as const;

export type CategoryColorId = (typeof CATEGORY_COLOR_OPTIONS)[number]["id"];

export interface CategoryColorOption {
  id: CategoryColorId;
  label: string;
  accent: CategoryIconAccent;
}

const HEX_COLOR = /^#[0-9A-Fa-f]{6}$/;

export function isCategoryHexColor(value: string): boolean {
  return HEX_COLOR.test(value);
}

export function isCategoryAccent(value: {
  light: string;
  dark: string;
}): value is CategoryIconAccent {
  return isCategoryHexColor(value.light) && isCategoryHexColor(value.dark);
}

export function accentsEqual(
  a: CategoryIconAccent,
  b: CategoryIconAccent,
): boolean {
  return (
    a.light.toLowerCase() === b.light.toLowerCase() &&
    a.dark.toLowerCase() === b.dark.toLowerCase()
  );
}

export function findCategoryColorOptionByAccent(
  accent: CategoryIconAccent,
): (typeof CATEGORY_COLOR_OPTIONS)[number] | undefined {
  return CATEGORY_COLOR_OPTIONS.find((option) =>
    accentsEqual(option.accent, accent),
  );
}

export function resolveCategoryColorOptionId(
  accent: CategoryIconAccent,
): CategoryColorId {
  return findCategoryColorOptionByAccent(accent)?.id ?? "green";
}

import { MANIFEST_THEME_COLOR } from "@/config/app";
import { isWallpaperRoute } from "@/config/page-surface";
import {
  SAFARI_CUSTOM_WALLPAPER_THEME,
  SAFARI_WALLPAPER_THEME_COLORS,
} from "@/config/safari-browser-chrome";
import { isStandalonePwa } from "@/lib/pwa/standalone-viewport";
import type { Wallpaper, WallpaperId, WallpaperMaskColor } from "@/types/wallpaper";

const THEME_COLOR_META = 'meta[name="theme-color"]';

interface ResolveSafariBrowserThemeColorInput {
  wallpaperId: WallpaperId;
  wallpaper: Wallpaper;
  resolvedDark: boolean;
  useWallpaperRoot: boolean;
  maskOpacity: number;
  maskColor: WallpaperMaskColor;
}

function parseRgbChannel(value: string): number {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? Math.round(parsed) : 0;
}

function rgbStringToHex(color: string): string | null {
  const match = /^rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)/i.exec(
    color.trim(),
  );

  if (!match) {
    return null;
  }

  const red = parseRgbChannel(match[1]);
  const green = parseRgbChannel(match[2]);
  const blue = parseRgbChannel(match[3]);

  return `#${[red, green, blue]
    .map((channel) => channel.toString(16).padStart(2, "0"))
    .join("")}`;
}

function readDocumentBackgroundHex(): string {
  if (typeof document === "undefined") {
    return MANIFEST_THEME_COLOR;
  }

  const probe = document.createElement("div");
  probe.style.display = "none";
  probe.style.backgroundColor = "var(--background)";
  document.body.appendChild(probe);

  const computed = getComputedStyle(probe).backgroundColor;
  probe.remove();

  return rgbStringToHex(computed) ?? MANIFEST_THEME_COLOR;
}

function parseHexColor(hex: string): [number, number, number] | null {
  const normalized = hex.replace("#", "").trim();

  if (normalized.length === 3) {
    return [
      Number.parseInt(normalized[0] + normalized[0], 16),
      Number.parseInt(normalized[1] + normalized[1], 16),
      Number.parseInt(normalized[2] + normalized[2], 16),
    ];
  }

  if (normalized.length !== 6) {
    return null;
  }

  return [
    Number.parseInt(normalized.slice(0, 2), 16),
    Number.parseInt(normalized.slice(2, 4), 16),
    Number.parseInt(normalized.slice(4, 6), 16),
  ];
}

function blendHexColors(base: string, overlay: string, ratio: number): string {
  const baseRgb = parseHexColor(base);
  const overlayRgb = parseHexColor(overlay);

  if (!baseRgb || !overlayRgb) {
    return base;
  }

  const mix = (left: number, right: number) =>
    Math.round(left + (right - left) * ratio);

  return `#${[mix(baseRgb[0], overlayRgb[0]), mix(baseRgb[1], overlayRgb[1]), mix(baseRgb[2], overlayRgb[2])]
    .map((channel) => channel.toString(16).padStart(2, "0"))
    .join("")}`;
}

function applyMaskToThemeColor(
  base: string,
  maskColor: WallpaperMaskColor,
  maskOpacity: number,
): string {
  if (maskOpacity <= 0) {
    return base;
  }

  const overlay = maskColor === "black" ? "#000000" : "#ffffff";
  return blendHexColors(base, overlay, maskOpacity / 100);
}

export function resolveUseWallpaperRoot(
  isMobile: boolean,
  pathname: string,
): boolean {
  if (!isMobile) {
    return true;
  }

  if (isWallpaperRoute(pathname)) {
    return true;
  }

  // Mobile Safari browser only — bleed wallpaper under translucent chrome.
  if (!isStandalonePwa()) {
    return true;
  }

  return false;
}

export function resolveSafariBrowserThemeColor({
  wallpaperId,
  wallpaper,
  resolvedDark,
  useWallpaperRoot,
  maskOpacity,
  maskColor,
}: ResolveSafariBrowserThemeColorInput): string {
  let base: string;

  if (!useWallpaperRoot) {
    base = readDocumentBackgroundHex();
  } else {
    const preset = SAFARI_WALLPAPER_THEME_COLORS[wallpaperId];

    if (preset) {
      base = resolvedDark ? preset.dark : preset.light;
    } else if (wallpaper.kind === "image") {
      base = resolvedDark
        ? SAFARI_CUSTOM_WALLPAPER_THEME.dark
        : SAFARI_CUSTOM_WALLPAPER_THEME.light;
    } else {
      base = readDocumentBackgroundHex();
    }
  }

  return applyMaskToThemeColor(base, maskColor, maskOpacity);
}

export function applySafariBrowserThemeColor(color: string): void {
  let meta = document.querySelector<HTMLMetaElement>(THEME_COLOR_META);

  if (!meta) {
    meta = document.createElement("meta");
    meta.name = "theme-color";
    document.head.appendChild(meta);
  }

  if (meta.content !== color) {
    meta.content = color;
  }
}

export function shouldSyncSafariBrowserChrome(isMobile: boolean): boolean {
  return isMobile && !isStandalonePwa();
}

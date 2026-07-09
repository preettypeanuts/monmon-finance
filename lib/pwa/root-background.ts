import type { CSSProperties } from "react";

export function applyWallpaperBackground(
  element: HTMLElement,
  style: CSSProperties,
): void {
  element.style.background = "";
  element.style.backgroundColor = style.backgroundColor
    ? String(style.backgroundColor)
    : "";
  element.style.backgroundImage = style.backgroundImage
    ? String(style.backgroundImage)
    : "";
  element.style.backgroundSize = style.backgroundSize
    ? String(style.backgroundSize)
    : "";
  element.style.backgroundPosition = style.backgroundPosition
    ? String(style.backgroundPosition)
    : "";
  element.style.backgroundRepeat = style.backgroundRepeat
    ? String(style.backgroundRepeat)
    : "";
}

export function applySolidBackground(element: HTMLElement): void {
  element.style.background = "";
  element.style.backgroundColor = "var(--background)";
  element.style.backgroundImage = "";
  element.style.backgroundSize = "";
  element.style.backgroundPosition = "";
  element.style.backgroundRepeat = "";
}

export function clearRootBackground(element: HTMLElement): void {
  element.style.background = "";
  element.style.backgroundColor = "";
  element.style.backgroundImage = "";
  element.style.backgroundSize = "";
  element.style.backgroundPosition = "";
  element.style.backgroundRepeat = "";
}

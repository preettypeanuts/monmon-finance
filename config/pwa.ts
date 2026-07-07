import { MANIFEST_BACKGROUND_COLOR, MANIFEST_THEME_COLOR } from "@/config/app";

/** Android / manifest chrome. */
export const PWA_THEME_COLOR = MANIFEST_THEME_COLOR;

/** Splash screen — OS supplies tile background behind transparent logo. */
export const PWA_SPLASH_BACKGROUND_COLOR = MANIFEST_BACKGROUND_COLOR;

/** Transparent master logo — regenerate icons after replacing. */
export const PWA_LOGO_SOURCE = "/W.png";

export const PWA_ICON_192 = "/icon-192.png";
export const PWA_ICON_512 = "/icon-512.png";
export const PWA_APPLE_TOUCH_ICON = "/apple-touch-icon.png";

/**
 * Full-bleed wallpaper layer — sync with `.pwa-fullscreen-bleed` in globals.css.
 */
export const PWA_FULLSCREEN_BLEED = "pwa-fullscreen-bleed";

/** Dimming overlay — full-bleed on mobile; desktop may offset below safe area. */
export const PWA_WALLPAPER_MASK = "pwa-wallpaper-mask";

/**
 * Standalone PWA viewport — disables pinch/double-tap zoom (native-like).
 * Applied via bootstrap script only when installed, not in mobile browser.
 */
export const PWA_STANDALONE_VIEWPORT_CONTENT =
  "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover";

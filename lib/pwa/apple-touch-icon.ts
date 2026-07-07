import {
  PWA_APPLE_TOUCH_ICON_DARK,
  PWA_APPLE_TOUCH_ICON_LIGHT,
} from "@/config/pwa";

/** Pick light/dark apple-touch-icon before Add to Home Screen (iOS ignores media on link tags). */
export function createAppleTouchIconBootstrapScript(): string {
  return `
(function () {
  var dark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  var href = dark ? "${PWA_APPLE_TOUCH_ICON_DARK}" : "${PWA_APPLE_TOUCH_ICON_LIGHT}";
  var link = document.querySelector('link[rel="apple-touch-icon"]');
  if (!link) {
    link = document.createElement("link");
    link.rel = "apple-touch-icon";
    document.head.appendChild(link);
  }
  link.href = href;
})();
`.trim();
}

/** Detect iOS / installed PWA standalone mode. */
export function isStandalonePwa(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  const navigatorWithStandalone = window.navigator as Navigator & {
    standalone?: boolean;
  };

  return (
    navigatorWithStandalone.standalone === true ||
    window.matchMedia("(display-mode: standalone)").matches
  );
}

/** Standalone PWA must use 100vh — dvh/svh exclude the Dynamic Island band on cold start. */
export function applyStandaloneAppHeight(): void {
  if (!isStandalonePwa()) {
    return;
  }

  document.documentElement.dataset.standalone = "true";
  document.documentElement.style.setProperty("--app-height", "100vh");
}

/** Inline bootstrap — runs before first paint in root layout. */
export const PWA_STANDALONE_BOOTSTRAP_SCRIPT = `
(function () {
  var standalone =
    window.navigator.standalone === true ||
    window.matchMedia("(display-mode: standalone)").matches;
  if (!standalone) return;
  document.documentElement.dataset.standalone = "true";
  document.documentElement.style.setProperty("--app-height", "100vh");
})();
`.trim();

"use client";

import { useEffect } from "react";

import { applyStandaloneAppHeight } from "@/lib/pwa/standalone-viewport";

/** Keeps `--app-height: 100vh` after resume / viewport changes in standalone PWA. */
export function PwaStandaloneViewportFix() {
  useEffect(() => {
    applyStandaloneAppHeight();

    const onViewportChange = () => {
      applyStandaloneAppHeight();
    };

    window.addEventListener("resize", onViewportChange);
    window.visualViewport?.addEventListener("resize", onViewportChange);

    return () => {
      window.removeEventListener("resize", onViewportChange);
      window.visualViewport?.removeEventListener("resize", onViewportChange);
    };
  }, []);

  return null;
}

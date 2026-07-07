"use client";

import { useEffect } from "react";

const STATUS_BAR_META = "apple-mobile-web-app-status-bar-style";
const STATUS_BAR_VALUE = "black-translucent";

/** Ensure iOS status bar meta exists (translucent / edge-to-edge). */
export function PwaStatusBarFix() {
  useEffect(() => {
    let meta = document.querySelector<HTMLMetaElement>(
      `meta[name="${STATUS_BAR_META}"]`,
    );

    if (!meta) {
      meta = document.createElement("meta");
      meta.name = STATUS_BAR_META;
      document.head.appendChild(meta);
    }

    if (meta.content !== STATUS_BAR_VALUE) {
      meta.content = STATUS_BAR_VALUE;
    }
  }, []);

  return null;
}

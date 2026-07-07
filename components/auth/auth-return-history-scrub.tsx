"use client";

import { useEffect } from "react";

import { consumeAuthReturnPath } from "@/lib/auth/auth-return";

/** Clears OAuth/login history after Google redirect so device back stays in-app. */
export function AuthReturnHistoryScrub() {
  useEffect(() => {
    const returnPath = consumeAuthReturnPath();

    if (!returnPath) {
      return;
    }

    const target = returnPath.startsWith("/") ? returnPath : "/";

    if (window.history.length <= 1) {
      window.history.replaceState(null, "", target);
      return;
    }

    window.history.go(1 - window.history.length);

    const handlePopState = () => {
      window.location.replace(target);
    };

    window.addEventListener("popstate", handlePopState, { once: true });

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  return null;
}

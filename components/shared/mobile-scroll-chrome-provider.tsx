"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export interface MobileScrollChromeSnapshot {
  title: string;
  showBlur: boolean;
  showCompactTitle: boolean;
}

interface MobileScrollChromeContextValue {
  snapshot: MobileScrollChromeSnapshot | null;
  setSnapshot: (snapshot: MobileScrollChromeSnapshot | null) => void;
}

const MobileScrollChromeContext =
  createContext<MobileScrollChromeContextValue | null>(null);

export function MobileScrollChromeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [snapshot, setSnapshot] =
    useState<MobileScrollChromeSnapshot | null>(null);

  const value = useMemo(
    () => ({
      snapshot,
      setSnapshot,
    }),
    [snapshot],
  );

  return (
    <MobileScrollChromeContext.Provider value={value}>
      {children}
    </MobileScrollChromeContext.Provider>
  );
}

function useMobileScrollChromeContext(): MobileScrollChromeContextValue {
  const context = useContext(MobileScrollChromeContext);
  if (!context) {
    throw new Error(
      "useSyncMobileScrollChrome must be used within MobileScrollChromeProvider",
    );
  }

  return context;
}

export function useSyncMobileScrollChrome(
  title: string | undefined,
  showBlur: boolean,
  showCompactTitle: boolean,
): void {
  const { setSnapshot } = useMobileScrollChromeContext();

  useEffect(() => {
    if (!title) {
      setSnapshot(null);
      return;
    }

    setSnapshot({ title, showBlur, showCompactTitle });
    return () => setSnapshot(null);
  }, [setSnapshot, showBlur, showCompactTitle, title]);
}

export function useMobileScrollChromeSnapshot(): MobileScrollChromeSnapshot | null {
  const context = useContext(MobileScrollChromeContext);
  return context?.snapshot ?? null;
}

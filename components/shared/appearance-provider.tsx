"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";

import { DEFAULT_ACCENT_ID } from "@/config/accent-colors";
import { DEFAULT_THEME_MODE } from "@/config/theme-modes";
import {
  applyAppearance,
  resolveDarkMode,
} from "@/lib/appearance/apply-appearance";
import {
  readStoredAccentId,
  readStoredThemeMode,
  writeStoredAccentId,
  writeStoredThemeMode,
} from "@/lib/appearance/storage";
import type { AccentColorId, ThemeMode } from "@/types/appearance";

interface AppearanceContextValue {
  themeMode: ThemeMode;
  accentId: AccentColorId;
  resolvedDark: boolean;
  setThemeMode: (mode: ThemeMode) => void;
  setAccentId: (id: AccentColorId) => void;
}

const AppearanceContext = createContext<AppearanceContextValue | null>(null);

interface AppearanceProviderProps {
  children: React.ReactNode;
  initialThemeMode?: ThemeMode;
  initialAccentId?: AccentColorId;
  initialResolvedDark?: boolean;
}

export function AppearanceProvider({
  children,
  initialThemeMode = DEFAULT_THEME_MODE,
  initialAccentId = DEFAULT_ACCENT_ID,
  initialResolvedDark = false,
}: AppearanceProviderProps) {
  const [themeMode, setThemeModeState] =
    useState<ThemeMode>(initialThemeMode);
  const [accentId, setAccentIdState] =
    useState<AccentColorId>(initialAccentId);
  const [resolvedDark, setResolvedDark] = useState(initialResolvedDark);

  useLayoutEffect(() => {
    const storedThemeMode = readStoredThemeMode();
    const storedAccentId = readStoredAccentId();

    setThemeModeState(storedThemeMode);
    setAccentIdState(storedAccentId);
    writeStoredThemeMode(storedThemeMode);
    writeStoredAccentId(storedAccentId);
    applyAppearance({
      themeMode: storedThemeMode,
      accentId: storedAccentId,
    });
    setResolvedDark(resolveDarkMode(storedThemeMode));
  }, []);

  useEffect(() => {
    applyAppearance({ themeMode, accentId });
    setResolvedDark(resolveDarkMode(themeMode));
  }, [themeMode, accentId]);

  useEffect(() => {
    if (themeMode !== "system") {
      return;
    }

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      applyAppearance({ themeMode, accentId });
      setResolvedDark(resolveDarkMode(themeMode));
    };

    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, [themeMode, accentId]);

  const setThemeMode = useCallback((mode: ThemeMode) => {
    setThemeModeState(mode);
    writeStoredThemeMode(mode);
  }, []);

  const setAccentId = useCallback((id: AccentColorId) => {
    setAccentIdState(id);
    writeStoredAccentId(id);
  }, []);

  const value = useMemo<AppearanceContextValue>(
    () => ({
      themeMode,
      accentId,
      resolvedDark,
      setThemeMode,
      setAccentId,
    }),
    [accentId, resolvedDark, setAccentId, setThemeMode, themeMode],
  );

  return (
    <AppearanceContext.Provider value={value}>
      {children}
    </AppearanceContext.Provider>
  );
}

export function useAppearance(): AppearanceContextValue {
  const context = useContext(AppearanceContext);

  if (!context) {
    throw new Error("useAppearance must be used within AppearanceProvider");
  }

  return context;
}

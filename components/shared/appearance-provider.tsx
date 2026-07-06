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
import { DEFAULT_BALANCE_VISIBLE } from "@/config/balance-visibility";
import { DEFAULT_GLASS_BLUR_LEVEL } from "@/config/glass-blur";
import { DEFAULT_GLASS_FILL_TRANSPARENCY } from "@/config/glass-fill";
import { DEFAULT_THEME_MODE } from "@/config/theme-modes";
import {
  applyAppearance,
  resolveDarkMode,
} from "@/lib/appearance/apply-appearance";
import { applyGlassAppearance } from "@/lib/appearance/apply-glass-blur";
import {
  readStoredBalanceVisible,
  writeStoredBalanceVisible,
} from "@/lib/appearance/balance-visibility-storage";
import {
  readStoredGlassBlurLevel,
  readStoredGlassFillTransparency,
  writeStoredGlassBlurLevel,
  writeStoredGlassFillTransparency,
} from "@/lib/appearance/glass-blur-storage";
import {
  readStoredAccentId,
  readStoredThemeMode,
  writeStoredAccentId,
  writeStoredThemeMode,
} from "@/lib/appearance/storage";
import type { AccentColorId, ThemeMode } from "@/types/appearance";
import type { GlassBlurLevelId } from "@/types/glass-blur";

interface AppearanceContextValue {
  themeMode: ThemeMode;
  accentId: AccentColorId;
  glassBlurLevel: GlassBlurLevelId;
  glassFillTransparency: number;
  balanceVisible: boolean;
  resolvedDark: boolean;
  setThemeMode: (mode: ThemeMode) => void;
  setAccentId: (id: AccentColorId) => void;
  setGlassBlurLevel: (levelId: GlassBlurLevelId) => void;
  setGlassFillTransparency: (value: number) => void;
  toggleBalanceVisibility: () => void;
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
  const [themeMode, setThemeModeState] = useState<ThemeMode>(initialThemeMode);
  const [accentId, setAccentIdState] = useState<AccentColorId>(initialAccentId);
  const [glassBlurLevel, setGlassBlurLevelState] = useState<GlassBlurLevelId>(
    DEFAULT_GLASS_BLUR_LEVEL,
  );
  const [glassFillTransparency, setGlassFillTransparencyState] = useState(
    DEFAULT_GLASS_FILL_TRANSPARENCY,
  );
  const [balanceVisible, setBalanceVisibleState] = useState(
    DEFAULT_BALANCE_VISIBLE,
  );
  const [resolvedDark, setResolvedDark] = useState(initialResolvedDark);

  useLayoutEffect(() => {
    const storedThemeMode = readStoredThemeMode();
    const storedAccentId = readStoredAccentId();
    const storedGlassBlurLevel = readStoredGlassBlurLevel();
    const storedGlassFillTransparency = readStoredGlassFillTransparency();
    const storedBalanceVisible = readStoredBalanceVisible();

    setThemeModeState(storedThemeMode);
    setAccentIdState(storedAccentId);
    setGlassBlurLevelState(storedGlassBlurLevel);
    setGlassFillTransparencyState(storedGlassFillTransparency);
    setBalanceVisibleState(storedBalanceVisible);
    writeStoredThemeMode(storedThemeMode);
    writeStoredAccentId(storedAccentId);
    writeStoredGlassBlurLevel(storedGlassBlurLevel);
    writeStoredGlassFillTransparency(storedGlassFillTransparency);
    writeStoredBalanceVisible(storedBalanceVisible);
    applyAppearance({
      themeMode: storedThemeMode,
      accentId: storedAccentId,
    });
    applyGlassAppearance(storedGlassBlurLevel, storedGlassFillTransparency);
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

  useEffect(() => {
    applyGlassAppearance(glassBlurLevel, glassFillTransparency);
  }, [glassBlurLevel, glassFillTransparency]);

  const setThemeMode = useCallback((mode: ThemeMode) => {
    setThemeModeState(mode);
    writeStoredThemeMode(mode);
  }, []);

  const setAccentId = useCallback((id: AccentColorId) => {
    setAccentIdState(id);
    writeStoredAccentId(id);
  }, []);

  const setGlassBlurLevel = useCallback((levelId: GlassBlurLevelId) => {
    setGlassBlurLevelState(levelId);
    writeStoredGlassBlurLevel(levelId);
  }, []);

  const setGlassFillTransparency = useCallback((value: number) => {
    setGlassFillTransparencyState(value);
    writeStoredGlassFillTransparency(value);
  }, []);

  const toggleBalanceVisibility = useCallback(() => {
    setBalanceVisibleState((current) => {
      const next = !current;
      writeStoredBalanceVisible(next);
      return next;
    });
  }, []);

  const value = useMemo<AppearanceContextValue>(
    () => ({
      themeMode,
      accentId,
      glassBlurLevel,
      glassFillTransparency,
      balanceVisible,
      resolvedDark,
      setThemeMode,
      setAccentId,
      setGlassBlurLevel,
      setGlassFillTransparency,
      toggleBalanceVisibility,
    }),
    [
      accentId,
      balanceVisible,
      glassBlurLevel,
      glassFillTransparency,
      resolvedDark,
      setAccentId,
      setGlassBlurLevel,
      setGlassFillTransparency,
      setThemeMode,
      themeMode,
      toggleBalanceVisibility,
    ],
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

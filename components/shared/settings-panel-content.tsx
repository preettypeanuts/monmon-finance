"use client";

import { useEffect, useState } from "react";
import { SettingsPushNotificationSection } from "@/components/notifications/settings-push-notification-section";
import { SettingsAccentPanel } from "@/components/settings/settings-accent-panel";
import { SettingsAppearancePanel } from "@/components/settings/settings-appearance-panel";
import { SettingsCategoriesPanel } from "@/components/settings/settings-categories-panel";
import { SettingsGlassPanel } from "@/components/settings/settings-glass-panel";
import { SettingsIosProfileCard } from "@/components/settings/settings-ios-profile-card";
import { SettingsIosRow } from "@/components/settings/settings-ios-row";
import { SettingsIosSection } from "@/components/settings/settings-ios-section";
import { SettingsNestedDrawer } from "@/components/settings/settings-nested-drawer";
import { SettingsSignOutRow } from "@/components/settings/settings-sign-out-row";
import { SettingsWallpaperPanel } from "@/components/settings/settings-wallpaper-panel";
import { useAppearance } from "@/components/shared/appearance-provider";
import { useWallpaper } from "@/components/shared/wallpaper-provider";
import { ACCENT_COLORS } from "@/config/accent-colors";
import { GLASS_BLUR_LEVELS } from "@/config/glass-blur";
import {
  SETTINGS_IOS_DRAWER_LARGE_TITLE,
  SETTINGS_IOS_ICON_ACCENT,
  SETTINGS_IOS_ICON_CATEGORIES,
  SETTINGS_IOS_ICON_GLASS,
  SETTINGS_IOS_ICON_THEME,
  SETTINGS_IOS_ICON_WALLPAPER,
  SETTINGS_IOS_LARGE_TITLE,
  SETTINGS_IOS_SCROLL,
} from "@/config/settings-ios";
import {
  SETTINGS_ACCENT_COLOR,
  SETTINGS_ACCOUNT,
  SETTINGS_APPEARANCE,
  SETTINGS_CATEGORIES,
  SETTINGS_CATEGORIES_FOOTER,
  SETTINGS_DISPLAY_MODE,
  SETTINGS_FINANCE,
  SETTINGS_GLASS_BLUR,
  SETTINGS_TITLE,
  SETTINGS_WALLPAPER,
  SETTINGS_WALLPAPER_FOOTER,
} from "@/config/settings-labels";
import { THEME_MODES } from "@/config/theme-modes";
import {
  DesktopIcon,
  HeartIcon,
  SparkleIcon,
  SquaresFourIcon,
  TagIcon,
} from "@/lib/icons";
import { cn } from "@/lib/utils";
import { resolveActiveWallpaper } from "@/lib/wallpaper/resolve-wallpaper";

type SettingsPanel =
  | "root"
  | "appearance"
  | "accent"
  | "glass"
  | "wallpaper"
  | "categories";

interface SettingsPanelContentProps {
  open: boolean;
  mobileDrawer?: boolean;
  /** Root settings nested inside nav drawer — parent supplies back header + title. */
  nestedRoot?: boolean;
}

export function SettingsPanelContent({
  open,
  mobileDrawer = false,
  nestedRoot = false,
}: SettingsPanelContentProps) {
  const [panel, setPanel] = useState<SettingsPanel>("root");
  const { themeMode, accentId, glassBlurLevel } = useAppearance();
  const { wallpaperId, customWallpaperSlots } = useWallpaper();

  useEffect(() => {
    if (!open) {
      setPanel("root");
    }
  }, [open]);

  const themeLabel =
    THEME_MODES.find((mode) => mode.id === themeMode)?.label ?? "System";
  const accentLabel =
    ACCENT_COLORS.find((accent) => accent.id === accentId)?.label ?? "Blue";
  const glassLabel =
    GLASS_BLUR_LEVELS.find((level) => level.id === glassBlurLevel)?.label ??
    "Normal";
  const wallpaperLabel = resolveActiveWallpaper(
    wallpaperId,
    customWallpaperSlots,
  ).label;

  if (!mobileDrawer) {
    if (panel === "appearance") {
      return <SettingsAppearancePanel onBack={() => setPanel("root")} />;
    }

    if (panel === "accent") {
      return <SettingsAccentPanel onBack={() => setPanel("root")} />;
    }

    if (panel === "glass") {
      return <SettingsGlassPanel onBack={() => setPanel("root")} />;
    }

    if (panel === "wallpaper") {
      return <SettingsWallpaperPanel onBack={() => setPanel("root")} />;
    }

    if (panel === "categories") {
      return <SettingsCategoriesPanel onBack={() => setPanel("root")} />;
    }
  }

  return (
    <section
      className={cn(
        SETTINGS_IOS_SCROLL,
        nestedRoot ? "pt-4" : mobileDrawer && "pt-1",
      )}
    >
      {!nestedRoot ? (
        <h2
          className={
            mobileDrawer
              ? SETTINGS_IOS_DRAWER_LARGE_TITLE
              : SETTINGS_IOS_LARGE_TITLE
          }
        >
          {SETTINGS_TITLE}
        </h2>
      ) : null}

      <div className="shrink-0">
        <SettingsIosProfileCard />
      </div>

      <SettingsPushNotificationSection />

      <SettingsIosSection
        label={SETTINGS_FINANCE}
        footer={SETTINGS_CATEGORIES_FOOTER}
      >
        {mobileDrawer ? (
          <SettingsNestedDrawer
            title={SETTINGS_CATEGORIES}
            trigger={
              <SettingsIosRow
                icon={<TagIcon aria-hidden />}
                iconClassName={SETTINGS_IOS_ICON_CATEGORIES}
                label={SETTINGS_CATEGORIES}
              />
            }
          >
            <SettingsCategoriesPanel nested />
          </SettingsNestedDrawer>
        ) : (
          <SettingsIosRow
            icon={<TagIcon aria-hidden />}
            iconClassName={SETTINGS_IOS_ICON_CATEGORIES}
            label={SETTINGS_CATEGORIES}
            onClick={() => setPanel("categories")}
          />
        )}
      </SettingsIosSection>

      <SettingsIosSection label={SETTINGS_APPEARANCE}>
        {mobileDrawer ? (
          <>
            <SettingsNestedDrawer
              title={SETTINGS_DISPLAY_MODE}
              trigger={
                <SettingsIosRow
                  icon={<DesktopIcon aria-hidden />}
                  iconClassName={SETTINGS_IOS_ICON_THEME}
                  label={SETTINGS_DISPLAY_MODE}
                  value={themeLabel}
                />
              }
            >
              <SettingsAppearancePanel nested />
            </SettingsNestedDrawer>
            <SettingsNestedDrawer
              title={SETTINGS_ACCENT_COLOR}
              trigger={
                <SettingsIosRow
                  icon={<HeartIcon aria-hidden />}
                  iconClassName={SETTINGS_IOS_ICON_ACCENT}
                  label={SETTINGS_ACCENT_COLOR}
                  value={accentLabel}
                />
              }
            >
              <SettingsAccentPanel nested />
            </SettingsNestedDrawer>
            <SettingsNestedDrawer
              title={SETTINGS_GLASS_BLUR}
              trigger={
                <SettingsIosRow
                  icon={<SparkleIcon aria-hidden />}
                  iconClassName={SETTINGS_IOS_ICON_GLASS}
                  label={SETTINGS_GLASS_BLUR}
                  value={glassLabel}
                />
              }
            >
              <SettingsGlassPanel nested />
            </SettingsNestedDrawer>
          </>
        ) : (
          <>
            <SettingsIosRow
              icon={<DesktopIcon aria-hidden />}
              iconClassName={SETTINGS_IOS_ICON_THEME}
              label={SETTINGS_DISPLAY_MODE}
              value={themeLabel}
              onClick={() => setPanel("appearance")}
            />
            <SettingsIosRow
              icon={<HeartIcon aria-hidden />}
              iconClassName={SETTINGS_IOS_ICON_ACCENT}
              label={SETTINGS_ACCENT_COLOR}
              value={accentLabel}
              onClick={() => setPanel("accent")}
            />
            <SettingsIosRow
              icon={<SparkleIcon aria-hidden />}
              iconClassName={SETTINGS_IOS_ICON_GLASS}
              label={SETTINGS_GLASS_BLUR}
              value={glassLabel}
              onClick={() => setPanel("glass")}
            />
          </>
        )}
      </SettingsIosSection>

      <SettingsIosSection
        label={SETTINGS_WALLPAPER}
        footer={SETTINGS_WALLPAPER_FOOTER}
      >
        {mobileDrawer ? (
          <SettingsNestedDrawer
            title={SETTINGS_WALLPAPER}
            trigger={
              <SettingsIosRow
                icon={<SquaresFourIcon aria-hidden />}
                iconClassName={SETTINGS_IOS_ICON_WALLPAPER}
                label={SETTINGS_WALLPAPER}
                value={wallpaperLabel}
              />
            }
          >
            <SettingsWallpaperPanel nested />
          </SettingsNestedDrawer>
        ) : (
          <SettingsIosRow
            icon={<SquaresFourIcon aria-hidden />}
            iconClassName={SETTINGS_IOS_ICON_WALLPAPER}
            label={SETTINGS_WALLPAPER}
            value={wallpaperLabel}
            onClick={() => setPanel("wallpaper")}
          />
        )}
      </SettingsIosSection>

      <SettingsIosSection label={SETTINGS_ACCOUNT}>
        <SettingsSignOutRow />
      </SettingsIosSection>
    </section>
  );
}

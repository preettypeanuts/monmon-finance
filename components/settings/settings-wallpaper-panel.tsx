import { SettingsIosSection } from "@/components/settings/settings-ios-section";
import { SettingsSubHeader } from "@/components/settings/settings-sub-header";
import { WallpaperPicker } from "@/components/shared/wallpaper-picker";
import { SETTINGS_IOS_SUB_SCROLL } from "@/config/settings-ios";
import {
  SETTINGS_WALLPAPER,
  SETTINGS_WALLPAPER_FOOTER,
} from "@/config/settings-labels";

interface SettingsWallpaperPanelProps {
  onBack?: () => void;
  nested?: boolean;
}

export function SettingsWallpaperPanel({
  onBack,
  nested = false,
}: SettingsWallpaperPanelProps) {
  return (
    <>
      {!nested && onBack ? (
        <SettingsSubHeader title={SETTINGS_WALLPAPER} onBack={onBack} />
      ) : null}
      <section className={SETTINGS_IOS_SUB_SCROLL}>
        <SettingsIosSection footer={SETTINGS_WALLPAPER_FOOTER}>
          <WallpaperPicker />
        </SettingsIosSection>
      </section>
    </>
  );
}

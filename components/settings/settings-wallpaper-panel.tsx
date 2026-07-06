import { WallpaperPicker } from "@/components/shared/wallpaper-picker";
import { SettingsIosSection } from "@/components/settings/settings-ios-section";
import { SettingsSubHeader } from "@/components/settings/settings-sub-header";
import { SETTINGS_IOS_SCROLL } from "@/config/settings-ios";

interface SettingsWallpaperPanelProps {
  onBack: () => void;
}

export function SettingsWallpaperPanel({ onBack }: SettingsWallpaperPanelProps) {
  return (
    <>
      <SettingsSubHeader title="Wallpaper" onBack={onBack} />
      <section className={SETTINGS_IOS_SCROLL}>
        <SettingsIosSection footer="Preset bawaan atau foto sendiri. Atur mask jika teks sulit dibaca.">
          <WallpaperPicker />
        </SettingsIosSection>
      </section>
    </>
  );
}

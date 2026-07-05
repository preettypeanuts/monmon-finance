import { AccentColorPicker } from "@/components/shared/accent-color-picker";
import { GlassBlurPicker } from "@/components/shared/glass-blur-picker";
import { SettingsSection } from "@/components/shared/settings-section";
import { ThemeModePicker } from "@/components/shared/theme-mode-picker";
import { WallpaperGrid } from "@/components/shared/wallpaper-grid";
import { WallpaperMaskSlider } from "@/components/shared/wallpaper-mask-slider";
import { WallpaperUpload } from "@/components/shared/wallpaper-upload";
import { WallpaperUrlImport } from "@/components/shared/wallpaper-url-import";
import {
  SETTINGS_INSET_BLOCK,
  SETTINGS_ROW_DIVIDER,
  SETTINGS_SCROLL,
} from "@/config/settings-layout";
import { cn } from "@/lib/utils";

export function SettingsPanelContent() {
  return (
    <section className={SETTINGS_SCROLL}>
      <SettingsSection
        label="Tampilan"
        footer="Terang, gelap, atau ikuti preferensi sistem perangkat."
      >
        <ThemeModePicker />
      </SettingsSection>

      <SettingsSection
        label="Warna aksen"
        footer="Mengatur warna tombol dan highlight di seluruh aplikasi."
      >
        <AccentColorPicker />
      </SettingsSection>

      <SettingsSection
        label="Blur glass"
        footer="Atur blur dan transparansi panel glass — berlaku di semua level blur."
      >
        <GlassBlurPicker />
      </SettingsSection>

      <SettingsSection
        label="Wallpaper"
        footer="Preset bawaan atau foto sendiri. Atur mask jika teks sulit dibaca."
      >
        <WallpaperUpload />
        <WallpaperUrlImport />
        <WallpaperMaskSlider />
        <div
          className={cn(SETTINGS_INSET_BLOCK, SETTINGS_ROW_DIVIDER, "border-t")}
        >
          <WallpaperGrid />
        </div>
      </SettingsSection>
    </section>
  );
}

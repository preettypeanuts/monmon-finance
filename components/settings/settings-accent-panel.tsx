import { AccentColorPicker } from "@/components/shared/accent-color-picker";
import { SettingsIosSection } from "@/components/settings/settings-ios-section";
import { SettingsSubHeader } from "@/components/settings/settings-sub-header";
import { SETTINGS_IOS_SCROLL } from "@/config/settings-ios";

interface SettingsAccentPanelProps {
  onBack: () => void;
}

export function SettingsAccentPanel({ onBack }: SettingsAccentPanelProps) {
  return (
    <>
      <SettingsSubHeader title="Warna aksen" onBack={onBack} />
      <section className={SETTINGS_IOS_SCROLL}>
        <SettingsIosSection footer="Mengatur warna tombol dan highlight di seluruh aplikasi.">
          <AccentColorPicker />
        </SettingsIosSection>
      </section>
    </>
  );
}

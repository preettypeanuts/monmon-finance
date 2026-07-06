import { ThemeModePicker } from "@/components/shared/theme-mode-picker";
import { SettingsIosSection } from "@/components/settings/settings-ios-section";
import { SettingsSubHeader } from "@/components/settings/settings-sub-header";
import { SETTINGS_IOS_SCROLL } from "@/config/settings-ios";

interface SettingsAppearancePanelProps {
  onBack: () => void;
}

export function SettingsAppearancePanel({ onBack }: SettingsAppearancePanelProps) {
  return (
    <>
      <SettingsSubHeader title="Mode tampilan" onBack={onBack} />
      <section className={SETTINGS_IOS_SCROLL}>
        <SettingsIosSection footer="Terang, gelap, atau ikuti preferensi sistem perangkat.">
          <ThemeModePicker />
        </SettingsIosSection>
      </section>
    </>
  );
}

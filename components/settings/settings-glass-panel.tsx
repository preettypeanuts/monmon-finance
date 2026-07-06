import { GlassBlurPicker } from "@/components/shared/glass-blur-picker";
import { SettingsIosSection } from "@/components/settings/settings-ios-section";
import { SettingsSubHeader } from "@/components/settings/settings-sub-header";
import { SETTINGS_IOS_SCROLL } from "@/config/settings-ios";

interface SettingsGlassPanelProps {
  onBack: () => void;
}

export function SettingsGlassPanel({ onBack }: SettingsGlassPanelProps) {
  return (
    <>
      <SettingsSubHeader title="Blur glass" onBack={onBack} />
      <section className={SETTINGS_IOS_SCROLL}>
        <SettingsIosSection footer="Atur blur dan transparansi panel glass di seluruh aplikasi.">
          <GlassBlurPicker />
        </SettingsIosSection>
      </section>
    </>
  );
}

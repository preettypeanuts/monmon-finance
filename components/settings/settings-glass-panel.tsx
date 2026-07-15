import { SettingsIosSection } from "@/components/settings/settings-ios-section";
import { SettingsSubHeader } from "@/components/settings/settings-sub-header";
import { GlassBlurPicker } from "@/components/shared/glass-blur-picker";
import { SETTINGS_IOS_SUB_SCROLL } from "@/config/settings-ios";
import {
  SETTINGS_GLASS_BLUR,
  SETTINGS_GLASS_BLUR_FOOTER,
} from "@/config/settings-labels";

interface SettingsGlassPanelProps {
  onBack?: () => void;
  nested?: boolean;
}

export function SettingsGlassPanel({
  onBack,
  nested = false,
}: SettingsGlassPanelProps) {
  return (
    <>
      {!nested && onBack ? (
        <SettingsSubHeader title={SETTINGS_GLASS_BLUR} onBack={onBack} />
      ) : null}
      <section className={SETTINGS_IOS_SUB_SCROLL}>
        <SettingsIosSection footer={SETTINGS_GLASS_BLUR_FOOTER}>
          <GlassBlurPicker />
        </SettingsIosSection>
      </section>
    </>
  );
}

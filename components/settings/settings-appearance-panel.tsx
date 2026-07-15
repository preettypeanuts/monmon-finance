import { SettingsIosSection } from "@/components/settings/settings-ios-section";
import { SettingsSubHeader } from "@/components/settings/settings-sub-header";
import { ThemeModePicker } from "@/components/shared/theme-mode-picker";
import { SETTINGS_IOS_SUB_SCROLL } from "@/config/settings-ios";
import {
  SETTINGS_DISPLAY_MODE,
  SETTINGS_DISPLAY_MODE_FOOTER,
} from "@/config/settings-labels";

interface SettingsAppearancePanelProps {
  onBack?: () => void;
  nested?: boolean;
}

export function SettingsAppearancePanel({
  onBack,
  nested = false,
}: SettingsAppearancePanelProps) {
  return (
    <>
      {!nested && onBack ? (
        <SettingsSubHeader title={SETTINGS_DISPLAY_MODE} onBack={onBack} />
      ) : null}
      <section className={SETTINGS_IOS_SUB_SCROLL}>
        <SettingsIosSection footer={SETTINGS_DISPLAY_MODE_FOOTER}>
          <ThemeModePicker />
        </SettingsIosSection>
      </section>
    </>
  );
}

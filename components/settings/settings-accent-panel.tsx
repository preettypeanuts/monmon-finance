import { SettingsIosSection } from "@/components/settings/settings-ios-section";
import { SettingsSubHeader } from "@/components/settings/settings-sub-header";
import { AccentColorPicker } from "@/components/shared/accent-color-picker";
import { SETTINGS_IOS_SUB_SCROLL } from "@/config/settings-ios";
import {
  SETTINGS_ACCENT_COLOR,
  SETTINGS_ACCENT_COLOR_FOOTER,
} from "@/config/settings-labels";

interface SettingsAccentPanelProps {
  onBack?: () => void;
  nested?: boolean;
}

export function SettingsAccentPanel({
  onBack,
  nested = false,
}: SettingsAccentPanelProps) {
  return (
    <>
      {!nested && onBack ? (
        <SettingsSubHeader title={SETTINGS_ACCENT_COLOR} onBack={onBack} />
      ) : null}
      <section className={SETTINGS_IOS_SUB_SCROLL}>
        <SettingsIosSection footer={SETTINGS_ACCENT_COLOR_FOOTER}>
          <AccentColorPicker />
        </SettingsIosSection>
      </section>
    </>
  );
}

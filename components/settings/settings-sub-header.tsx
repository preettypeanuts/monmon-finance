import { SettingsMobileBack } from "@/components/settings/settings-mobile-back";
import { SETTINGS_IOS_SUB_HEADER, SETTINGS_IOS_SUB_TITLE } from "@/config/settings-ios";

interface SettingsSubHeaderProps {
  title: string;
  onBack: () => void;
}

export function SettingsSubHeader({ title, onBack }: SettingsSubHeaderProps) {
  return (
    <header className={SETTINGS_IOS_SUB_HEADER}>
      <div className="absolute left-3">
        <SettingsMobileBack onBack={onBack} />
      </div>
      <h2 className={SETTINGS_IOS_SUB_TITLE}>{title}</h2>
    </header>
  );
}

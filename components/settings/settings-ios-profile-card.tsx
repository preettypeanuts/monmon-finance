import { APP_NAME, APP_NAME_INITIAL, APP_TAGLINE } from "@/config/app";
import {
  SETTINGS_IOS_GROUP,
  SETTINGS_IOS_PROFILE_NAME,
  SETTINGS_IOS_PROFILE_SUBTITLE,
  SETTINGS_IOS_ROW,
} from "@/config/settings-ios";

export function SettingsIosProfileCard() {
  return (
    <div className={SETTINGS_IOS_GROUP}>
      <div className={SETTINGS_IOS_ROW}>
        <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-linear-to-b from-[#7C8CFF] via-[#5B6CFF] to-[#3B4FE0] text-lg font-semibold text-white shadow-sm">
          {APP_NAME_INITIAL}
        </span>
        <div className="min-w-0 flex-1">
          <p className={SETTINGS_IOS_PROFILE_NAME}>{APP_NAME}</p>
          <p className={SETTINGS_IOS_PROFILE_SUBTITLE}>{APP_TAGLINE}</p>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { SettingsIosRow } from "@/components/settings/settings-ios-row";
import { SETTINGS_IOS_ICON_THEME } from "@/config/settings-ios";
import { signOut } from "@/lib/auth/auth-client";
import { ArrowLeftIcon } from "@/lib/icons";

export function SettingsSignOutRow() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleSignOut() {
    if (pending) {
      return;
    }

    setPending(true);

    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/login");
          router.refresh();
        },
      },
    });

    setPending(false);
  }

  return (
    <SettingsIosRow
      icon={<ArrowLeftIcon aria-hidden />}
      iconClassName={SETTINGS_IOS_ICON_THEME}
      label={pending ? "Keluar..." : "Keluar"}
      onClick={handleSignOut}
    />
  );
}

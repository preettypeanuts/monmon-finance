"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { MOBILE_DRAWER_LOGOUT_ROW, MOBILE_DRAWER_TILE } from "@/config/mobile-nav";
import { signOut } from "@/lib/auth/auth-client";
import { ArrowLeftIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";

interface MobileNavDrawerLogoutButtonProps {
  onSignedOut?: () => void;
}

export function MobileNavDrawerLogoutButton({
  onSignedOut,
}: MobileNavDrawerLogoutButtonProps) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleSignOut() {
    if (pending) {
      return;
    }

    setPending(true);
    onSignedOut?.();

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
    <button
      type="button"
      className={cn(MOBILE_DRAWER_LOGOUT_ROW, "w-full")}
      disabled={pending}
      onClick={handleSignOut}
    >
      <span className={cn(MOBILE_DRAWER_TILE, "bg-red-500")}>
        <ArrowLeftIcon aria-hidden="true" />
      </span>
      <span className="flex-1 text-left">{pending ? "Keluar..." : "Logout"}</span>
    </button>
  );
}

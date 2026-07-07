"use client";

import { useRouter } from "next/navigation";

import {
  INBOX_MOBILE_TOP_BAR_ORB,
  INBOX_MOBILE_TOP_BAR_ROOT,
  INBOX_MOBILE_TOP_BAR_ROW,
} from "@/config/inbox-mobile";
import { CaretLeftIcon } from "@/lib/icons";

export function ProfileMobileTopBar() {
  const router = useRouter();

  function handleBack() {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
      return;
    }

    router.push("/");
  }

  return (
    <header className={INBOX_MOBILE_TOP_BAR_ROOT}>
      <div className={INBOX_MOBILE_TOP_BAR_ROW}>
        <button
          type="button"
          aria-label="Kembali"
          className={INBOX_MOBILE_TOP_BAR_ORB}
          onClick={handleBack}
        >
          <CaretLeftIcon aria-hidden="true" />
        </button>

        <span aria-hidden className="flex-1" />

        <span aria-hidden className="size-11 shrink-0" />
      </div>
    </header>
  );
}

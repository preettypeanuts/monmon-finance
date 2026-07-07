"use client";

import { useRouter } from "next/navigation";

import { MOBILE_TOP_BAR_ORB_BUTTON } from "@/config/mobile-chrome";
import { CaretLeftIcon } from "@/lib/icons";

export function MobileTopBarBackButton() {
  const router = useRouter();

  function handleBack() {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
      return;
    }

    router.push("/");
  }

  return (
    <button
      type="button"
      aria-label="Kembali"
      className={MOBILE_TOP_BAR_ORB_BUTTON}
      onClick={handleBack}
    >
      <CaretLeftIcon aria-hidden="true" />
    </button>
  );
}

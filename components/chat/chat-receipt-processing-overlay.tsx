"use client";

import { cn } from "@/lib/utils";

interface ChatReceiptProcessingOverlayProps {
  visible: boolean;
  message?: string;
}

export function ChatReceiptProcessingOverlay({
  visible,
  message = "Membaca struk...",
}: ChatReceiptProcessingOverlayProps) {
  if (!visible) {
    return null;
  }

  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 z-30 flex items-center justify-center",
        "bg-background/40 backdrop-blur-[1px]",
      )}
      aria-live="polite"
      aria-busy="true"
    >
      <div className="rounded-2xl border border-black/8 bg-background/90 px-4 py-3 text-sm font-medium shadow-md dark:border-white/10">
        {message}
      </div>
    </div>
  );
}

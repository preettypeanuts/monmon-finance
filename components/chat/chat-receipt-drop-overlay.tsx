"use client";

import { ReceiptIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";

interface ChatReceiptDropOverlayProps {
  visible: boolean;
}

export function ChatReceiptDropOverlay({
  visible,
}: ChatReceiptDropOverlayProps) {
  if (!visible) {
    return null;
  }

  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 z-30 flex items-center justify-center",
        "bg-primary/10 backdrop-blur-[2px]",
      )}
      aria-hidden
    >
      <div className="mx-6 flex max-w-sm flex-col items-center gap-3 rounded-3xl border border-primary/30 bg-background/85 px-6 py-8 text-center shadow-lg">
        <span className="flex size-14 items-center justify-center rounded-2xl bg-primary/12 text-primary">
          <ReceiptIcon className="size-7" />
        </span>
        <div className="space-y-1">
          <p className="text-sm font-semibold">Lepaskan struk di sini</p>
          <p className="text-xs text-muted-foreground">
            JPG, PNG, atau WebP — AI akan baca nominal sebelum dicatat.
          </p>
        </div>
      </div>
    </div>
  );
}

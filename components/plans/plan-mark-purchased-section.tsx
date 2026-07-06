"use client";

import { Button } from "@/components/ui/button";
import { PLAN_MARK_PURCHASED_SHELL } from "@/config/plans";
import { SEPARATED_CONTROL } from "@/config/shape";
import { formatIdr } from "@/lib/finance/format-currency";
import { CheckCircleIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";

interface PlanMarkPurchasedSectionProps {
  amount: number;
  disabled?: boolean;
  onMarkPurchased: () => void;
  className?: string;
}

export function PlanMarkPurchasedSection({
  amount,
  disabled = false,
  onMarkPurchased,
  className,
}: PlanMarkPurchasedSectionProps) {
  return (
    <section className={cn(PLAN_MARK_PURCHASED_SHELL, className)}>
      <p className="text-[11px] leading-relaxed text-muted-foreground">
        Tandai sudah dibeli akan mencatat pengeluaran{" "}
        <span className="font-semibold text-foreground/90">
          {formatIdr(amount)}
        </span>{" "}
        ke Journal dan mengurangi saldo.
      </p>
      <Button
        type="button"
        disabled={disabled}
        className={cn(SEPARATED_CONTROL, "mt-3 w-full")}
        onClick={onMarkPurchased}
      >
        <CheckCircleIcon aria-hidden className="size-4" />
        Sudah dibeli
      </Button>
    </section>
  );
}

"use client";

import { AppleCheckbox } from "@/components/shared/apple-checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FORM_FIELD_INPUT, FORM_GROUP_DIVIDER } from "@/config/form-dialog";
import { cn } from "@/lib/utils";

interface PlannedItemPriorPaymentFieldsProps {
  isNewFromStart: boolean;
  paidPriorCount: string;
  maxInstallments: number | null;
  onIsNewFromStartChange: (value: boolean) => void;
  onPaidPriorCountChange: (value: string) => void;
}

export function PlannedItemPriorPaymentFields({
  isNewFromStart,
  paidPriorCount,
  maxInstallments,
  onIsNewFromStartChange,
  onPaidPriorCountChange,
}: PlannedItemPriorPaymentFieldsProps) {
  const paidCount = Number.parseInt(paidPriorCount, 10);
  const paidValid = Number.isFinite(paidCount) && paidCount >= 0;
  const remaining =
    maxInstallments !== null && paidValid
      ? Math.max(maxInstallments - paidCount, 0)
      : null;

  return (
    <div>
      <div className="px-4 py-3">
        <label className="flex cursor-pointer items-start gap-3">
          <AppleCheckbox
            checked={isNewFromStart}
            onCheckedChange={onIsNewFromStartChange}
          />
          <span className="min-w-0 text-sm leading-snug">
            <span className="font-medium text-foreground">
              Cicilan baru dari tanggal mulai
            </span>
            <span className="mt-0.5 block text-xs text-muted-foreground">
              Centang jika baru mulai cicilan. Lepas centang jika sudah berjalan
              sebelum pakai app.
            </span>
          </span>
        </label>
      </div>

      {!isNewFromStart ? (
        <>
          <div className={FORM_GROUP_DIVIDER} />
          <div className="space-y-3 px-4 pb-3 pt-3">
            <div className="space-y-1.5">
              <Label
                htmlFor="planned-paid-prior"
                className="text-xs font-medium text-muted-foreground"
              >
                Sudah dibayar (kali)
              </Label>
              <Input
                id="planned-paid-prior"
                name="paidInstallmentCount"
                type="number"
                min={0}
                inputMode="numeric"
                value={paidPriorCount}
                onChange={(event) => onPaidPriorCountChange(event.target.value)}
                placeholder="4"
                required
                className={cn(FORM_FIELD_INPUT, "tabular-nums")}
              />
              <p className="text-[11px] text-muted-foreground">
                Misal mulai Februari, sekarang Juni — isi berapa kali sudah
                dibayar sebelum tracking di app.
              </p>
            </div>

            {remaining !== null && maxInstallments !== null ? (
              <p className="text-xs text-muted-foreground">
                <span className="font-medium text-foreground">
                  {paidValid ? paidCount : "—"}
                </span>
                {" / "}
                {maxInstallments} dibayar
                {paidValid ? (
                  <>
                    {" · "}
                    <span className="font-medium text-foreground">
                      {remaining}
                    </span>{" "}
                    sisa
                  </>
                ) : null}
              </p>
            ) : null}
          </div>
        </>
      ) : null}
    </div>
  );
}

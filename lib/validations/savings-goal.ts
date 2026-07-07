import { parseAmount } from "@/lib/finance/parse-amount";
import type { SavingsGoalFormInput, SavingsGoalStatus } from "@/types/savings-goal";

const SAVINGS_STATUSES: SavingsGoalStatus[] = ["active", "completed", "paused"];

function readString(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function readAmount(raw: string): number | null {
  return (
    parseAmount(raw) ??
    (Number.parseInt(raw.replace(/\D/g, ""), 10) || null)
  );
}

export function parseSavingsGoalFormData(
  formData: FormData,
): { ok: true; data: SavingsGoalFormInput } | { ok: false; error: string } {
  const name = readString(formData, "name");
  const targetRaw = readString(formData, "targetAmount");
  const savedRaw = readString(formData, "savedAmount");
  const statusRaw = readString(formData, "status") || "active";
  const note = readString(formData, "note");

  if (!name) {
    return { ok: false, error: "Nama tabungan wajib diisi." };
  }

  const targetAmount = readAmount(targetRaw);
  if (targetAmount === null || targetAmount <= 0) {
    return { ok: false, error: "Target tabungan tidak valid." };
  }

  const savedAmount = savedRaw ? readAmount(savedRaw) : 0;
  if (savedAmount === null || savedAmount < 0) {
    return { ok: false, error: "Nominal terkumpul tidak valid." };
  }

  if (savedAmount > targetAmount) {
    return { ok: false, error: "Terkumpul tidak boleh melebihi target." };
  }

  if (!SAVINGS_STATUSES.includes(statusRaw as SavingsGoalStatus)) {
    return { ok: false, error: "Status tabungan tidak valid." };
  }

  return {
    ok: true,
    data: {
      name,
      targetAmount,
      savedAmount: savedAmount ?? 0,
      status: statusRaw as SavingsGoalStatus,
      note: note || undefined,
    },
  };
}

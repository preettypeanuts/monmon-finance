import { parseAmount } from "@/lib/finance/parse-amount";
import type { PlanFormInput, PlanStatus } from "@/types/plan";

const PLAN_STATUSES: PlanStatus[] = ["active", "done"];

function readString(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export function parsePlanFormData(
  formData: FormData,
): { ok: true; data: PlanFormInput } | { ok: false; error: string } {
  const name = readString(formData, "name");
  const amountRaw = readString(formData, "amount");
  const category = readString(formData, "category") || "shopping";
  const statusRaw = readString(formData, "status") || "active";
  const note = readString(formData, "note");

  if (!name) {
    return { ok: false, error: "Nama plan wajib diisi." };
  }

  const amount =
    parseAmount(amountRaw) ??
    (Number.parseInt(amountRaw.replace(/\D/g, ""), 10) || null);

  if (amount === null || amount <= 0) {
    return { ok: false, error: "Nominal tidak valid." };
  }

  if (!PLAN_STATUSES.includes(statusRaw as PlanStatus)) {
    return { ok: false, error: "Status plan tidak valid." };
  }

  return {
    ok: true,
    data: {
      name,
      amount,
      category,
      status: statusRaw as PlanStatus,
      note: note || undefined,
    },
  };
}

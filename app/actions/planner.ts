"use server";

import { revalidatePath } from "next/cache";

import { requireUserId } from "@/lib/auth/session";
import {
  createPlannedItem,
  deletePlannedItem,
  markInstallmentPaid,
  updatePlannedItem,
} from "@/lib/db/planned-items";
import { parsePlannedItemFormData } from "@/lib/validations/planned-item";
import type { PlannedItemRecord } from "@/types/planner";

interface PlannedItemActionSuccess {
  ok: true;
  item: PlannedItemRecord;
}

interface PlannedItemActionFailure {
  ok: false;
  error: string;
}

export type PlannedItemActionResult =
  | PlannedItemActionSuccess
  | PlannedItemActionFailure;

function revalidatePayPlan() {
  revalidatePath("/payplan");
}

export async function savePlannedItemAction(
  formData: FormData,
): Promise<PlannedItemActionResult> {
  const userId = await requireUserId();
  const parsed = parsePlannedItemFormData(formData);

  if (!parsed.ok) {
    return parsed;
  }

  const id = formData.get("id");
  const item =
    typeof id === "string" && id.trim()
      ? await updatePlannedItem(userId, id.trim(), parsed.data)
      : await createPlannedItem(userId, parsed.data);

  revalidatePayPlan();

  return { ok: true, item };
}

export async function markInstallmentPaidAction(
  plannedItemId: string,
  installmentIndex: number,
): Promise<
  { ok: true; paidCount: number } | PlannedItemActionFailure
> {
  const userId = await requireUserId();
  const trimmed = plannedItemId.trim();

  if (!trimmed || !Number.isInteger(installmentIndex) || installmentIndex < 0) {
    return { ok: false, error: "Data cicilan tidak valid." };
  }

  try {
    const item = await markInstallmentPaid(userId, trimmed, installmentIndex);
    revalidatePayPlan();
    return { ok: true, paidCount: item.paidInstallmentCount };
  } catch {
    return { ok: false, error: "Gagal menandai cicilan." };
  }
}

export async function deletePlannedItemAction(
  id: string,
): Promise<{ ok: true } | PlannedItemActionFailure> {
  const userId = await requireUserId();
  const trimmed = id.trim();

  if (!trimmed) {
    return { ok: false, error: "Item tidak ditemukan." };
  }

  try {
    await deletePlannedItem(userId, trimmed);
    revalidatePayPlan();
    return { ok: true };
  } catch {
    return { ok: false, error: "Gagal menghapus item." };
  }
}

"use server";

import { revalidatePath } from "next/cache";

import {
  createPlan,
  deletePlan,
  updatePlan,
} from "@/lib/db/plans";
import { parsePlanFormData } from "@/lib/validations/plan";
import type { PlanRecord } from "@/types/plan";

interface PlanActionSuccess {
  ok: true;
  plan: PlanRecord;
}

interface PlanActionFailure {
  ok: false;
  error: string;
}

export type PlanActionResult = PlanActionSuccess | PlanActionFailure;

function revalidatePlans() {
  revalidatePath("/plans");
}

export async function savePlanAction(
  formData: FormData,
): Promise<PlanActionResult> {
  const parsed = parsePlanFormData(formData);

  if (!parsed.ok) {
    return parsed;
  }

  const id = formData.get("id");
  const plan =
    typeof id === "string" && id.trim()
      ? await updatePlan(id.trim(), parsed.data)
      : await createPlan(parsed.data);

  revalidatePlans();

  return { ok: true, plan };
}

export async function deletePlanAction(
  id: string,
): Promise<{ ok: true } | PlanActionFailure> {
  const trimmed = id.trim();

  if (!trimmed) {
    return { ok: false, error: "Plan tidak ditemukan." };
  }

  try {
    await deletePlan(trimmed);
    revalidatePlans();
    return { ok: true };
  } catch {
    return { ok: false, error: "Gagal menghapus plan." };
  }
}

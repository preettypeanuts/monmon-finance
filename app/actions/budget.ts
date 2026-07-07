"use server";

import { revalidatePath } from "next/cache";

import { requireUserId } from "@/lib/auth/session";
import {
  createCategoryBudget,
  deleteCategoryBudget,
  updateCategoryBudget,
} from "@/lib/db/budgets";
import { parseCategoryBudgetFormData } from "@/lib/validations/budget";
import type { CategoryBudgetRecord } from "@/types/budget";

interface BudgetActionSuccess {
  ok: true;
  budget: CategoryBudgetRecord;
}

interface BudgetActionFailure {
  ok: false;
  error: string;
}

export type BudgetActionResult = BudgetActionSuccess | BudgetActionFailure;

function revalidateBudgetPaths() {
  revalidatePath("/payplan");
  revalidatePath("/");
}

export async function saveCategoryBudgetAction(
  formData: FormData,
): Promise<BudgetActionResult> {
  const userId = await requireUserId();
  const parsed = parseCategoryBudgetFormData(formData);

  if (!parsed.ok) {
    return parsed;
  }

  const id = formData.get("id");
  const budget =
    typeof id === "string" && id.trim()
      ? await updateCategoryBudget(userId, id.trim(), parsed.data)
      : await createCategoryBudget(userId, parsed.data);

  revalidateBudgetPaths();

  return { ok: true, budget };
}

export async function deleteCategoryBudgetAction(
  id: string,
): Promise<{ ok: true } | BudgetActionFailure> {
  const userId = await requireUserId();
  const trimmed = id.trim();

  if (!trimmed) {
    return { ok: false, error: "Budget tidak ditemukan." };
  }

  await deleteCategoryBudget(userId, trimmed);
  revalidateBudgetPaths();

  return { ok: true };
}

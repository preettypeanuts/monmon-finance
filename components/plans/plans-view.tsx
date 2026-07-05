"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import {
  deletePlanAction,
  savePlanAction,
} from "@/app/actions/plans";
import { PlanCard } from "@/components/plans/plan-card";
import { PlanDetailDialog } from "@/components/plans/plan-detail-dialog";
import { PlansRelatedUpcoming } from "@/components/plans/plans-related-upcoming";
import { PlansAiSummary } from "@/components/plans/plans-ai-summary";
import { PlansSummaryWidgets } from "@/components/plans/plans-summary-widgets";
import { Button } from "@/components/ui/button";
import { PLANS_CARD_LIST, PLANS_WIDGET_TILE } from "@/config/plans";
import { SEPARATED_CONTROL } from "@/config/shape";
import { STACK_GAP } from "@/config/spacing";
import {
  buildFallbackPlansInsight,
  resolvePlansInsightMeta,
} from "@/lib/finance/build-plans-overview";
import { PlusIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";
import type { PlanRecord, PlansOverview, PlansUpcomingImpactItem } from "@/types/plan";

type DialogMode = "view" | "edit" | "create";

interface PlansViewProps {
  plans: PlanRecord[];
  overview: PlansOverview;
  upcomingImpact: PlansUpcomingImpactItem[];
}

function sortPlans(plans: PlanRecord[]): PlanRecord[] {
  return [...plans].sort((a, b) => {
    if (a.status !== b.status) {
      return a.status === "active" ? -1 : 1;
    }

    return b.updatedAt.localeCompare(a.updatedAt);
  });
}

function buildLocalOverview(
  plans: PlanRecord[],
  availableBalance: number,
): PlansOverview {
  const activePlans = plans.filter((plan) => plan.status === "active");
  const estimatedCost = activePlans.reduce((sum, plan) => sum + plan.amount, 0);

  return {
    activeCount: activePlans.length,
    estimatedCost,
    availableBalance,
    remainingBalance: availableBalance - estimatedCost,
    insight: buildFallbackPlansInsight(estimatedCost, availableBalance),
    insightMeta: resolvePlansInsightMeta(estimatedCost, availableBalance),
  };
}

export function PlansView({ plans, overview, upcomingImpact }: PlansViewProps) {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<DialogMode>("view");
  const [selectedPlan, setSelectedPlan] = useState<PlanRecord | null>(null);
  const [items, setItems] = useState(plans);
  const [summary, setSummary] = useState(overview);

  useEffect(() => {
    setItems(plans);
    setSummary(overview);
  }, [plans, overview]);

  function openCreate() {
    setSelectedPlan(null);
    setDialogMode("create");
    setDialogOpen(true);
  }

  function openDetail(plan: PlanRecord) {
    setSelectedPlan(plan);
    setDialogMode("view");
    setDialogOpen(true);
  }

  async function handleSubmit(formData: FormData) {
    const result = await savePlanAction(formData);

    if (!result.ok) {
      return;
    }

    setItems((current) => {
      const exists = current.some((plan) => plan.id === result.plan.id);
      const next = sortPlans(
        exists
          ? current.map((plan) =>
              plan.id === result.plan.id ? result.plan : plan,
            )
          : [result.plan, ...current],
      );
      setSummary(buildLocalOverview(next, summary.availableBalance));
      return next;
    });

    setDialogOpen(false);
    router.refresh();
  }

  async function handleDelete(plan: PlanRecord) {
    const result = await deletePlanAction(plan.id);

    if (!result.ok) {
      return;
    }

    setItems((current) => {
      const next = current.filter((entry) => entry.id !== plan.id);
      setSummary(buildLocalOverview(next, summary.availableBalance));
      return next;
    });
    setDialogOpen(false);
    router.refresh();
  }

  return (
    <div className={cn("flex flex-col", STACK_GAP)}>
      <PlansSummaryWidgets overview={summary} />
      <PlansAiSummary overview={summary} />

      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold">Plans</h2>
          <p className="text-xs text-muted-foreground">
            Wishlist belanja dan estimasi biaya.
          </p>
        </div>
        <Button
          type="button"
          size="sm"
          className={SEPARATED_CONTROL}
          onClick={openCreate}
        >
          <PlusIcon className="size-4" />
          Tambah
        </Button>
      </div>

      {items.length === 0 ? (
        <div
          className={cn(
            PLANS_WIDGET_TILE,
            "flex flex-col items-center justify-center px-4 py-12 text-center",
          )}
        >
          <p className="text-sm font-medium">Belum ada plan</p>
          <p className="mt-1 max-w-sm text-xs text-muted-foreground">
            Tambahkan barang wishlist untuk menghitung estimasi sisa saldo.
          </p>
          <Button
            type="button"
            size="sm"
            className={cn(SEPARATED_CONTROL, "mt-4")}
            onClick={openCreate}
          >
            <PlusIcon className="size-4" />
            Plan baru
          </Button>
        </div>
      ) : (
        <div className={PLANS_CARD_LIST}>
          {items.map((plan) => (
            <PlanCard key={plan.id} plan={plan} onClick={openDetail} />
          ))}
        </div>
      )}

      <PlansRelatedUpcoming items={upcomingImpact} />

      <PlanDetailDialog
        open={dialogOpen}
        plan={selectedPlan}
        mode={dialogMode}
        onOpenChange={setDialogOpen}
        onModeChange={setDialogMode}
        onSubmit={handleSubmit}
        onDelete={handleDelete}
      />
    </div>
  );
}

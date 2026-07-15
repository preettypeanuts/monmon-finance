"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { JournalCategoryCombobox } from "@/components/journal/journal-category-combobox";
import { JournalWalletPicker } from "@/components/journal/journal-wallet-picker";
import { useUserCategoryCatalog } from "@/components/providers/user-category-catalog-provider";
import { AmountTextInput } from "@/components/shared/amount-text-input";
import { FormDatePicker } from "@/components/shared/form-date-picker";
import { FormDialogField } from "@/components/shared/form-dialog-field";
import {
  ResponsiveDialog,
  ResponsiveDialogBody,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
} from "@/components/shared/responsive-dialog";
import { Button } from "@/components/ui/button";
import { DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { InsufficientWalletBalancePanel } from "@/components/wallets/insufficient-wallet-balance-panel";
import {
  FORM_DIALOG_BODY_SCROLL,
  FORM_FIELD_DATE,
  FORM_FIELD_GRID_ROW,
  FORM_FIELD_INPUT,
  FORM_GROUP,
  FORM_PREVIEW_COMPACT,
  FORM_PREVIEW_COMPACT_AMOUNT,
  FORM_SEGMENT,
  FORM_SEGMENT_ACTIVE,
  FORM_SEGMENT_INACTIVE,
  FORM_SEGMENTED,
} from "@/config/form-dialog";
import { UI_LABEL_WALLET } from "@/config/ui-labels";
import { WALLET_INSUFFICIENT_PROCEED_RECORD } from "@/config/wallet-labels";
import { useIsMobileViewport } from "@/hooks/use-is-mobile-viewport";
import { useProtectedCurrency } from "@/hooks/use-protected-currency";
import {
  buildInsufficientWalletBalanceMessage,
  isInsufficientWalletBalance,
} from "@/lib/finance/compute-wallet-balance";
import { formatIdr } from "@/lib/finance/format-currency";
import { resolveCategoryForTransaction } from "@/lib/finance/user-category-catalog";
import { cn } from "@/lib/utils";
import { toDateInputValue } from "@/lib/validations/planned-item";
import type { ReceiptDraft } from "@/types/receipt";
import type { FlowTransactionType } from "@/types/transaction";

interface ReceiptConfirmDialogProps {
  open: boolean;
  draft: ReceiptDraft | null;
  previewUrl: string | null;
  notice?: string | null;
  mode?: "create" | "edit";
  defaultWalletId?: string | null;
  walletOptions?: Array<{ id: string; name: string; balance?: number }>;
  onOpenChange: (open: boolean) => void;
  onConfirm: (input: {
    type: FlowTransactionType;
    amount: string;
    category: string;
    description: string;
    merchant: string;
    occurredAt: string;
    walletId: string;
  }) => Promise<void>;
}

export function ReceiptConfirmDialog({
  open,
  draft,
  previewUrl,
  notice = null,
  mode = "create",
  defaultWalletId = null,
  walletOptions = [],
  onOpenChange,
  onConfirm,
}: ReceiptConfirmDialogProps) {
  const isMobile = useIsMobileViewport();
  const [isPending, startTransition] = useTransition();
  const [type, setType] = useState<FlowTransactionType>("expense");
  const [amountDraft, setAmountDraft] = useState("");
  const [category, setCategory] = useState<string>("food");
  const [walletId, setWalletId] = useState("");
  const { catalog } = useUserCategoryCatalog();
  const [description, setDescription] = useState("");
  const [merchant, setMerchant] = useState("");
  const [occurredAtText, setOccurredAtText] = useState("");
  const [confirmInsufficient, setConfirmInsufficient] = useState(false);
  const { formatAmount } = useProtectedCurrency();

  useEffect(() => {
    if (!open || !draft) {
      return;
    }

    setType(draft.type);
    setAmountDraft(String(draft.amount));
    setCategory(
      resolveCategoryForTransaction(draft.category, draft.type, catalog),
    );
    setDescription(draft.description);
    setMerchant(draft.merchant);
    setOccurredAtText(toDateInputValue(new Date(draft.occurredAt)));
    setWalletId(defaultWalletId ?? walletOptions[0]?.id ?? "");
    setConfirmInsufficient(false);
  }, [catalog, draft, defaultWalletId, open, walletOptions]);

  const previewAmount = Number.parseInt(amountDraft, 10) || 0;

  const walletPickerOptions = useMemo(
    () => walletOptions.map((option) => ({ id: option.id, name: option.name })),
    [walletOptions],
  );

  const selectedWallet = useMemo(
    () => walletOptions.find((option) => option.id === walletId),
    [walletId, walletOptions],
  );

  const insufficientMessage = useMemo(() => {
    if (
      type !== "expense" ||
      !selectedWallet ||
      selectedWallet.balance === undefined ||
      previewAmount <= 0
    ) {
      return "";
    }

    return buildInsufficientWalletBalanceMessage({
      walletName: selectedWallet.name,
      balanceLabel: formatAmount(selectedWallet.balance),
      amountLabel: formatAmount(previewAmount),
      context: "expense",
    });
  }, [formatAmount, previewAmount, selectedWallet, type]);

  function submitConfirmed() {
    startTransition(async () => {
      const occurredAt = occurredAtText
        ? new Date(`${occurredAtText}T12:00:00`).toISOString()
        : new Date().toISOString();

      await onConfirm({
        type,
        amount: amountDraft,
        category,
        description: description.trim(),
        merchant: merchant.trim(),
        occurredAt,
        walletId,
      });
    });
  }

  function handleConfirm() {
    if (
      type === "expense" &&
      selectedWallet?.balance !== undefined &&
      isInsufficientWalletBalance(selectedWallet.balance, previewAmount)
    ) {
      setConfirmInsufficient(true);
      return;
    }

    submitConfirmed();
  }

  function handleTypeChange(nextType: FlowTransactionType) {
    setConfirmInsufficient(false);
    setType(nextType);
    setCategory((current) =>
      resolveCategoryForTransaction(current, nextType, catalog),
    );
  }

  const isEditMode = mode === "edit";
  const title = notice
    ? "Isi struk manual"
    : isEditMode
      ? "Perbaiki struk"
      : "Konfirmasi struk";
  const dialogDescription = notice
    ? "Lihat preview struk lalu isi nominal dan detail transaksi."
    : isEditMode
      ? "Sesuaikan data struk jika ada yang tidak cocok."
      : "Periksa data dari struk sebelum dicatat ke inbox.";

  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      wide
    >
      <ResponsiveDialogHeader>
        <DialogTitle className="text-lg font-semibold tracking-tight">
          {title}
        </DialogTitle>
        <DialogDescription className="text-[13px] leading-snug">
          {dialogDescription}
        </DialogDescription>
      </ResponsiveDialogHeader>

      {previewUrl ? (
        <div className="shrink-0 border-b border-black/8 px-4 py-3 dark:border-white/10">
          <div className="overflow-hidden rounded-xl border border-black/10 bg-white/20 shadow-sm dark:border-black/15">
            <img
              src={previewUrl}
              alt="Preview struk"
              className="mx-auto block max-h-72 w-full object-contain"
              draggable={false}
            />
          </div>
        </div>
      ) : null}

      <ResponsiveDialogBody className={FORM_DIALOG_BODY_SCROLL}>
        {confirmInsufficient ? (
          <InsufficientWalletBalancePanel
            message={insufficientMessage}
            onBack={() => setConfirmInsufficient(false)}
            onProceed={submitConfirmed}
            isPending={isPending}
            proceedLabel={
              isPending ? "Menyimpan..." : WALLET_INSUFFICIENT_PROCEED_RECORD
            }
          />
        ) : (
          <>
            {notice ? (
              <p className="rounded-xl border border-amber-500/25 bg-amber-500/10 px-3 py-2 text-[13px] leading-snug text-amber-950 dark:text-amber-100">
                {notice}
              </p>
            ) : null}

            <div className={FORM_PREVIEW_COMPACT}>
              <div className="min-w-0">
                <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
                  Total struk
                </p>
                <p className={cn("mt-0.5", FORM_PREVIEW_COMPACT_AMOUNT)}>
                  {formatIdr(previewAmount)}
                </p>
              </div>
              <div className="shrink-0 text-right text-[11px] leading-snug text-muted-foreground">
                <p>{merchant.trim() || "Merchant"}</p>
                <p>{type === "income" ? "Pemasukan" : "Pengeluaran"}</p>
              </div>
            </div>

            <div className={FORM_GROUP}>
              <fieldset className="border-0 px-4 py-3">
                <legend className="sr-only">Jenis transaksi</legend>
                <div className={FORM_SEGMENTED}>
                  <button
                    type="button"
                    aria-pressed={type === "expense"}
                    onClick={() => handleTypeChange("expense")}
                    className={cn(
                      FORM_SEGMENT,
                      type === "expense"
                        ? FORM_SEGMENT_ACTIVE
                        : FORM_SEGMENT_INACTIVE,
                    )}
                  >
                    Keluar
                  </button>
                  <button
                    type="button"
                    aria-pressed={type === "income"}
                    onClick={() => handleTypeChange("income")}
                    className={cn(
                      FORM_SEGMENT,
                      type === "income"
                        ? FORM_SEGMENT_ACTIVE
                        : FORM_SEGMENT_INACTIVE,
                    )}
                  >
                    Masuk
                  </button>
                </div>
              </fieldset>

              <div className={FORM_FIELD_GRID_ROW}>
                <FormDialogField
                  label="Nominal (Rp)"
                  htmlFor="receipt-amount"
                  gridItem
                >
                  <AmountTextInput
                    id="receipt-amount"
                    value={amountDraft}
                    onChange={(event) => setAmountDraft(event.target.value)}
                    className={FORM_FIELD_INPUT}
                    placeholder="0"
                  />
                </FormDialogField>

                <FormDialogField
                  label="Tanggal"
                  htmlFor="receipt-date"
                  gridItem
                >
                  <FormDatePicker
                    backLabel={title}
                    className={FORM_FIELD_DATE}
                    id="receipt-date"
                    name="occurredAt"
                    nestedInDrawer={isMobile}
                    onChange={setOccurredAtText}
                    value={occurredAtText}
                  />
                </FormDialogField>
              </div>

              <FormDialogField label="Merchant" htmlFor="receipt-merchant">
                <Input
                  id="receipt-merchant"
                  value={merchant}
                  onChange={(event) => setMerchant(event.target.value)}
                  className={FORM_FIELD_INPUT}
                  placeholder="Indomaret, Starbucks, Grab..."
                />
              </FormDialogField>

              <FormDialogField label="Deskripsi" htmlFor="receipt-description">
                <Input
                  id="receipt-description"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  className={FORM_FIELD_INPUT}
                  placeholder="Belanja harian, makan siang..."
                />
              </FormDialogField>

              {walletOptions.length > 0 ? (
                <FormDialogField
                  label={UI_LABEL_WALLET}
                  htmlFor="receipt-wallet"
                >
                  <JournalWalletPicker
                    backLabel={title}
                    id="receipt-wallet"
                    nestedInDrawer={isMobile}
                    onChange={setWalletId}
                    options={walletPickerOptions}
                    value={walletId}
                  />
                </FormDialogField>
              ) : null}

              <FormDialogField label="Kategori" htmlFor="receipt-category">
                <JournalCategoryCombobox
                  backLabel={title}
                  id="receipt-category"
                  nestedInDrawer={isMobile}
                  onChange={setCategory}
                  type={type}
                  value={category}
                />
              </FormDialogField>
            </div>
          </>
        )}
      </ResponsiveDialogBody>

      {!confirmInsufficient ? (
        <ResponsiveDialogFooter>
          <Button
            type="button"
            variant="ghost"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Batal
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={
              isPending ||
              !description.trim() ||
              previewAmount <= 0 ||
              !walletId
            }
          >
            {isPending
              ? "Menyimpan..."
              : isEditMode
                ? "Simpan"
                : "Catat ke inbox"}
          </Button>
        </ResponsiveDialogFooter>
      ) : null}
    </ResponsiveDialog>
  );
}

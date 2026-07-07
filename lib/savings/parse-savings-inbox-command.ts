import { parseAmount } from "@/lib/finance/parse-amount";

export type SavingsInboxCommand =
  | { kind: "list" }
  | { kind: "show"; goalQuery: string }
  | { kind: "create"; name: string; targetAmount: number }
  | { kind: "edit"; goalQuery: string; targetAmount: number }
  | { kind: "deposit"; goalQuery: string; amount: number }
  | { kind: "withdraw"; goalQuery: string; amount: number };

function isSavingsIntent(text: string): boolean {
  const lower = text.toLowerCase();
  return (
    lower.includes("tabungan") ||
    /^(setor|tabung|nabung|tarik)\b/.test(lower)
  );
}

function parseCreateCommand(text: string): SavingsInboxCommand | null {
  const match =
    text.match(/^(?:buat|tambah|bikin)\s+tabungan\s+(.+?)\s+(.+)$/i) ??
    text.match(/^tabungan\s+baru\s+(.+?)\s+(.+)$/i);

  if (!match) {
    return null;
  }

  const firstAmount = parseAmount(match[1]);
  const secondAmount = parseAmount(match[2]);

  if (firstAmount && !secondAmount) {
    return {
      kind: "create",
      name: match[2].trim(),
      targetAmount: firstAmount,
    };
  }

  if (secondAmount) {
    return {
      kind: "create",
      name: match[1].trim(),
      targetAmount: secondAmount,
    };
  }

  return null;
}

function parseDepositCommand(text: string): SavingsInboxCommand | null {
  const withKe = text.match(/^(?:setor|tabung|nabung)\s+(.+?)\s+ke\s+(.+)$/i);
  if (withKe) {
    const amount = parseAmount(withKe[1]);
    if (amount) {
      return { kind: "deposit", amount, goalQuery: withKe[2].trim() };
    }
  }

  const short = text.match(/^(?:setor|tabung|nabung)\s+(.+?)\s+(.+)$/i);
  if (!short) {
    return null;
  }

  const firstAmount = parseAmount(short[1]);
  const secondAmount = parseAmount(short[2]);

  if (firstAmount && !secondAmount) {
    return { kind: "deposit", amount: firstAmount, goalQuery: short[2].trim() };
  }

  if (secondAmount && !firstAmount) {
    return { kind: "deposit", amount: secondAmount, goalQuery: short[1].trim() };
  }

  return null;
}

export function parseSavingsInboxCommand(
  text: string,
): SavingsInboxCommand | null {
  const trimmed = text.trim();
  if (!trimmed || !isSavingsIntent(trimmed)) {
    return null;
  }

  const lower = trimmed.toLowerCase();

  if (/^(?:cek|lihat|daftar)?\s*tabungan\s*$/.test(lower)) {
    return { kind: "list" };
  }

  const showMatch = trimmed.match(/^(?:cek|lihat)\s+tabungan\s+(.+)$/i);
  if (showMatch) {
    return { kind: "show", goalQuery: showMatch[1].trim() };
  }

  const createCommand = parseCreateCommand(trimmed);
  if (createCommand) {
    return createCommand;
  }

  const editMatch = trimmed.match(
    /^(?:edit|ubah)\s+tabungan\s+(.+?)\s+(?:target|jadi|menjadi)\s+(.+)$/i,
  );
  if (editMatch) {
    const targetAmount = parseAmount(editMatch[2]);
    if (targetAmount) {
      return {
        kind: "edit",
        goalQuery: editMatch[1].trim(),
        targetAmount,
      };
    }
  }

  const depositCommand = parseDepositCommand(trimmed);
  if (depositCommand) {
    return depositCommand;
  }

  const withdrawMatch = trimmed.match(/^tarik\s+(.+?)\s+dari\s+(.+)$/i);
  if (withdrawMatch) {
    const amount = parseAmount(withdrawMatch[1]);
    if (amount) {
      return {
        kind: "withdraw",
        amount,
        goalQuery: withdrawMatch[2].trim(),
      };
    }
  }

  return null;
}

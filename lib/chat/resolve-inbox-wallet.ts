import {
  ensureDefaultWallet,
  getDefaultWalletId,
  listWallets,
} from "@/lib/db/wallets";
import { detectWalletCandidates } from "@/lib/finance/detect-wallet-keyword";
import {
  buildWalletMentionOptions,
  extractExplicitWalletFromText,
} from "@/lib/chat/wallet-mentions";
import type { WalletRecord } from "@/types/wallet";

export interface InboxWalletResolution {
  /** Wallet assigned to the saved transactions (detected or user default). */
  walletId: string | null;
  /** Non-default wallet name to mention in the reply; null keeps it quiet. */
  mentionedWalletName: string | null;
  /** Two or more wallets tied for the mention — show quick-correct chips. */
  ambiguousCandidates: Array<{ id: string; name: string }>;
  /** Input with ;wallet tokens removed — safe for transaction parsing. */
  cleanedText: string;
}

/** Detect an explicit wallet mention in chat text, falling back to the user's default wallet. */
export async function resolveInboxWallet(
  userId: string,
  text: string,
): Promise<InboxWalletResolution> {
  const trimmed = text.trim();

  let wallets: WalletRecord[] = [];
  let defaultWalletId: string | null = null;

  try {
    await ensureDefaultWallet(userId);
    [wallets, defaultWalletId] = await Promise.all([
      listWallets(userId),
      getDefaultWalletId(userId),
    ]);
  } catch {
    return {
      walletId: null,
      mentionedWalletName: null,
      ambiguousCandidates: [],
      cleanedText: trimmed,
    };
  }

  const mentionOptions = buildWalletMentionOptions(wallets);
  const explicit = extractExplicitWalletFromText(trimmed, mentionOptions);
  const parseText = explicit.cleanedText || trimmed;

  if (explicit.walletId) {
    const wallet = wallets.find((entry) => entry.id === explicit.walletId);

    return {
      walletId: explicit.walletId,
      mentionedWalletName:
        explicit.walletId !== defaultWalletId ? (wallet?.name ?? null) : null,
      ambiguousCandidates: [],
      cleanedText: parseText,
    };
  }

  const candidates = detectWalletCandidates(parseText, wallets);
  const detected = candidates.length === 1 ? candidates[0] : null;

  return {
    walletId: detected?.id ?? defaultWalletId,
    mentionedWalletName:
      detected && detected.id !== defaultWalletId ? detected.name : null,
    ambiguousCandidates:
      candidates.length > 1
        ? candidates.map((wallet) => ({ id: wallet.id, name: wallet.name }))
        : [],
    cleanedText: parseText,
  };
}

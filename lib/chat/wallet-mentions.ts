export interface WalletMentionOption {
  id: string;
  name: string;
  token: string;
  searchTerms: string[];
}

export interface WalletMentionRange {
  query: string;
  start: number;
  end: number;
}

export interface ExplicitWalletExtraction {
  walletId: string | null;
  cleanedText: string;
}

const WALLET_MENTION_PATTERN = /;([a-zA-Z0-9_]+)/g;

function normalizeQuery(value: string): string {
  return value.trim().toLowerCase();
}

/** Canonical ;mention token from a wallet display name. */
export function walletNameToMentionToken(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

export function buildWalletMentionOptions(
  wallets: ReadonlyArray<{ id: string; name: string }>,
): WalletMentionOption[] {
  const usedTokens = new Set<string>();

  return wallets.map((wallet) => {
    let token =
      walletNameToMentionToken(wallet.name) || `wallet_${wallet.id.slice(0, 6)}`;

    while (usedTokens.has(token)) {
      token = `${token}_${wallet.id.slice(-4)}`;
    }
    usedTokens.add(token);

    const searchTerms = new Set<string>([
      token,
      wallet.name.trim().toLowerCase(),
      ...wallet.name
        .trim()
        .toLowerCase()
        .split(/\s+/)
        .filter((part) => part.length >= 2),
    ]);

    return {
      id: wallet.id,
      name: wallet.name,
      token,
      searchTerms: [...searchTerms],
    };
  });
}

export function detectWalletMentionRange(
  text: string,
  cursor: number,
): WalletMentionRange | null {
  const safeCursor = Math.max(0, Math.min(cursor, text.length));
  const beforeCursor = text.slice(0, safeCursor);
  const mentionIndex = beforeCursor.lastIndexOf(";");

  if (mentionIndex === -1) {
    return null;
  }

  if (mentionIndex > 0 && !/\s/.test(beforeCursor[mentionIndex - 1] ?? "")) {
    return null;
  }

  const query = beforeCursor.slice(mentionIndex + 1);

  if (query.includes(" ")) {
    return null;
  }

  return {
    query,
    start: mentionIndex,
    end: safeCursor,
  };
}

function matchesWalletMentionQuery(
  option: WalletMentionOption,
  normalized: string,
): boolean {
  if (option.token.startsWith(normalized)) {
    return true;
  }

  if (option.name.toLowerCase().includes(normalized)) {
    return true;
  }

  return option.searchTerms.some((term) => term.includes(normalized));
}

export function filterWalletMentionOptions(
  query: string,
  options: WalletMentionOption[],
): WalletMentionOption[] {
  const normalized = normalizeQuery(query);

  if (!normalized) {
    return options;
  }

  return options.filter((option) =>
    matchesWalletMentionQuery(option, normalized),
  );
}

export function insertWalletMention(
  text: string,
  range: Pick<WalletMentionRange, "start" | "end">,
  token: string,
): { nextText: string; nextCursor: number } {
  const mention = `;${token}`;
  const before = text.slice(0, range.start);
  const after = text.slice(range.end);
  const nextText = `${before}${mention} ${after}`;
  const nextCursor = range.start + mention.length + 1;

  return { nextText, nextCursor };
}

function resolveMentionToken(
  token: string,
  options: WalletMentionOption[],
): string | null {
  const normalized = normalizeQuery(token);

  if (!normalized) {
    return null;
  }

  for (const option of options) {
    if (option.token === normalized) {
      return option.id;
    }

    if (option.searchTerms.includes(normalized)) {
      return option.id;
    }
  }

  const prefixMatches = options.filter((option) =>
    option.token.startsWith(normalized),
  );

  if (prefixMatches.length === 1) {
    return prefixMatches[0]?.id ?? null;
  }

  return null;
}

export function extractExplicitWalletFromText(
  text: string,
  options: WalletMentionOption[],
): ExplicitWalletExtraction {
  const trimmed = text.trim();
  let walletId: string | null = null;
  let cleanedText = trimmed;

  for (const match of trimmed.matchAll(WALLET_MENTION_PATTERN)) {
    const token = match[1];
    const resolved = resolveMentionToken(token, options);

    if (!resolved) {
      continue;
    }

    walletId = resolved;
    cleanedText = cleanedText.replace(match[0], " ");
  }

  cleanedText = cleanedText.replace(/\s+/g, " ").trim();

  return {
    walletId,
    cleanedText: cleanedText || trimmed.replace(WALLET_MENTION_PATTERN, " ").trim(),
  };
}

/** Removes ;wallet tokens so segment splitting does not treat ; as a delimiter. */
export function stripWalletMentionTokens(text: string): string {
  return text
    .replace(/(?<=^|\s);[a-zA-Z0-9_]+\s*/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

import { describe, expect, it } from "vitest";

import {
  buildWalletMentionOptions,
  extractExplicitWalletFromText,
  filterWalletMentionOptions,
  insertWalletMention,
  stripWalletMentionTokens,
  walletNameToMentionToken,
} from "@/lib/chat/wallet-mentions";

const wallets = [
  { id: "w1", name: "Cash" },
  { id: "w2", name: "BCA" },
  { id: "w3", name: "GoPay" },
];

describe("walletNameToMentionToken", () => {
  it("slugifies wallet names", () => {
    expect(walletNameToMentionToken("BCA Utama")).toBe("bca_utama");
    expect(walletNameToMentionToken("GoPay")).toBe("gopay");
  });
});

describe("extractExplicitWalletFromText", () => {
  const options = buildWalletMentionOptions(wallets);

  it("resolves a ;mention and strips it from parse text", () => {
    const result = extractExplicitWalletFromText(
      ";bca beli kopi 20rb",
      options,
    );

    expect(result.walletId).toBe("w2");
    expect(result.cleanedText).toBe("beli kopi 20rb");
  });

  it("returns null wallet when no ;mention is present", () => {
    const result = extractExplicitWalletFromText("beli kopi 20rb", options);

    expect(result.walletId).toBeNull();
    expect(result.cleanedText).toBe("beli kopi 20rb");
  });
});

describe("stripWalletMentionTokens", () => {
  it("removes leading wallet mention before segment split", () => {
    expect(stripWalletMentionTokens(";bca kopi 20rb, teh 10rb")).toBe(
      "kopi 20rb, teh 10rb",
    );
  });
});

describe("filterWalletMentionOptions", () => {
  const options = buildWalletMentionOptions(wallets);

  it("filters wallets by token prefix", () => {
    expect(filterWalletMentionOptions("bc", options).map((item) => item.id)).toEqual(
      ["w2"],
    );
  });
});

describe("insertWalletMention", () => {
  it("inserts a completed mention with trailing space", () => {
    const result = insertWalletMention(";bc", { start: 0, end: 3 }, "bca");

    expect(result.nextText).toBe(";bca ");
    expect(result.nextCursor).toBe(5);
  });
});

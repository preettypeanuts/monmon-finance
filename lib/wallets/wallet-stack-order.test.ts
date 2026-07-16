import { describe, expect, it } from "vitest";

import {
  buildInitialWalletStackOrder,
  getWalletStackEffectiveBottom,
  getWalletStackPreviewLayoutIndices,
  getWalletStackDisplayPosition,
  getWalletStackIndexFromDisplayPosition,
  mergeWalletStackOrder,
  reorderWalletStackOrder,
  resolveNearestWalletStackSlot,
  resolveWalletStackDropIndex,
} from "@/lib/wallets/wallet-stack-order";
import type { WalletWithBalance } from "@/types/wallet";

function wallet(
  overrides: Partial<WalletWithBalance> & Pick<WalletWithBalance, "id" | "name" | "type">,
): WalletWithBalance {
  return {
    icon: null,
    colorHex: null,
    initialBalance: 0,
    isDefault: false,
    isArchived: false,
    adminFeeAmount: null,
    adminFeeDay: null,
    createdAt: "2026-01-01T00:00:00.000Z",
    balance: 0,
    lastActivityAt: null,
    ...overrides,
  };
}

describe("wallet stack order", () => {
  it("places default wallet at the back of the stack", () => {
    const order = buildInitialWalletStackOrder([
      wallet({ id: "1", name: "GoPay", type: "ewallet" }),
      wallet({ id: "2", name: "BCA", type: "bank", isDefault: true }),
    ]);

    expect(order).toEqual(["1", "2"]);
  });

  it("keeps banks ahead of e-wallets before default wallet", () => {
    const order = buildInitialWalletStackOrder([
      wallet({ id: "1", name: "GoPay", type: "ewallet" }),
      wallet({ id: "2", name: "Mandiri", type: "bank" }),
    ]);

    expect(order[0]).toBe("2");
  });

  it("reorders stack positions", () => {
    expect(reorderWalletStackOrder(["a", "b", "c"], 2, 0)).toEqual([
      "c",
      "a",
      "b",
    ]);
  });

  it("merges stored order with newly added wallets at the front", () => {
    const merged = mergeWalletStackOrder(
      ["2", "3"],
      [
        wallet({ id: "1", name: "New", type: "bank" }),
        wallet({ id: "2", name: "BCA", type: "bank" }),
        wallet({ id: "3", name: "GoPay", type: "ewallet", isDefault: true }),
      ],
    );

    expect(merged[0]).toBe("1");
    expect(merged.at(-1)).toBe("3");
  });

  it("resolves nearest slot from effective card bottom", () => {
    expect(resolveNearestWalletStackSlot(0, 80, 3)).toBe(0);
    expect(resolveNearestWalletStackSlot(80, 80, 3)).toBe(1);
    expect(resolveNearestWalletStackSlot(160, 80, 3)).toBe(2);
  });

  it("drops to index 0 from the middle or back", () => {
    const step = 80;

    expect(
      resolveWalletStackDropIndex({
        fromIndex: 1,
        offsetY: 80,
        step,
        count: 3,
      }),
    ).toBe(0);

    expect(
      resolveWalletStackDropIndex({
        fromIndex: 2,
        offsetY: 160,
        step,
        count: 3,
      }),
    ).toBe(0);
  });

  it("drops to the last index from the front or middle", () => {
    const step = 80;

    expect(
      resolveWalletStackDropIndex({
        fromIndex: 0,
        offsetY: -160,
        step,
        count: 3,
      }),
    ).toBe(2);

    expect(
      resolveWalletStackDropIndex({
        fromIndex: 1,
        offsetY: -80,
        step,
        count: 3,
      }),
    ).toBe(2);
  });

  it("drops from display position 1 to 2", () => {
    const step = 80;
    const count = 3;
    const fromIndex = getWalletStackIndexFromDisplayPosition(1, count);

    expect(fromIndex).toBe(2);
    expect(
      resolveWalletStackDropIndex({
        fromIndex,
        offsetY: step,
        step,
        count,
      }),
    ).toBe(getWalletStackIndexFromDisplayPosition(2, count));
  });

  it("breaks slot ties toward drag direction", () => {
    expect(resolveNearestWalletStackSlot(40, 80, 3, 40)).toBe(0);
    expect(resolveNearestWalletStackSlot(40, 80, 3, -40)).toBe(1);
  });

  it("keeps the card put when drag jitter is tiny", () => {
    expect(
      resolveWalletStackDropIndex({
        fromIndex: 1,
        offsetY: 8,
        step: 80,
        count: 3,
      }),
    ).toBe(1);
  });

  it("computes effective bottom from drag offset", () => {
    expect(getWalletStackEffectiveBottom(2, 160, 80)).toBe(0);
    expect(getWalletStackEffectiveBottom(0, -160, 80)).toBe(160);
  });

  it("maps stack index to display position top-first", () => {
    expect(getWalletStackDisplayPosition(0, 3)).toBe(3);
    expect(getWalletStackDisplayPosition(2, 3)).toBe(1);
    expect(getWalletStackIndexFromDisplayPosition(1, 3)).toBe(2);
  });

  it("shifts other cards when previewing a drag reorder", () => {
    expect(getWalletStackPreviewLayoutIndices(3, 0, 2)).toEqual([2, 0, 1]);
    expect(getWalletStackPreviewLayoutIndices(3, 2, 0)).toEqual([1, 2, 0]);
    expect(getWalletStackPreviewLayoutIndices(3, 1, 1)).toEqual([0, 1, 2]);
  });
});

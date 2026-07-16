import { describe, expect, it } from "vitest";

import { formatWalletCardUpdated } from "@/lib/wallets/format-wallet-card-ornament";

describe("formatWalletCardUpdated", () => {
  it("formats as dd/mm with full year", () => {
    const date = new Date("2022-01-15T12:00:00.000Z");
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");

    expect(formatWalletCardUpdated("2022-01-15T12:00:00.000Z")).toEqual({
      dayMonth: `${day}/${month}`,
      year: "2022",
    });
  });
});

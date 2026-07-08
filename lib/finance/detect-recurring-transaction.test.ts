import { describe, expect, it } from "vitest";

import {
  averageAmount,
  descriptionMatchesKeyword,
  hasConsistentMonthlyCadence,
  isAmountWithinTolerance,
  isMonthlyInterval,
} from "@/lib/finance/detect-recurring-transaction";

function daysAgo(days: number, from = new Date("2026-07-08T10:00:00+07:00")): Date {
  return new Date(from.getTime() - days * 24 * 60 * 60 * 1000);
}

describe("isAmountWithinTolerance", () => {
  it("accepts amounts within ±15%", () => {
    expect(isAmountWithinTolerance(54_000, 54_000)).toBe(true);
    expect(isAmountWithinTolerance(50_000, 54_000)).toBe(true);
    expect(isAmountWithinTolerance(62_000, 54_000)).toBe(true);
  });

  it("rejects amounts outside ±15%", () => {
    expect(isAmountWithinTolerance(40_000, 54_000)).toBe(false);
    expect(isAmountWithinTolerance(70_000, 54_000)).toBe(false);
  });
});

describe("descriptionMatchesKeyword", () => {
  it("matches substring and extracted keyword", () => {
    expect(descriptionMatchesKeyword("netflix 54rb", "netflix")).toBe(true);
    expect(descriptionMatchesKeyword("bayar netflix premium", "netflix")).toBe(
      true,
    );
    expect(descriptionMatchesKeyword("spotify 54rb", "netflix")).toBe(false);
  });
});

describe("monthly interval helpers", () => {
  it("treats 25–34 day gaps as monthly", () => {
    expect(isMonthlyInterval(28)).toBe(true);
    expect(isMonthlyInterval(31)).toBe(true);
    expect(isMonthlyInterval(25)).toBe(true);
    expect(isMonthlyInterval(34)).toBe(true);
    expect(isMonthlyInterval(20)).toBe(false);
    expect(isMonthlyInterval(40)).toBe(false);
  });

  it("detects consistent monthly cadence for 3 Netflix-style dates", () => {
    const dates = [daysAgo(60), daysAgo(30), daysAgo(0)];
    expect(hasConsistentMonthlyCadence(dates)).toBe(true);
  });

  it("rejects inconsistent gaps", () => {
    const dates = [daysAgo(60), daysAgo(50), daysAgo(0)];
    expect(hasConsistentMonthlyCadence(dates)).toBe(false);
  });

  it("requires at least 3 dates", () => {
    expect(hasConsistentMonthlyCadence([daysAgo(30), daysAgo(0)])).toBe(false);
  });
});

describe("averageAmount", () => {
  it("rounds the mean of matching amounts", () => {
    expect(averageAmount([54_000, 54_000, 54_000])).toBe(54_000);
    expect(averageAmount([50_000, 54_000, 56_000])).toBe(53_333);
  });
});

describe("manual Netflix-style scenario", () => {
  it("matches keyword, amount, and ~30-day cadence for 3 transactions", () => {
    const keyword = "netflix";
    const current = {
      description: "netflix 54rb",
      amount: 54_000,
      at: daysAgo(0),
    };
    const history = [
      { description: "60 hari lalu netflix 54rb", amount: 54_000, at: daysAgo(60) },
      { description: "30 hari lalu netflix 54rb", amount: 54_000, at: daysAgo(30) },
    ];

    const matches = history.filter(
      (row) =>
        descriptionMatchesKeyword(row.description, keyword) &&
        isAmountWithinTolerance(row.amount, current.amount),
    );

    expect(matches).toHaveLength(2);
    expect(
      hasConsistentMonthlyCadence([
        ...matches.map((row) => row.at),
        current.at,
      ]),
    ).toBe(true);
    expect(averageAmount([...matches.map((m) => m.amount), current.amount])).toBe(
      54_000,
    );
  });
});

/** Deterministic IDR formatting — avoids Intl currency spacing mismatch between Node and browser. */
function formatIdrDigits(amount: number): string {
  return Math.abs(Math.round(amount))
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export function formatIdr(amount: number): string {
  const sign = amount < 0 ? "−" : "";
  return `${sign}Rp${formatIdrDigits(amount)}`;
}

/** Signed delta for day-over-day comparisons, e.g. +Rp285.000 or −Rp50.000. */
export function formatSignedIdrDelta(delta: number): string {
  if (delta === 0) {
    return "Rp0";
  }

  const sign = delta > 0 ? "+" : "−";
  return `${sign}Rp${formatIdrDigits(delta)}`;
}

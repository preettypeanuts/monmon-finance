/** Strip non-digits from amount field input. */
export function extractAmountDigits(value: string): string {
  return value.replace(/\D/g, "");
}

/** Format digit-only string with Indonesian thousand separators (e.g. 8810000 → 8.810.000). */
export function formatAmountInputDigits(digits: string): string {
  const trimmed = digits.trim();
  if (!trimmed) {
    return "";
  }

  const normalized = trimmed.replace(/^0+(?=\d)/, "");
  if (!normalized) {
    return "";
  }

  return normalized.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

/** Normalize any amount text to formatted IDR digit groups for inputs. */
export function formatAmountInput(value: string): string {
  return formatAmountInputDigits(extractAmountDigits(value));
}

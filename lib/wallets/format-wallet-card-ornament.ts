export interface WalletCardUpdatedDate {
  dayMonth: string;
  year: string;
}

/** dd/mm + full year for card updated ornament. */
export function formatWalletCardUpdated(isoDate: string): WalletCardUpdatedDate {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) {
    return { dayMonth: "--/--", year: "----" };
  }

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear());

  return {
    dayMonth: `${day}/${month}`,
    year,
  };
}

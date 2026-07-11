interface DailySummarySignatureTransaction {
  type: "income" | "expense";
  amount: number;
}

export function buildDailySummarySignature(
  transactions: DailySummarySignatureTransaction[],
): string {
  let totalExpense = 0;
  let totalIncome = 0;

  for (const transaction of transactions) {
    if (transaction.type === "income") {
      totalIncome += transaction.amount;
      continue;
    }

    totalExpense += transaction.amount;
  }

  return `${transactions.length}:${totalExpense}:${totalIncome}`;
}

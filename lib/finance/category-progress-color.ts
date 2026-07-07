const CATEGORY_PROGRESS_FILLS: Record<string, string> = {
  food: "bg-[#34C759]",
  groceries: "bg-[#30D158]",
  transport: "bg-[#8E5AF7]",
  shopping: "bg-[#FF70C1]",
  housing: "bg-[#A89478]",
  utilities: "bg-[#FFD60A]",
  bills: "bg-[#FFD60A]",
  subscription: "bg-[#BF5AF2]",
  entertainment: "bg-[#FF375F]",
  health: "bg-[#5AC8FA]",
  education: "bg-[#64D2FF]",
  personal: "bg-[#FF9F0A]",
  family: "bg-[#FF6482]",
  travel: "bg-[#0A84FF]",
  pets: "bg-[#AC8E68]",
  gift: "bg-[#FF2D55]",
  income: "bg-[#34C759]",
  other: "bg-[#8E8E93]",
};

export function getCategoryProgressFill(category: string): string {
  const normalized = category === "bills" ? "utilities" : category;
  return CATEGORY_PROGRESS_FILLS[normalized] ?? "bg-primary";
}

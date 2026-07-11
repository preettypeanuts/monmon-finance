export interface CategoryIconOption {
  id: string;
  label: string;
}

/**
 * Icons users can pick when creating or editing categories.
 * Must stay a superset of `SummaryTileIcon` since built-in
 * category styles reuse those icon ids.
 */
export const CATEGORY_ICON_OPTIONS = [
  // Money
  { id: "wallet", label: "Wallet" },
  { id: "coins", label: "Money" },
  { id: "banknote", label: "Cash" },
  { id: "credit-card", label: "Card" },
  { id: "receipt", label: "Bills" },
  { id: "arrow-down", label: "Income" },
  { id: "arrow-up", label: "Expense" },
  { id: "chart-up", label: "Invest" },
  { id: "bitcoin", label: "Crypto" },
  { id: "percent", label: "Tax" },
  { id: "briefcase", label: "Work" },
  { id: "building", label: "Office" },
  // Food & drinks
  { id: "fork-knife", label: "Food" },
  { id: "takeout", label: "Takeout" },
  { id: "wine", label: "Drinks" },
  { id: "cake", label: "Treats" },
  { id: "basket", label: "Groceries" },
  // Transport
  { id: "car", label: "Car" },
  { id: "bus", label: "Bus" },
  { id: "train", label: "Train" },
  { id: "bicycle", label: "Bike" },
  { id: "fuel", label: "Fuel" },
  { id: "airplane", label: "Travel" },
  // Shopping
  { id: "shopping-bag", label: "Shopping" },
  { id: "cart", label: "Cart" },
  { id: "storefront", label: "Store" },
  { id: "tag", label: "Sale" },
  { id: "shipping-box", label: "Package" },
  { id: "tshirt", label: "Clothes" },
  { id: "scissors", label: "Salon" },
  // Home & utilities
  { id: "house", label: "Home" },
  { id: "sofa", label: "Furniture" },
  { id: "bolt", label: "Electric" },
  { id: "drop", label: "Water" },
  { id: "wifi", label: "Internet" },
  { id: "smartphone", label: "Phone" },
  { id: "laptop", label: "Tech" },
  { id: "wrench", label: "Repair" },
  // Health & family
  { id: "heart", label: "Health" },
  { id: "pills", label: "Medicine" },
  { id: "dumbbell", label: "Gym" },
  { id: "graduation-cap", label: "Education" },
  { id: "book", label: "Books" },
  { id: "paw-print", label: "Pets" },
  { id: "family", label: "Family" },
  { id: "gift", label: "Gift" },
  // Lifestyle & fun
  { id: "sparkle", label: "Beauty" },
  { id: "paintbrush", label: "Hobby" },
  { id: "camera", label: "Photo" },
  { id: "music-note", label: "Music" },
  { id: "game-controller", label: "Games" },
  { id: "party-popper", label: "Fun" },
  { id: "film", label: "Movies" },
  { id: "tv", label: "Streaming" },
  { id: "ticket", label: "Events" },
  { id: "trophy", label: "Sports" },
  { id: "globe", label: "World" },
  { id: "leaf", label: "Nature" },
  // Misc
  { id: "star", label: "Favorite" },
  { id: "shield", label: "Insurance" },
  { id: "calendar", label: "Schedule" },
  { id: "dots-three", label: "Other" },
] as const satisfies readonly CategoryIconOption[];

export type CategoryIconId = (typeof CATEGORY_ICON_OPTIONS)[number]["id"];

const CATEGORY_ICON_IDS = new Set<string>(
  CATEGORY_ICON_OPTIONS.map((option) => option.id),
);

export function isCategoryIconId(value: string): value is CategoryIconId {
  return CATEGORY_ICON_IDS.has(value);
}

export function resolveCategoryIconId(value: string): CategoryIconId {
  return isCategoryIconId(value) ? value : "dots-three";
}

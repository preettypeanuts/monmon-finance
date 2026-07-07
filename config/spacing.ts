/** Desktop-only viewport inset for the main content column. */
export const DESKTOP_OUTER_GUTTER = "md:py-3 md:pr-3";

/** Desktop-only right inset — used when page shell owns vertical gutter. */
export const DESKTOP_OUTER_GUTTER_X = "md:pr-3";

/**
 * Outer gutter for nested desktop panels (e.g. inbox summary column).
 * Main shell inset uses DESKTOP_OUTER_GUTTER on SidebarInset.
 */
export const APP_GUTTER = DESKTOP_OUTER_GUTTER;

/** Gap between major layout columns. */
export const APP_GAP = "gap-3";

/** Inner padding inside glass shells. */
export const SHELL_PADDING = "p-3";

/** Horizontal inset for scroll/content areas. */
export const CONTENT_INSET_X = "px-3";

/** Vertical inset for scroll/content areas. */
export const CONTENT_INSET_Y = "py-3";

/** Full content inset (chat messages, inputs). */
export const CONTENT_INSET = "px-3 py-3";

/** Vertical stack spacing inside panels. */
export const STACK_GAP = "gap-3";

/** Grid spacing for tiles and picker cards. */
export const GRID_GAP = "gap-2.5";

/** Tight inline gap for controls in a row. */
export const CONTROL_GAP = "gap-1.5";

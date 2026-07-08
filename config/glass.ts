/** Solid glass on default (plain) wallpaper — see GLASS_FILL_* in globals.css. */
export const GLASS_FILL_LIGHT_DEFAULT = "#F8F8F8C5";
export const GLASS_FILL_DARK_DEFAULT = "#33333182";

/** Backdrop filters — blur via CSS var (--glass-backdrop-blur); brightness/saturate in globals.css. */
export const GLASS_BACKDROP = "glass-backdrop";

/** Frosted fill — uses CSS var; solid gray on default wallpaper, frosted on others. */
export const GLASS_FILL = "bg-[var(--glass-fill)]";

export const GLASS_BORDER = "border border-black/12 dark:border-white/12";

export const GLASS_HIGHLIGHT =
  "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.55),0_1px_2px_rgba(0,0,0,0.06)] dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.07),0_1px_3px_rgba(0,0,0,0.4)]";

export const GLASS_SURFACE = `${GLASS_BACKDROP} ${GLASS_BORDER} ${GLASS_FILL} ${GLASS_HIGHLIGHT}`;

/** Hover/active overlay on glass controls. */
export const GLASS_HOVER =
  "hover:bg-white/75 dark:hover:bg-white/10 dark:active:bg-white/14";

export const GLASS_TILE_HIGHLIGHT =
  "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.3)] dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]";

export const GLASS_TILE_BASE = `${GLASS_BACKDROP} ${GLASS_TILE_HIGHLIGHT}`;

/** Padding around glass controls so box-shadow is not clipped by overflow containers. */
export const GLASS_SHADOW_INSET = "px-3 py-3";

/** iOS-style hairline outline for large glass shells (sidebar). */
export const GLASS_SHELL_OUTLINE = `${GLASS_BACKDROP} ${GLASS_BORDER} ${GLASS_HIGHLIGHT}`;

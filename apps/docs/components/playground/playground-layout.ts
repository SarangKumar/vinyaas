/**
 * Shared playground layout ladder (docs site).
 *
 * Pinterest masonry via CSS columns:
 * - default → 1 column
 * - `md` (768) → 2 columns
 * - `lg` (1024) → 3 columns
 * - `xl` (1280) → 4 columns (laptop)
 * - homepage showcase only: `min-[1900px]` → 5 columns (side-blur desktops)
 *
 * Dense chrome (Typeset drawer) shows inline options above 1400px.
 */

/** Shared CSS-columns masonry (homepage + Themes + Typeset). Max 4. */
export const playgroundColumnsClassName =
  "columns-1 md:columns-2 lg:columns-3 xl:columns-4 [column-gap:var(--gap)] **:data-[slot=card]:w-full";

/**
 * Homepage showcase only — fifth column when the shell hits 1900px
 * (side skeleton rails / edge fade activate at 2200px around this band).
 */
export const playgroundShowcaseColumnsClassName = "min-[1900px]:columns-5!";

/** Item inside the CSS-columns masonry. */
export const playgroundColumnItemClassName =
  "mb-(--gap) w-full break-inside-avoid [break-inside:avoid]";

/**
 * Dense chrome (Typeset field row, etc.): drawer below 1400px,
 * inline options above 1400px.
 */
export const playgroundDenseChromeShowClassName = "min-[1400px]:hidden";
export const playgroundDenseChromeInlineClassName =
  "hidden min-w-0 flex-1 flex-wrap items-end gap-3 min-[1400px]:flex";

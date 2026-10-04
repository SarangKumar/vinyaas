/**
 * Shared playground layout ladder (docs site).
 *
 * Themes / Typeset (CSS columns masonry):
 * - default → 1 column
 * - `md` (768) → 2 columns
 * - `lg` (1024) → 3 columns
 * - `xl` (1280) → 4 columns
 *
 * Homepage showcase (shadcn-style grid of flex columns):
 * - 1 → md:2 → lg:3 → min-[1400px]:4 → min-[1900px]:5
 * Cards are stacked inside column flex stacks so mixed heights pack tightly.
 *
 * Dense chrome (Typeset drawer) shows inline options above 1400px.
 */

/** Shared CSS-columns masonry (Themes / Typeset). Max 4. */
export const playgroundColumnsClassName =
  "columns-1 md:columns-2 lg:columns-3 xl:columns-4 [column-gap:var(--gap)] **:data-[slot=card]:w-full";

/**
 * Homepage showcase root — matches ui.shadcn.com CardsDemo grid.
 */
export const playgroundShowcaseGridClassName =
  "relative z-10 mx-auto grid gap-(--gap) **:data-[slot=card]:w-full min-[1400px]:grid-cols-4! min-[1900px]:grid-cols-5! md:max-w-3xl md:grid-cols-2 lg:max-w-none lg:grid-cols-3 xl:max-w-[1600px] 2xl:max-w-[1900px]";

/**
 * Homepage column stacks. Hidden columns use `display: none` so they leave
 * the grid track (same progressive reveal as shadcn).
 */
export const playgroundShowcaseColumnClassName = {
  /** Always visible (column 1). */
  base: "flex flex-col items-start gap-(--gap)",
  /** From `lg` (column 2). */
  lg: "hidden flex-col gap-(--gap) lg:flex",
  /** From 1400px (column 3). */
  wide: "hidden flex-col gap-(--gap) min-[1400px]:flex",
  /** From `md` (column 4 in DOM order; second track at md). */
  md: "hidden flex-col gap-(--gap) md:flex",
  /** From 1900px (column 5). */
  ultra: "hidden flex-col gap-(--gap) min-[1900px]:flex",
} as const;

/** @deprecated Use `playgroundShowcaseGridClassName`. */
export const playgroundShowcaseColumnsClassName =
  playgroundShowcaseGridClassName;

/** Item inside the CSS-columns masonry (Themes / Typeset). */
export const playgroundColumnItemClassName =
  "mb-(--gap) w-full break-inside-avoid [break-inside:avoid]";

/**
 * Dense chrome (Typeset field row, etc.): drawer below 1400px,
 * inline options above 1400px.
 */
export const playgroundDenseChromeShowClassName = "min-[1400px]:hidden";
export const playgroundDenseChromeInlineClassName =
  "hidden min-w-0 flex-1 flex-wrap items-end gap-3 min-[1400px]:flex";

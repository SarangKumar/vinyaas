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
 * Homepage column stacks. All columns stay in the layout so every showcase
 * card remains visible; the grid breakpoint classes control how many tracks
 * are used (1 → 2 → 3 → 4 → 5).
 */
export const playgroundShowcaseColumnClassName = {
  /** Column 1. */
  base: "flex flex-col items-start gap-(--gap)",
  /** Column 2. */
  lg: "flex flex-col gap-(--gap)",
  /** Column 3. */
  wide: "flex flex-col gap-(--gap)",
  /** Column 4. */
  md: "flex flex-col gap-(--gap)",
  /** Column 5. */
  ultra: "flex flex-col gap-(--gap)",
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

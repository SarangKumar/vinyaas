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
 * Cards are redistributed into exactly as many column stacks as the
 * active grid track count, so a 5th stack never wraps under 4 columns.
 *
 * Dense chrome (Typeset drawer) shows inline options above 1400px.
 */

/** Shared CSS-columns masonry (Themes / Typeset). Max 4. */
export const playgroundColumnsClassName =
  "columns-1 md:columns-2 lg:columns-3 xl:columns-4 [column-gap:var(--gap)] **:data-[slot=card]:w-full";

/**
 * Homepage showcase root — matches ui.shadcn.com CardsDemo grid.
 * `min-w-0` + card width rules keep demos (tables, pagination, code) inside tracks.
 */
export const playgroundShowcaseGridClassName =
  "relative z-10 mx-auto grid w-full min-w-0 items-stretch gap-(--gap) **:data-[slot=card]:w-full **:data-[slot=card]:max-w-full min-[1400px]:grid-cols-4! min-[1900px]:grid-cols-5! md:max-w-3xl md:grid-cols-2 lg:max-w-none lg:grid-cols-3 xl:max-w-[1600px] 2xl:max-w-[1900px]";

/** Flex stack for one homepage showcase column. */
export const playgroundShowcaseColumnStackClassName =
  "flex h-full min-w-0 flex-col gap-(--gap) **:data-[slot=card]:w-full";

/**
 * @deprecated Prefer {@link playgroundShowcaseColumnStackClassName}.
 * Kept for older imports; all keys share the same stack class.
 */
export const playgroundShowcaseColumnClassName = {
  base: playgroundShowcaseColumnStackClassName,
  lg: playgroundShowcaseColumnStackClassName,
  wide: playgroundShowcaseColumnStackClassName,
  md: playgroundShowcaseColumnStackClassName,
  ultra: playgroundShowcaseColumnStackClassName,
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

/** Breakpoints that mirror the homepage grid track ladder (px). */
export const SHOWCASE_COLUMN_BREAKPOINTS = {
  md: 768,
  lg: 1024,
  four: 1400,
  five: 1900,
} as const;

export type ShowcaseColumnCount = 1 | 2 | 3 | 4 | 5;

/**
 * How many homepage column stacks to render for a viewport width.
 * Must match `playgroundShowcaseGridClassName` track counts.
 */
export function getShowcaseColumnCount(width: number): ShowcaseColumnCount {
  if (width >= SHOWCASE_COLUMN_BREAKPOINTS.five) {
    return 5;
  }
  if (width >= SHOWCASE_COLUMN_BREAKPOINTS.four) {
    return 4;
  }
  if (width >= SHOWCASE_COLUMN_BREAKPOINTS.lg) {
    return 3;
  }
  if (width >= SHOWCASE_COLUMN_BREAKPOINTS.md) {
    return 2;
  }
  return 1;
}

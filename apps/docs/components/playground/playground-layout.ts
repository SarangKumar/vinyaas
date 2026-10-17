/**
 * Shared playground layout ladder (docs site).
 *
 * Themes / Typeset (measured masonry — grid of flex column stacks):
 * - container < 640 → 1 column
 * - container < 960 → 2 columns
 * - container < 1280 → 3 columns
 * - container >= 1280 → 4 columns
 * Column count follows the *container* width, and each card is placed in the
 * shortest column at the time it is laid out, so every column starts at the
 * same top edge and trailing space stays minimal.
 *
 * Homepage showcase (shadcn-style grid of flex columns):
 * - 1 → md:2 → lg:3 → min-[1400px]:4 → min-[1900px]:5
 * Cards are redistributed into exactly as many column stacks as the
 * active grid track count, so a 5th stack never wraps under 4 columns.
 *
 * Dense chrome (Typeset drawer) shows inline options above 1400px.
 */

/**
 * Shared masonry root (Themes / Typeset). Max 4 columns.
 *
 * The track count and the gutter are inline styles rather than classes,
 * because both are derived from the measured container width.
 */
export const playgroundMasonryClassName =
  "grid w-full min-w-0 **:data-[slot=card]:w-full **:data-[slot=card]:max-w-full";

/** One masonry column: a plain stack, so cards keep their natural heights. */
export const playgroundMasonryColumnClassName = "flex min-w-0 flex-col";

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

/** Item inside the masonry. The column stack owns the vertical gutter. */
export const playgroundMasonryItemClassName = "w-full min-w-0";

/** Container widths (px) where the masonry gains a column. */
export const PLAYGROUND_MASONRY_BREAKPOINTS = {
  two: 640,
  three: 960,
  four: 1280,
} as const;

export type PlaygroundColumnCount = 1 | 2 | 3 | 4;

/** Masonry column count for a measured container width. */
export function getPlaygroundColumnCount(
  containerWidth: number,
): PlaygroundColumnCount {
  if (containerWidth >= PLAYGROUND_MASONRY_BREAKPOINTS.four) {
    return 4;
  }
  if (containerWidth >= PLAYGROUND_MASONRY_BREAKPOINTS.three) {
    return 3;
  }
  if (containerWidth >= PLAYGROUND_MASONRY_BREAKPOINTS.two) {
    return 2;
  }
  return 1;
}

/** Gutter in px, used for both axes so the grid reads as one rhythm. */
export function getPlaygroundMasonryGap(containerWidth: number): number {
  if (containerWidth >= PLAYGROUND_MASONRY_BREAKPOINTS.four) {
    return 32;
  }
  if (containerWidth >= PLAYGROUND_MASONRY_BREAKPOINTS.two) {
    return 28;
  }
  return 24;
}

/**
 * Pinterest packing: each card joins the column that is currently shortest,
 * so columns grow evenly and no column is left with a tall empty tail.
 *
 * Ties break towards the column holding fewer cards, which makes an
 * unmeasured first pass (every height still 0) fall back to round-robin
 * instead of stacking everything into the first column.
 *
 * Indexes are handed out in source order, so reading order down a column
 * matches the order the cards were declared in.
 */
export function packMasonryColumns(
  heights: readonly number[],
  columnCount: number,
): number[][] {
  const count = Math.max(1, columnCount);
  const columns: number[][] = Array.from({ length: count }, () => []);
  const totals = Array.from({ length: count }, () => 0);

  heights.forEach((height, index) => {
    let target = 0;

    for (let column = 1; column < count; column += 1) {
      const candidate = totals[column] ?? 0;
      const current = totals[target] ?? 0;

      if (
        candidate < current ||
        (candidate === current &&
          (columns[column]?.length ?? 0) < (columns[target]?.length ?? 0))
      ) {
        target = column;
      }
    }

    columns[target]!.push(index);
    totals[target] = (totals[target] ?? 0) + Math.max(0, height);
  });

  return columns;
}

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

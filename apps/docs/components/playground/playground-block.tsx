"use client";

import {
  Children,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { cn } from "@/lib/utils";

import {
  getPlaygroundColumnCount,
  getPlaygroundMasonryGap,
  packMasonryColumns,
  playgroundMasonryClassName,
  playgroundMasonryColumnClassName,
  playgroundMasonryItemClassName,
} from "./playground-layout";

/**
 * Showcase card for Themes / Typeset playgrounds.
 * No per-card Code button — theme/typeset Copy code lives on the toolbar.
 */
export function PlaygroundBlock({
  title,
  description,
  children,
  className,
}: {
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      data-slot="card"
      data-playground-block
      data-example={title}
      className={cn(
        "border-border bg-card text-card-foreground flex w-full min-w-0 flex-col gap-4 rounded-xl border p-4 sm:gap-5 sm:p-5",
        className,
      )}
    >
      {title ? (
        // Only reserve two description lines when a description exists, so
        // title-only cards (Typeset) do not show an empty band under the title.
        <header
          className={cn(
            "flex min-w-0 flex-col gap-1",
            description && "min-h-[4.75rem]",
          )}
        >
          <h2 className="text-foreground text-[0.9375rem] font-medium tracking-tight">
            {title}
          </h2>
          {description ? (
            <p className="text-muted-foreground line-clamp-2 text-sm leading-6">
              {description}
            </p>
          ) : null}
        </header>
      ) : null}
      <div className="flex max-w-full min-w-0 flex-1 flex-col gap-4 p-0.5 text-sm">
        {children}
      </div>
    </section>
  );
}

const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

/** Column width is identical everywhere, so sub-pixel drift is not a move. */
function sameHeights(left: readonly number[], right: readonly number[]) {
  return (
    left.length === right.length &&
    left.every((value, index) => Math.abs(value - (right[index] ?? 0)) < 1)
  );
}

/** Rendered before the container is measured — a mid-laptop three columns. */
const SERVER_COLUMN_COUNT = 3;

/**
 * Themes / Typeset Pinterest masonry.
 *
 * A grid of flex column stacks rather than CSS multi-column: `column-fill:
 * balance` splits the list to equalise column *height*, which leaves ragged
 * tails and ignores how tall each card actually is. Here every card is
 * measured and dropped into the shortest column, so all columns start at the
 * same top edge, cards keep their natural heights, and the gutter is the
 * same on both axes.
 *
 * Heights are observed rather than estimated, so a card that grows (a chart
 * loading, a radius change, a longer description) repacks the gallery.
 * Moving a card between columns remounts it, so the pack only runs when the
 * assignment genuinely changes.
 *
 * Homepage uses `playgroundShowcaseGridClassName` (grid of flex columns).
 */
export function PlaygroundGrid({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const items = Children.toArray(children);
  const count = items.length;
  const rootRef = useRef<HTMLDivElement | null>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [width, setWidth] = useState(0);
  const [heights, setHeights] = useState<number[]>([]);

  const measure = useCallback(() => {
    setHeights((previous) => {
      const next = Array.from(
        { length: count },
        (_, index) =>
          itemsRef.current[index]?.getBoundingClientRect().height ?? 0,
      );

      return sameHeights(previous, next) ? previous : next;
    });
  }, [count]);

  // The gallery sits in a padded, max-width column, so the viewport is the
  // wrong thing to break on — measure the space the cards actually get.
  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;

    if (!root) {
      return;
    }

    setWidth(root.clientWidth);

    const observer = new ResizeObserver((entries) => {
      const measured = entries[0]?.contentRect.width;
      setWidth(measured ?? root.clientWidth);
    });

    observer.observe(root);

    return () => observer.disconnect();
  }, []);

  useIsomorphicLayoutEffect(() => {
    measure();

    const observer = new ResizeObserver(() => measure());

    for (let index = 0; index < count; index += 1) {
      const node = itemsRef.current[index];

      if (node) {
        observer.observe(node);
      }
    }

    return () => observer.disconnect();
  }, [measure, count]);

  const columnCount =
    width > 0 ? getPlaygroundColumnCount(width) : SERVER_COLUMN_COUNT;
  const gap = getPlaygroundMasonryGap(width);
  const columns = useMemo(
    () =>
      packMasonryColumns(
        Array.from({ length: count }, (_, index) => heights[index] ?? 0),
        columnCount,
      ),
    [count, heights, columnCount],
  );

  return (
    <div
      ref={rootRef}
      data-playground-grid
      data-playground-mode="playground"
      data-playground-columns={columnCount}
      className={cn(playgroundMasonryClassName, className)}
      style={{
        gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))`,
        gap: `${gap}px`,
      }}
    >
      {columns.map((indexes, column) => (
        <div
          key={column}
          data-playground-column={column}
          className={playgroundMasonryColumnClassName}
          style={{ gap: `${gap}px` }}
        >
          {indexes.map((index) => (
            <div
              key={index}
              data-playground-item
              ref={(node) => {
                itemsRef.current[index] = node;
              }}
              className={playgroundMasonryItemClassName}
            >
              {items[index]}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

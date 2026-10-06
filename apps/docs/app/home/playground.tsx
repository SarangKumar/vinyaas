"use client";

import {
  SHOWCASE_BLOCK_COUNT,
  distributeShowcaseBlocks,
  filterShowcaseBlocks,
  showcaseBlocks,
} from "@/app/home/showcase-blocks";
import {
  playgroundShowcaseColumnStackClassName,
  playgroundShowcaseGridClassName,
} from "@/components/playground/playground-layout";
import { useShowcaseColumnCount } from "@/components/playground/use-showcase-column-count";

/**
 * Homepage showcase — same pattern as ui.shadcn.com:
 * a responsive CSS grid of flex columns (not one card per cell).
 *
 * Column stacks are rebuilt for the active breakpoint (1→2→3→4→5) so
 * cards redistribute instead of wrapping a spare column under the grid.
 * Cards keep `min-w-0` / `max-w-full` so demos shrink inside each track.
 */
export function Playground({
  filter = null,
}: {
  /** Optional id/slug filter. Empty/absent = show the full showcase. */
  filter?: string | null;
}) {
  const columnCount = useShowcaseColumnCount();
  const visible = filterShowcaseBlocks(showcaseBlocks, filter);
  const columns = distributeShowcaseBlocks(visible, columnCount);

  return (
    <div
      data-playground
      data-playground-grid
      data-playground-mode="showcase"
      data-showcase-count={visible.length}
      data-showcase-columns={columnCount}
      data-showcase-filter={filter?.trim() ? filter.trim() : "none"}
      className={playgroundShowcaseGridClassName}
    >
      {visible.length === 0 ? (
        <p
          data-showcase-empty
          className="text-muted-foreground col-span-full py-16 text-center text-sm"
        >
          No matching showcase cards.
        </p>
      ) : (
        columns.map((blocks, index) => (
          <div
            key={index}
            data-playground-column={index}
            className={playgroundShowcaseColumnStackClassName}
          >
            {blocks.map(({ id, Block }) => (
              <Block key={id} />
            ))}
          </div>
        ))
      )}
      <span className="sr-only" data-showcase-total={SHOWCASE_BLOCK_COUNT}>
        {SHOWCASE_BLOCK_COUNT} showcase cards available
      </span>
    </div>
  );
}

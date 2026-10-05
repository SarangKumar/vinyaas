import {
  SHOWCASE_BLOCK_COUNT,
  distributeShowcaseBlocks,
  filterShowcaseBlocks,
  showcaseBlocks,
} from "@/app/home/showcase-blocks";
import {
  playgroundShowcaseColumnClassName,
  playgroundShowcaseGridClassName,
} from "@/components/playground/playground-layout";

const COLUMN_COUNT = 5;

/**
 * Homepage showcase — same pattern as ui.shadcn.com:
 * a responsive CSS grid of flex columns (not one card per cell).
 * Cards stay stacked in columns so mixed heights don’t leave row gaps.
 *
 * Visibility: 1 → md:2 → lg:3 → 1400:4 → 1900:5
 * When no filter is active, every showcase card is rendered.
 */
export function Playground({
  filter = null,
}: {
  /** Optional id/slug filter. Empty/absent = show the full showcase. */
  filter?: string | null;
}) {
  const visible = filterShowcaseBlocks(showcaseBlocks, filter);
  const columns = distributeShowcaseBlocks(visible, COLUMN_COUNT);
  const columnClassNames = [
    playgroundShowcaseColumnClassName.base,
    playgroundShowcaseColumnClassName.lg,
    playgroundShowcaseColumnClassName.wide,
    playgroundShowcaseColumnClassName.md,
    playgroundShowcaseColumnClassName.ultra,
  ] as const;

  return (
    <div
      data-playground
      data-playground-grid
      data-playground-mode="showcase"
      data-showcase-count={visible.length}
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
            className={columnClassNames[index]}
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

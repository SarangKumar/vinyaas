import {
  SHOWCASE_BLOCK_COUNT,
  showcaseBlocks,
} from "@/app/home/showcase-blocks";
import {
  playgroundShowcaseColumnClassName,
  playgroundShowcaseGridClassName,
} from "@/components/playground";

/**
 * Homepage showcase — same pattern as ui.shadcn.com:
 * a responsive CSS grid of flex columns (not one card per cell).
 * Cards stay stacked in columns so mixed heights don’t leave row gaps.
 *
 * Visibility: 1 → md:2 → lg:3 → 1400:4 → 1900:5
 */
export function Playground() {
  const columns = [
    {
      className: playgroundShowcaseColumnClassName.base,
      blocks: showcaseBlocks.slice(0, 4),
    },
    {
      className: playgroundShowcaseColumnClassName.lg,
      blocks: showcaseBlocks.slice(4, 8),
    },
    {
      className: playgroundShowcaseColumnClassName.wide,
      blocks: showcaseBlocks.slice(8, 12),
    },
    {
      className: playgroundShowcaseColumnClassName.md,
      blocks: showcaseBlocks.slice(12, 16),
    },
    {
      className: playgroundShowcaseColumnClassName.ultra,
      blocks: showcaseBlocks.slice(16, 20),
    },
  ] as const;

  return (
    <div
      data-playground
      data-playground-grid
      data-playground-mode="showcase"
      data-showcase-count={SHOWCASE_BLOCK_COUNT}
      className={playgroundShowcaseGridClassName}
    >
      {columns.map((column, index) => (
        <div
          key={index}
          data-playground-column={index}
          className={column.className}
        >
          {column.blocks.map(({ id, Block }) => (
            <Block key={id} />
          ))}
        </div>
      ))}
    </div>
  );
}

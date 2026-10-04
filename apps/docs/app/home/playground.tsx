import {
  SHOWCASE_BLOCK_COUNT,
  showcaseBlocks,
} from "@/app/home/showcase-blocks";
import { PlaygroundGrid } from "@/components/playground";

/**
 * Centered masonry for the main showcase cards.
 * Side skeleton rails are absolute (see PlaygroundSideRails) and sit
 * outside this max-width band at ≥2200px.
 *
 * Uses flex columns (PlaygroundGrid) so every column starts on the same
 * top edge — CSS columns fill top-to-bottom per column and look staggered.
 *
 * Card source of truth: {@link showcaseBlocks} (exactly
 * {@link SHOWCASE_BLOCK_COUNT} entries — see homepage showcase policy).
 *
 * Layout at ultra-wide:
 *   fade ← 2 skeleton cols | 5-column masonry | 2 skeleton cols → fade
 *
 * 1 · md:2 · lg:3 · min-1400:4 · min-1900:5
 */
export function Playground() {
  return (
    <div
      data-playground
      data-showcase-count={SHOWCASE_BLOCK_COUNT}
      className="relative z-10 mx-auto w-full min-[1400px]:max-w-[1600px] min-[1900px]:max-w-[1900px] md:max-w-3xl lg:max-w-none xl:max-w-[1600px] 2xl:max-w-[1900px]"
    >
      <PlaygroundGrid mode="showcase">
        {showcaseBlocks.map(({ id, Block }) => (
          <Block key={id} />
        ))}
      </PlaygroundGrid>
    </div>
  );
}

import {
  SHOWCASE_BLOCK_COUNT,
  showcaseBlocks,
} from "@/app/home/showcase-blocks";
import { PlaygroundGrid } from "@/components/playground";

/**
 * Centered Pinterest masonry for the main showcase cards.
 * Below 2200px the band uses max-width caps. From 2200px the shell is a
 * 3-column grid and this area is `1fr`, filling space between the side rails.
 *
 * 1 · md:2 · lg:3 · xl:4 · min-[1900px]:5 (homepage max)
 */
export function Playground() {
  return (
    <div
      data-playground
      data-showcase-count={SHOWCASE_BLOCK_COUNT}
      className="relative z-10 mx-auto w-full min-w-0 min-[1900px]:max-w-[1900px] min-[2200px]:max-w-none md:max-w-3xl lg:max-w-none xl:max-w-[1600px]"
    >
      <PlaygroundGrid mode="showcase">
        {showcaseBlocks.map(({ id, Block }) => (
          <Block key={id} />
        ))}
      </PlaygroundGrid>
    </div>
  );
}

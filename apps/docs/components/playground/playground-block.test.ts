import { describe, expect, it } from "vitest";

import {
  packMasonryColumns,
  playgroundMasonryClassName,
  playgroundShowcaseGridClassName,
} from "./playground-layout";

describe("PlaygroundGrid layout", () => {
  it("keeps Themes/Typeset on the measured masonry and homepage on its grid", () => {
    expect(playgroundMasonryClassName).toMatch(/\bgrid\b/);
    expect(playgroundMasonryClassName).not.toMatch(/columns-/);
    expect(playgroundShowcaseGridClassName).toMatch(
      /min-\[1400px\]:grid-cols-4!/,
    );
    expect(playgroundShowcaseGridClassName).toMatch(
      /min-\[1900px\]:grid-cols-5!/,
    );
  });

  it("starts every column at the top by packing into the shortest one", () => {
    // A tall card first: the three short ones that follow all go beside it
    // instead of continuing round-robin underneath it.
    expect(packMasonryColumns([300, 40, 40, 40], 3)).toEqual([
      [0],
      [1, 3],
      [2],
    ]);
  });
});

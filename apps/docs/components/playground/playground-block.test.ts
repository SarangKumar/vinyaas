import { describe, expect, it } from "vitest";

import {
  playgroundColumnsClassName,
  playgroundShowcaseGridClassName,
} from "./playground-layout";

describe("PlaygroundGrid layout", () => {
  it("keeps Themes/Typeset on CSS columns and homepage on responsive grid", () => {
    expect(playgroundColumnsClassName).toMatch(/xl:columns-4/);
    expect(playgroundShowcaseGridClassName).toMatch(
      /min-\[1400px\]:grid-cols-4!/,
    );
    expect(playgroundShowcaseGridClassName).toMatch(
      /min-\[1900px\]:grid-cols-5!/,
    );
  });
});

import { describe, expect, it } from "vitest";

import {
  playgroundColumnsClassName,
  playgroundShowcaseColumnsClassName,
} from "./playground-layout";

describe("PlaygroundGrid layout", () => {
  it("shares CSS columns through xl:4; homepage showcase adds columns-5", () => {
    expect(playgroundColumnsClassName).toMatch(/xl:columns-4/);
    expect(playgroundColumnsClassName).not.toMatch(/columns-5/);
    expect(playgroundShowcaseColumnsClassName).toBe("min-[1900px]:columns-5!");
  });
});

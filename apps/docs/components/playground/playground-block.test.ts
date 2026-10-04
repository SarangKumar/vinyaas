import { describe, expect, it } from "vitest";

import { playgroundColumnCountForWidth } from "./playground-block";

describe("playgroundColumnCountForWidth", () => {
  it("follows the 1 → 2 → 3 → 4 → 5 progression", () => {
    expect(playgroundColumnCountForWidth(375)).toBe(1);
    expect(playgroundColumnCountForWidth(767)).toBe(1);
    expect(playgroundColumnCountForWidth(768)).toBe(2);
    expect(playgroundColumnCountForWidth(1023)).toBe(2);
    expect(playgroundColumnCountForWidth(1024)).toBe(3);
    expect(playgroundColumnCountForWidth(1399)).toBe(3);
    expect(playgroundColumnCountForWidth(1400)).toBe(4);
    expect(playgroundColumnCountForWidth(1899)).toBe(4);
    expect(playgroundColumnCountForWidth(1900)).toBe(5);
    expect(playgroundColumnCountForWidth(2560)).toBe(5);
  });
});

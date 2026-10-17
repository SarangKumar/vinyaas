import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import {
  getPlaygroundColumnCount,
  getPlaygroundMasonryGap,
  getShowcaseColumnCount,
  packMasonryColumns,
  playgroundDenseChromeInlineClassName,
  playgroundDenseChromeShowClassName,
  playgroundMasonryClassName,
  playgroundMasonryColumnClassName,
  playgroundShowcaseGridClassName,
} from "./playground-layout";

const docsCss = readFileSync(
  path.join(path.dirname(fileURLToPath(import.meta.url)), "../../app/docs.css"),
  "utf8",
);

describe("playground layout utilities", () => {
  it("registers shared playground breakpoints in docs.css", () => {
    expect(docsCss).toContain("--breakpoint-playground: 87.5rem");
    expect(docsCss).toContain("--breakpoint-playground-wide: 118.75rem");
  });

  it("builds the shared Themes/Typeset masonry from column stacks", () => {
    // The track count is an inline style, so the class must not also carry a
    // CSS-columns rule that would fight it.
    expect(playgroundMasonryClassName).toContain("grid");
    expect(playgroundMasonryClassName).not.toContain("columns-");
    expect(playgroundMasonryColumnClassName).toContain("flex-col");
  });

  it("maps container widths to masonry columns, mobile to desktop", () => {
    expect(getPlaygroundColumnCount(375)).toBe(1);
    expect(getPlaygroundColumnCount(639)).toBe(1);
    expect(getPlaygroundColumnCount(640)).toBe(2);
    expect(getPlaygroundColumnCount(959)).toBe(2);
    expect(getPlaygroundColumnCount(960)).toBe(3);
    expect(getPlaygroundColumnCount(1279)).toBe(3);
    expect(getPlaygroundColumnCount(1280)).toBe(4);
    expect(getPlaygroundColumnCount(2200)).toBe(4);
  });

  it("keeps the masonry gutter inside the 24-32px band", () => {
    for (const width of [320, 640, 960, 1280, 2200]) {
      const gap = getPlaygroundMasonryGap(width);
      expect(gap).toBeGreaterThanOrEqual(24);
      expect(gap).toBeLessThanOrEqual(32);
    }
  });

  it("packs each card into the shortest column, in source order", () => {
    const columns = packMasonryColumns([300, 100, 100, 100], 3);

    expect(columns).toEqual([[0], [1, 3], [2]]);
    // Reading order down a column never goes backwards.
    for (const column of columns) {
      expect([...column].sort((a, b) => a - b)).toEqual(column);
    }
  });

  it("falls back to round-robin before the cards have been measured", () => {
    expect(packMasonryColumns([0, 0, 0, 0, 0], 2)).toEqual([
      [0, 2, 4],
      [1, 3],
    ]);
  });

  it("encodes homepage grid-of-columns ladder up to 5 tracks", () => {
    expect(playgroundShowcaseGridClassName).toContain("grid");
    expect(playgroundShowcaseGridClassName).toContain("md:grid-cols-2");
    expect(playgroundShowcaseGridClassName).toContain("lg:grid-cols-3");
    expect(playgroundShowcaseGridClassName).toContain(
      "min-[1400px]:grid-cols-4!",
    );
    expect(playgroundShowcaseGridClassName).toContain(
      "min-[1900px]:grid-cols-5!",
    );
    expect(playgroundShowcaseGridClassName).toContain("xl:max-w-[1600px]");
    expect(playgroundShowcaseGridClassName).toContain("2xl:max-w-[1900px]");
    expect(playgroundShowcaseGridClassName).not.toContain("columns-");
  });

  it("maps viewport widths to matching showcase column counts", () => {
    expect(getShowcaseColumnCount(375)).toBe(1);
    expect(getShowcaseColumnCount(768)).toBe(2);
    expect(getShowcaseColumnCount(1024)).toBe(3);
    expect(getShowcaseColumnCount(1399)).toBe(3);
    expect(getShowcaseColumnCount(1400)).toBe(4);
    expect(getShowcaseColumnCount(1899)).toBe(4);
    expect(getShowcaseColumnCount(1900)).toBe(5);
  });

  it("shows Typeset inline options above 1400px", () => {
    expect(playgroundDenseChromeShowClassName).toBe("min-[1400px]:hidden");
    expect(playgroundDenseChromeInlineClassName).toContain("min-[1400px]:flex");
  });
});

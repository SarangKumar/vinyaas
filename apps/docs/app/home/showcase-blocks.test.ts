import { describe, expect, it } from "vitest";

import { isNewComponent, newComponents } from "@/components/component-meta";

import {
  SHOWCASE_BLOCK_COUNT,
  distributeShowcaseBlocks,
  filterShowcaseBlocks,
  homepageExcludedNewComponents,
  showcaseBlockIds,
  showcaseBlocks,
  showcaseColumnWeights,
  showcaseComponentSlugs,
  showcaseComponentsAreValid,
} from "./showcase-blocks";

describe("homepage showcase blocks", () => {
  it("keeps exactly 32 showcase blocks as a product rule", () => {
    expect(SHOWCASE_BLOCK_COUNT).toBe(32);
    expect(showcaseBlocks).toHaveLength(32);
    expect(showcaseBlocks).toHaveLength(SHOWCASE_BLOCK_COUNT);
    expect(new Set(showcaseBlockIds()).size).toBe(SHOWCASE_BLOCK_COUNT);
  });

  it("references valid registry component slugs", () => {
    expect(showcaseComponentsAreValid()).toBe(true);
    expect(showcaseComponentSlugs()).toContain("resizable");
    expect(showcaseComponentSlugs()).toContain("drag-and-drop");
    expect(showcaseComponentSlugs()).toContain("button");
    expect(showcaseComponentSlugs()).not.toContain("sidebar");
    expect(showcaseComponentSlugs()).not.toContain("navigation-menu");
    expect(showcaseComponentSlugs()).not.toContain("");
  });

  it("prioritizes new v1.3.0 components in the showcase list", () => {
    const resizable = showcaseBlocks.find((block) => block.id === "resizable");
    const dragAndDrop = showcaseBlocks.find(
      (block) => block.id === "drag-and-drop",
    );
    expect(resizable).toBeTruthy();
    expect(resizable?.components).toContain("resizable");
    expect(dragAndDrop).toBeTruthy();
    expect(dragAndDrop?.components).toContain("drag-and-drop");
    expect(showcaseBlockIds()).not.toContain("signup");
    expect(showcaseBlockIds()).not.toContain("upload");
    expect(showcaseBlockIds()).not.toContain("account");
    expect(showcaseBlockIds()).not.toContain("sidebar");
    expect(showcaseBlockIds()).not.toContain("navigation-menu");
    expect(showcaseBlockIds()).toContain("pagination");
    expect(showcaseBlockIds()).toContain("data-table");
    expect(showcaseBlockIds()).toContain("alert-dialog");
    expect(showcaseBlockIds()).toContain("sheet");
    expect(showcaseBlockIds()).toContain("calendar");
    expect(showcaseBlockIds()).toContain("date-picker");
    expect(showcaseBlockIds()).toContain("combobox");
    expect(showcaseBlockIds()).toContain("empty-state");
    expect(showcaseBlockIds()).toContain("form");
    expect(showcaseBlockIds()).not.toContain("filter");
    expect(showcaseBlockIds()).not.toContain("project");
    expect(showcaseBlockIds()).not.toContain("notifications");
    expect(showcaseBlockIds()).not.toContain("invoice");
    expect(showcaseBlockIds()).not.toContain("messages");
    expect(showcaseBlockIds()).not.toContain("login");
    expect(showcaseBlockIds()).not.toContain("feedback");
    expect(showcaseBlockIds()).not.toContain("security");
    expect(showcaseBlockIds()).not.toContain("profile");

    const excluded = new Set<string>(homepageExcludedNewComponents);
    for (const component of newComponents()) {
      if (excluded.has(component.slug)) {
        continue;
      }
      expect(
        showcaseBlocks.some((block) =>
          block.components.includes(component.slug),
        ),
      ).toBe(true);
      expect(isNewComponent(component)).toBe(true);
    }
  });

  it("documents replacement policy by staying fixed-length when covering more primitives", () => {
    // v1.3.1: 32 real demos so 4-column desktops get 8 cards each.
    expect(showcaseBlockIds()).toContain("primitives");
    expect(showcaseBlockIds()).toContain("command");
    expect(showcaseBlockIds()).toContain("documents");
    expect(showcaseBlockIds()).toContain("activity");
    expect(showcaseBlockIds()).toContain("analytics");
    expect(showcaseBlockIds()).toContain("loading");
    expect(showcaseBlockIds()).toContain("media");
    expect(showcaseBlockIds()).toContain("contribution");
    expect(showcaseBlockIds()).toContain("channels");
    expect(showcaseBlockIds()).toContain("milestone");
    expect(showcaseBlockIds()).toContain("payment");
    expect(showcaseBlockIds()).toContain("connect-device");
    expect(showcaseBlockIds()).toContain("workspace-nav");
    expect(showcaseBlocks).toHaveLength(SHOWCASE_BLOCK_COUNT);
  });

  it("shows every showcase card when no filter is active", () => {
    expect(filterShowcaseBlocks(showcaseBlocks)).toHaveLength(
      SHOWCASE_BLOCK_COUNT,
    );
    expect(filterShowcaseBlocks(showcaseBlocks, "   ")).toHaveLength(
      SHOWCASE_BLOCK_COUNT,
    );
    expect(filterShowcaseBlocks(showcaseBlocks, null)).toHaveLength(
      SHOWCASE_BLOCK_COUNT,
    );

    const columns = distributeShowcaseBlocks(showcaseBlocks, 5);
    expect(columns).toHaveLength(5);
    expect(columns.flat()).toHaveLength(SHOWCASE_BLOCK_COUNT);
  });

  it("filters showcase cards when a query is active", () => {
    const filtered = filterShowcaseBlocks(showcaseBlocks, "select");
    expect(filtered.length).toBeGreaterThan(0);
    expect(filtered.length).toBeLessThan(SHOWCASE_BLOCK_COUNT);
    expect(
      filtered.every(
        (block) =>
          block.id.includes("select") || block.components.includes("select"),
      ),
    ).toBe(true);
  });

  it("returns an empty list when the filter matches nothing", () => {
    expect(filterShowcaseBlocks(showcaseBlocks, "zzz-no-match")).toEqual([]);
  });

  it("packs columns to similar heights instead of round-robin leftovers", () => {
    for (const columnCount of [2, 3, 4, 5] as const) {
      const columns = distributeShowcaseBlocks(showcaseBlocks, columnCount);
      expect(columns).toHaveLength(columnCount);
      expect(columns.flat()).toHaveLength(SHOWCASE_BLOCK_COUNT);

      const weights = showcaseColumnWeights(columns);
      const max = Math.max(...weights);
      const min = Math.min(...weights);
      // First-fit decreasing keeps columns within ~one medium card.
      expect(max - min).toBeLessThanOrEqual(3);
    }

    // 32 cards → exactly 8 per column at 4-up; weights stay within one tall card.
    const four = distributeShowcaseBlocks(showcaseBlocks, 4);
    const counts = four.map((column) => column.length);
    expect(counts).toEqual([8, 8, 8, 8]);
    const weights = showcaseColumnWeights(four);
    expect(Math.max(...weights) - Math.min(...weights)).toBeLessThanOrEqual(2);
  });
});

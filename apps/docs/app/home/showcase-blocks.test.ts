import { describe, expect, it } from "vitest";

import { isNewComponent, newComponents } from "@/components/component-meta";

import {
  SHOWCASE_BLOCK_COUNT,
  distributeShowcaseBlocks,
  filterShowcaseBlocks,
  showcaseBlockIds,
  showcaseBlocks,
  showcaseComponentSlugs,
  showcaseComponentsAreValid,
} from "./showcase-blocks";

describe("homepage showcase blocks", () => {
  it("keeps exactly 20 showcase blocks as a product rule", () => {
    expect(SHOWCASE_BLOCK_COUNT).toBe(20);
    expect(showcaseBlocks).toHaveLength(20);
    expect(showcaseBlocks).toHaveLength(SHOWCASE_BLOCK_COUNT);
    expect(new Set(showcaseBlockIds()).size).toBe(SHOWCASE_BLOCK_COUNT);
  });

  it("references valid registry component slugs", () => {
    expect(showcaseComponentsAreValid()).toBe(true);
    expect(showcaseComponentSlugs()).toContain("resizable");
    expect(showcaseComponentSlugs()).toContain("sidebar");
    expect(showcaseComponentSlugs()).toContain("drag-and-drop");
    expect(showcaseComponentSlugs()).toContain("button");
    expect(showcaseComponentSlugs()).not.toContain("");
  });

  it("prioritizes new v1.3.0 components in the showcase list", () => {
    const resizable = showcaseBlocks.find((block) => block.id === "resizable");
    const sidebar = showcaseBlocks.find((block) => block.id === "sidebar");
    const dragAndDrop = showcaseBlocks.find(
      (block) => block.id === "drag-and-drop",
    );
    expect(resizable).toBeTruthy();
    expect(resizable?.components).toContain("resizable");
    expect(sidebar).toBeTruthy();
    expect(sidebar?.components).toContain("sidebar");
    expect(dragAndDrop).toBeTruthy();
    expect(dragAndDrop?.components).toContain("drag-and-drop");
    expect(showcaseBlockIds()).not.toContain("signup");
    expect(showcaseBlockIds()).not.toContain("upload");
    expect(showcaseBlockIds()).not.toContain("account");
    expect(showcaseBlockIds()).toContain("pagination");
    expect(showcaseBlockIds()).toContain("data-table");
    expect(showcaseBlockIds()).not.toContain("project");

    for (const component of newComponents()) {
      expect(
        showcaseBlocks.some((block) =>
          block.components.includes(component.slug),
        ),
      ).toBe(true);
      expect(isNewComponent(component)).toBe(true);
    }
  });

  it("documents replacement policy by staying fixed-length when covering more primitives", () => {
    // Primitives + command were added for broader coverage without growing
    // past 20 — the list remains a fixed-length source of truth.
    expect(showcaseBlockIds()).toContain("primitives");
    expect(showcaseBlockIds()).toContain("command");
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
});

import { describe, expect, it } from "vitest";

import { isNewComponent, newComponents } from "@/components/component-meta";

import {
  SHOWCASE_BLOCK_COUNT,
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
    expect(showcaseComponentSlugs()).toContain("button");
    expect(showcaseComponentSlugs()).not.toContain("");
  });

  it("prioritizes new v1.3.0 components in the showcase list", () => {
    const resizable = showcaseBlocks.find((block) => block.id === "resizable");
    expect(resizable).toBeTruthy();
    expect(resizable?.components).toContain("resizable");

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
});

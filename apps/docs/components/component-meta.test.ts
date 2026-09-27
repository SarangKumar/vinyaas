import { describe, expect, it } from "vitest";

import { components, newComponents } from "./component-meta";

describe("component metadata", () => {
  it("lists each component once, in alphabetical order", () => {
    const names = components.map((component) => component.name);
    const slugs = components.map((component) => component.slug);

    expect(new Set(slugs).size).toBe(slugs.length);
    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)));
    expect(names).toEqual([
      "Avatar",
      "Button",
      "Checkbox",
      "Input",
      "Kbd",
      "Label",
      "Progress",
      "Radio Group",
      "Select",
      "Separator",
      "Skeleton",
      "Switch",
      "Textarea",
    ]);
  });

  it("keeps new components as a subset of the catalog", () => {
    const slugs = new Set(components.map((component) => component.slug));

    for (const component of newComponents()) {
      expect(slugs.has(component.slug)).toBe(true);
      expect(component.isNew).toBe(true);
    }

    expect(newComponents().map((component) => component.slug)).toEqual([
      "avatar",
      "checkbox",
      "kbd",
      "progress",
      "radio-group",
      "select",
      "separator",
      "skeleton",
      "switch",
    ]);
  });
});

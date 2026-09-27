import { describe, expect, it } from "vitest";

import {
  componentIsNew,
  components,
  currentVersion,
  newComponents,
} from "./component-meta";

describe("component metadata", () => {
  it("lists each component once, in alphabetical order", () => {
    const names = components.map((component) => component.name);
    const slugs = components.map((component) => component.slug);

    expect(new Set(slugs).size).toBe(slugs.length);
    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)));
    expect(names).toEqual([
      "Accordion",
      "Alert",
      "Avatar",
      "Badge",
      "Breadcrumb",
      "Button",
      "Card",
      "Checkbox",
      "Dialog",
      "Input",
      "Kbd",
      "Label",
      "Native Select",
      "Popover",
      "Progress",
      "Radio Group",
      "Scroll Area",
      "Separator",
      "Skeleton",
      "Spinner",
      "Switch",
      "Table",
      "Textarea",
      "Toast",
      "Tooltip",
    ]);
  });

  it("treats v0.2 introductions as new and keeps earlier components out", () => {
    expect(currentVersion).toBe("0.2");

    const slugs = new Set(components.map((component) => component.slug));

    for (const component of newComponents()) {
      expect(slugs.has(component.slug)).toBe(true);
      expect(component.introducedIn).toBe(currentVersion);
      expect(componentIsNew(component)).toBe(true);
    }

    expect(newComponents().map((component) => component.slug)).toEqual([
      "accordion",
      "alert",
      "avatar",
      "badge",
      "breadcrumb",
      "card",
      "checkbox",
      "dialog",
      "input",
      "kbd",
      "label",
      "native-select",
      "popover",
      "progress",
      "radio-group",
      "scroll-area",
      "separator",
      "skeleton",
      "spinner",
      "switch",
      "table",
      "textarea",
      "toast",
      "tooltip",
    ]);
    expect(newComponents().map((component) => component.slug)).not.toContain(
      "button",
    );
    expect(
      components
        .filter((component) => component.introducedIn === "0.1")
        .map((component) => component.slug),
    ).toEqual(["button"]);
  });
});

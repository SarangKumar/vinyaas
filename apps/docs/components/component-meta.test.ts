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
      "Aspect Ratio",
      "Attachment",
      "Avatar",
      "Badge",
      "Breadcrumb",
      "Button",
      "Card",
      "Checkbox",
      "Command",
      "Dialog",
      "Dropdown Menu",
      "File Upload",
      "Hover Card",
      "Input",
      "Input Group",
      "Input OTP",
      "Kbd",
      "Label",
      "Marker",
      "Native Select",
      "Popover",
      "Progress",
      "Radio Group",
      "Scroll Area",
      "Separator",
      "Skeleton",
      "Slider",
      "Spinner",
      "Switch",
      "Table",
      "Tabs",
      "Textarea",
      "Toast",
      "Tooltip",
      "Typography",
    ]);
  });

  it("treats v1.1.0 introductions as new and keeps earlier components out", () => {
    expect(currentVersion).toBe("1.1.0");

    const slugs = new Set(components.map((component) => component.slug));

    for (const component of newComponents()) {
      expect(slugs.has(component.slug)).toBe(true);
      expect(component.introducedIn).toBe(currentVersion);
      expect(componentIsNew(component)).toBe(true);
    }

    expect(
      newComponents()
        .map((component) => component.slug)
        .sort(),
    ).toEqual(["aspect-ratio", "attachment", "tabs"]);
    expect(newComponents().map((component) => component.slug)).not.toContain(
      "button",
    );
    expect(
      components
        .filter((component) => component.introducedIn === "0.1")
        .map((component) => component.slug),
    ).toEqual(["button"]);
    expect(
      components.filter((component) => component.introducedIn === "1.0.0")
        .length,
    ).toBe(components.length - 4);
  });
});

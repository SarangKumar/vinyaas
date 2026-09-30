import { describe, expect, it } from "vitest";

import { components, currentVersion } from "./component-meta";

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
      "Chart",
      "Checkbox",
      "Command",
      "Dialog",
      "Drawer",
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

  it("tracks introduction versions without marking a current new set", () => {
    expect(currentVersion).toBe("1.2.0");
    expect(
      components
        .filter((component) => component.introducedIn === "0.1")
        .map((component) => component.slug),
    ).toEqual(["button"]);
    expect(
      components
        .filter((component) => component.introducedIn === "1.1.0")
        .map((component) => component.slug)
        .sort(),
    ).toEqual(["aspect-ratio", "attachment", "chart", "drawer", "tabs"]);
    expect(
      components.filter((component) => component.introducedIn === "1.2.0"),
    ).toHaveLength(0);
    expect(
      components.filter((component) => component.introducedIn === "1.0.0")
        .length,
    ).toBe(components.length - 6);
  });
});

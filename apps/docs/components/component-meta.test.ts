import { describe, expect, it } from "vitest";

import {
  registryCategories,
  registryCategoryLabels,
  registryComponentCategories,
} from "@/registry/categories";

import {
  categoryOrder,
  components,
  componentsInCategory,
  currentVersion,
  isNewComponent,
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
      "Chart",
      "Checkbox",
      "Command",
      "Data Table",
      "Dialog",
      "Drag & Drop",
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
      "Pagination",
      "Popover",
      "Progress",
      "Radio Group",
      "Resizable",
      "Scroll Area",
      "Select",
      "Separator",
      "Sidebar",
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

  it("tracks introduction versions and derives the current new set", () => {
    expect(currentVersion).toBe("1.3.0");
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
      components
        .filter((component) => component.introducedIn === "1.3.0")
        .map((component) => component.slug)
        .sort(),
    ).toEqual([
      "data-table",
      "drag-and-drop",
      "pagination",
      "resizable",
      "select",
      "sidebar",
    ]);
    expect(
      components.filter((component) => component.introducedIn === "1.0.0")
        .length,
    ).toBe(components.length - 12);
    expect(
      newComponents()
        .map((component) => component.slug)
        .sort(),
    ).toEqual([
      "data-table",
      "drag-and-drop",
      "pagination",
      "resizable",
      "select",
      "sidebar",
    ]);
    expect(
      isNewComponent(
        components.find((component) => component.slug === "pagination")!,
      ),
    ).toBe(true);
    expect(
      isNewComponent(
        components.find((component) => component.slug === "resizable")!,
      ),
    ).toBe(true);
    expect(
      isNewComponent(
        components.find((component) => component.slug === "sidebar")!,
      ),
    ).toBe(true);
    expect(
      isNewComponent(
        components.find((component) => component.slug === "button")!,
      ),
    ).toBe(false);
  });

  it("derives docs categories from the registry category map", () => {
    for (const component of components) {
      expect(component.category).toBe(
        registryComponentCategories[component.slug],
      );
    }

    expect(categoryOrder).toEqual(
      registryCategories.map((id) => [id, registryCategoryLabels[id]] as const),
    );
    expect(componentsInCategory("forms").map((c) => c.slug)).toContain(
      "button",
    );
    expect(componentsInCategory("charts").map((c) => c.slug)).toEqual([
      "chart",
    ]);
  });
});

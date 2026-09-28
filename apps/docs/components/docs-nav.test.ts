import { describe, expect, it } from "vitest";

import { componentIsNew, components } from "./component-meta";
import {
  componentsJsonPath,
  docsNav,
  githubUrl,
  homePath,
  introductionPath,
} from "./docs-nav";

describe("documentation navigation", () => {
  it("lists introduction, components, get started, and changelog", () => {
    expect(githubUrl).toBe("https://github.com/SarangKumar/vinyaas");
    expect(homePath).toBe("/");
    expect(introductionPath).toBe("/introduction");
    expect(componentsJsonPath).toBe("/components-json");
    expect(docsNav.map((group) => group.title)).toEqual([
      "Introduction",
      "Components",
      "GET STARTED",
      "Changelog",
    ]);
    expect(docsNav[0]?.items).toEqual([
      { title: "Introduction", href: "/introduction", icon: "book" },
    ]);
    expect(docsNav[0]?.label).toBeUndefined();
    expect(docsNav[2]?.label).toBe(true);
    expect(docsNav[2]?.items.map((item) => item.title)).toEqual([
      "Installation",
      "components.json",
      "CLI",
    ]);
    expect(
      docsNav[2]?.items.find((item) => item.title === "components.json"),
    ).toEqual({
      title: "components.json",
      href: "/components-json",
      icon: "file",
    });
    expect(docsNav[3]?.items).toEqual([
      { title: "Changelog", href: "/changelog", icon: "book" },
    ]);
    expect(docsNav.some((group) => group.title === "Forms")).toBe(false);
    expect(docsNav.some((group) => group.title === "CLI")).toBe(false);
    expect(docsNav.some((group) => group.title === "Resources")).toBe(false);
  });

  it("builds one alphabetical component list without category icons", () => {
    const items = docsNav.find((group) => group.title === "Components")?.items;

    expect(items?.map((item) => item.title)).toEqual(
      [...components]
        .map((component) => component.name)
        .sort((a, b) => a.localeCompare(b)),
    );
    expect(items).toEqual(
      expect.arrayContaining(
        components.map((component) => ({
          title: component.name,
          href: `/components/${component.slug}`,
          description: component.description,
          isNew: componentIsNew(component),
        })),
      ),
    );
    expect(items?.every((item) => item.icon === undefined)).toBe(true);
  });
});

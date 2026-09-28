import { describe, expect, it } from "vitest";

import { componentIsNew, components } from "./component-meta";
import { docsNav, githubUrl, homePath, introductionPath } from "./docs-nav";

describe("documentation navigation", () => {
  it("points introduction and home at different routes", () => {
    expect(githubUrl).toBe("https://github.com/SarangKumar/vinyaas");
    expect(homePath).toBe("/");
    expect(introductionPath).toBe("/introduction");
    expect(docsNav[0]?.items?.[0]).toEqual({
      title: "Introduction",
      href: "/introduction",
      icon: "book",
    });
    expect(docsNav[0]?.items?.[1]).toEqual({
      title: "Installation",
      href: "/installation",
      icon: "terminal",
    });
    expect(docsNav[0]?.items?.[2]).toEqual({
      title: "Changelog",
      href: "/changelog",
      icon: "book",
    });
    expect(docsNav.map((group) => group.title)).toEqual([
      "Getting Started",
      "Components",
      "CLI",
      "Resources",
    ]);
  });

  it("builds the component sidebar from the shared catalog", () => {
    const sections = docsNav.find(
      (group) => group.title === "Components",
    )?.sections;

    expect(sections?.map((section) => section.title)).toEqual([
      "Forms",
      "Feedback",
      "Layout",
      "Navigation",
      "Data Display",
      "Overlays",
      "Utilities",
    ]);

    const items = sections?.flatMap((section) => section.items) ?? [];

    expect(items.map((item) => item.title).sort()).toEqual(
      components.map((component) => component.name).sort(),
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

    for (const section of sections ?? []) {
      const titles = section.items.map((item) => item.title);

      expect(titles).toEqual([...titles].sort((a, b) => a.localeCompare(b)));
      expect(section.icon).toBeTruthy();
    }
  });
});

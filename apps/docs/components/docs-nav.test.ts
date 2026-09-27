import { describe, expect, it } from "vitest";

import { components } from "./component-meta";
import { docsNav, githubUrl, homePath, introductionPath } from "./docs-nav";

describe("documentation navigation", () => {
  it("points introduction and home at different routes", () => {
    expect(githubUrl).toBe("https://github.com/SarangKumar/vinyaas");
    expect(homePath).toBe("/");
    expect(introductionPath).toBe("/introduction");
    expect(docsNav[0]?.items[0]).toEqual({
      title: "Introduction",
      href: "/introduction",
    });
    expect(docsNav[0]?.items[1]).toEqual({
      title: "Installation",
      href: "/installation",
    });
    expect(docsNav[0]?.items[2]).toEqual({
      title: "Changelog",
      href: "/changelog",
    });
  });

  it("builds the component sidebar from the shared catalog", () => {
    expect(
      docsNav.find((group) => group.title === "Components")?.items,
    ).toEqual(
      components.map((component) => ({
        title: component.name,
        href: `/components/${component.slug}`,
        description: component.description,
        isNew: component.isNew,
      })),
    );
  });
});

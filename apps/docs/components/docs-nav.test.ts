import { describe, expect, it } from "vitest";

import { componentIsNew, components } from "./component-meta";
import {
  componentsJsonPath,
  componentsPath,
  docsNav,
  githubUrl,
  homePath,
  introductionPath,
} from "./docs-nav";

describe("documentation navigation", () => {
  it("lists major pages before an alphabetical component list", () => {
    expect(githubUrl).toBe("https://github.com/SarangKumar/vinyaas");
    expect(homePath).toBe("/");
    expect(introductionPath).toBe("/introduction");
    expect(componentsPath).toBe("/components");
    expect(componentsJsonPath).toBe("/components-json");
    expect(docsNav.map((group) => group.title)).toEqual([
      "SECTIONS",
      "COMPONENTS",
    ]);
    expect(docsNav[0]?.label).toBe(true);
    expect(docsNav[0]?.items.map((item) => item.title)).toEqual([
      "Installation",
      "CLI",
    ]);
    expect(docsNav[0]?.items.map((item) => item.href)).toEqual([
      "/installation",
      "/installation#cli",
    ]);
    expect(docsNav[1]?.label).toBe(true);
    expect(docsNav.some((group) => group.title === "Forms")).toBe(false);
    expect(docsNav.some((group) => group.title === "Feedback")).toBe(false);
    expect(JSON.stringify(docsNav)).not.toContain('"icon"');
  });

  it("builds one alphabetical component list", () => {
    const items = docsNav.find((group) => group.title === "COMPONENTS")?.items;

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
  });
});

import { describe, expect, it } from "vitest";

import { components, newComponents } from "./component-meta";
import {
  cliPath,
  componentsJsonPath,
  componentsPath,
  docsNav,
  githubUrl,
  homePath,
  introductionPath,
} from "./docs-nav";

describe("documentation navigation", () => {
  it("lists sections, components, then get started", () => {
    expect(githubUrl).toBe("https://github.com/SarangKumar/vinyaas");
    expect(homePath).toBe("/");
    expect(introductionPath).toBe("/introduction");
    expect(componentsPath).toBe("/components");
    expect(componentsJsonPath).toBe("/components-json");
    expect(cliPath).toBe("/installation#cli");
    expect(docsNav.map((group) => group.title)).toEqual([
      "SECTIONS",
      "COMPONENTS",
      "GET STARTED",
    ]);
    expect(docsNav[0]?.items.map((item) => item.title)).toEqual([
      "Introduction",
      "Components",
      "Installation",
      "CLI",
    ]);
    expect(docsNav[0]?.items.map((item) => item.href)).toEqual([
      "/introduction",
      "/components",
      "/installation",
      "/installation#cli",
    ]);
    expect(docsNav[1]?.layout).toBe("names");
    expect(docsNav[2]?.items.map((item) => item.title)).toEqual([
      "Installation",
      "components.json",
      "CLI",
    ]);
    expect(docsNav[2]?.items.map((item) => item.href)).toEqual([
      "/installation",
      "/components-json",
      "/installation#cli",
    ]);
    expect(docsNav.some((group) => group.title === "Forms")).toBe(false);
    expect(JSON.stringify(docsNav)).not.toContain('"icon"');
  });

  it("builds one alphabetical component list", () => {
    const items = docsNav.find((group) => group.title === "COMPONENTS")?.items;

    expect(items?.map((item) => item.title)).toEqual(
      [...components]
        .map((component) => component.name)
        .sort((a, b) => a.localeCompare(b)),
    );
    expect(items?.some((item) => item.description)).toBe(false);
    expect(
      newComponents().some((component) => component.name === "Button"),
    ).toBe(false);
  });
});

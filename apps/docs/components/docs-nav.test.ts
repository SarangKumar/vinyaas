import { describe, expect, it } from "vitest";

import { components, newComponents } from "./component-meta";
import {
  cliPath,
  componentsJsonPath,
  componentsPath,
  docsNav,
  githubUrl,
  homePath,
  installationPath,
  introductionPath,
  themesPath,
  typesetPath,
} from "./docs-nav";

describe("documentation navigation", () => {
  it("lists components, then get started with nested installation guides", () => {
    expect(githubUrl).toBe("https://github.com/SarangKumar/vinyaas");
    expect(homePath).toBe("/");
    expect(introductionPath).toBe("/introduction");
    expect(componentsPath).toBe("/components");
    expect(componentsJsonPath).toBe("/components-json");
    expect(installationPath).toBe("/installation");
    expect(themesPath).toBe("/themes");
    expect(typesetPath).toBe("/typeset");
    expect(cliPath).toBe("/installation");
    expect(docsNav.map((group) => group.title)).toEqual([
      "COMPONENTS",
      "GET STARTED",
      "RESOURCES",
    ]);
    expect(docsNav[0]?.layout).toBe("names");

    const getStarted = docsNav[1]?.items;
    expect(getStarted?.map((item) => item.title)).toEqual([
      "Introduction",
      "Installation",
      "components.json",
      "CLI",
      "Themes",
      "Typeset",
    ]);
    expect(getStarted?.map((item) => item.href)).toEqual([
      "/introduction",
      "/installation",
      "/components-json",
      "/installation",
      "/themes",
      "/typeset",
    ]);

    const installation = getStarted?.find(
      (item) => item.title === "Installation",
    );
    expect(installation?.children?.map((item) => item.title)).toEqual([
      "Next.js",
      "React + Vite",
      "React",
    ]);
    expect(installation?.children?.map((item) => item.href)).toEqual([
      "/installation/nextjs",
      "/installation/vite",
      "/installation/react",
    ]);

    expect(docsNav[2]?.items.map((item) => item.title)).toEqual(["Changelog"]);
    expect(docsNav[2]?.items.map((item) => item.href)).toEqual(["/changelog"]);
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

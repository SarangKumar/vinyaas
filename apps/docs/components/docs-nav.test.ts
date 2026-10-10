import { describe, expect, it } from "vitest";

import { components } from "./component-meta";
import {
  accessibilityPath,
  catalogsPath,
  changelogPath,
  cliPath,
  companionAnimationsPath,
  companionCustomPath,
  companionExamplesPath,
  companionGalleryPath,
  companionInstallationPath,
  companionInteractionsPath,
  companionJsonPath,
  companionPath,
  componentsJsonPath,
  componentsPath,
  darkModePath,
  docsNav,
  githubUrl,
  homePath,
  installationPath,
  introductionPath,
  packageImportPath,
  themesPath,
  themingPath,
  typesetPath,
  typesetPlaygroundPath,
} from "./docs-nav";

describe("documentation navigation", () => {
  it("keeps a flat sidebar with onboarding-first chronological order", () => {
    expect(githubUrl).toBe("https://github.com/SarangKumar/vinyaas");
    expect(homePath).toBe("/");
    expect(introductionPath).toBe("/introduction");
    expect(componentsPath).toBe("/components");
    expect(componentsJsonPath).toBe("/components-json");
    expect(installationPath).toBe("/installation");
    expect(cliPath).toBe("/cli");
    expect(catalogsPath).toBe("/catalogs");
    expect(accessibilityPath).toBe("/accessibility");
    expect(companionPath).toBe("/companion");
    expect(companionInstallationPath).toBe("/companion/installation");
    expect(companionJsonPath).toBe("/companion/configuration");
    expect(companionCustomPath).toBe("/companion/custom");
    expect(companionAnimationsPath).toBe("/companion/animations");
    expect(companionInteractionsPath).toBe("/companion/interactions");
    expect(companionExamplesPath).toBe("/companion/examples");
    expect(companionGalleryPath).toBe("/companion/gallery");
    expect(themingPath).toBe("/theming");
    expect(themesPath).toBe("/themes");
    expect(typesetPath).toBe("/typeset");
    expect(typesetPlaygroundPath).toBe("/typeset/playground");
    expect(packageImportPath).toBe("/package-import");
    expect(darkModePath).toBe("/dark-mode");
    expect(changelogPath).toBe("/changelog");
    expect(docsNav.map((group) => group.title)).toEqual([
      "GET STARTED",
      "SECTIONS",
      "COMPONENTS",
      "COMPANION",
    ]);
    expect(docsNav[2]?.layout).toBe("names");

    const getStarted = docsNav[0]?.items;
    expect(getStarted?.map((item) => item.title)).toEqual([
      "Installation",
      "components.json",
      "Dark Mode",
      "Theming",
      "Typeset",
      "Package Import",
      "CLI",
      "llm.txt",
    ]);
    expect(getStarted?.every((item) => !item.children?.length)).toBe(true);

    const sections = docsNav[1]?.items;
    expect(sections?.map((item) => item.title)).toEqual([
      "Home",
      "Introduction",
      "Components",
      "Catalogs",
      "Accessibility",
      "Changelog",
    ]);
    expect(sections?.[0]?.href).toBe("/");
    expect(sections?.at(-1)?.title).toBe("Changelog");
    expect(sections?.every((item) => !item.children?.length)).toBe(true);

    const companion = docsNav[3];
    expect(companion?.badge).toBe("Beta");
    expect(companion?.items[0]?.indicator).toBeUndefined();
    expect(companion?.items.map((item) => item.title)).toEqual([
      "Introduction",
      "Installation",
      "companion.json",
      "Animations",
      "Interactions",
      "Custom Companion",
      "Examples",
      "Gallery",
    ]);
    expect(companion?.items.map((item) => item.href)).toEqual([
      "/companion",
      "/companion/installation",
      "/companion/configuration",
      "/companion/animations",
      "/companion/interactions",
      "/companion/custom",
      "/companion/examples",
      "/companion/gallery",
    ]);
    expect(companion?.items.every((item) => !item.children?.length)).toBe(true);

    expect(JSON.stringify(docsNav)).not.toContain("/installation/nextjs");
    expect(JSON.stringify(docsNav)).not.toContain("/themes");
    expect(JSON.stringify(docsNav)).not.toContain("/typeset/playground");
    expect(JSON.stringify(docsNav)).not.toContain('"isNew"');
    expect(JSON.stringify(docsNav)).not.toContain('"icon"');
  });

  it("builds one alphabetical component list with new indicators from metadata", () => {
    const items = docsNav.find((group) => group.title === "COMPONENTS")?.items;

    expect(items?.map((item) => item.title)).toEqual(
      [...components]
        .map((component) => component.name)
        .sort((a, b) => a.localeCompare(b)),
    );
    expect(items?.some((item) => item.title === "Typography")).toBe(true);
    expect(items?.every((item) => !("isNew" in item))).toBe(true);
    expect(items?.find((item) => item.title === "Toggle")?.indicator).toBe(
      "new",
    );
    expect(
      items?.find((item) => item.title === "Button")?.indicator,
    ).toBeUndefined();
    expect(
      items
        ?.filter((item) => item.indicator === "new")
        .map((item) => item.title),
    ).toEqual(["Score Ring", "Toggle", "Toggle Group"]);
    expect(
      items?.find((item) => item.title === "Select")?.indicator,
    ).toBeUndefined();
    expect(
      items?.find((item) => item.title === "Sidebar")?.indicator,
    ).toBeUndefined();
    expect(
      items?.find((item) => item.title === "Drag & Drop")?.indicator,
    ).toBeUndefined();
  });

  it("marks the Companion section as Beta and leaves its Introduction link without a dot", () => {
    const group = docsNav.find((entry) => entry.title === "COMPANION");

    expect(group?.badge).toBe("Beta");
    expect(group?.items[0]?.indicator).toBeUndefined();
  });
});

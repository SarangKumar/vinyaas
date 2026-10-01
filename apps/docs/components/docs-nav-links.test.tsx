import { render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { components } from "./component-meta";
import { DocsNavLinks } from "./docs-nav-links";

vi.mock("next/navigation", () => ({
  usePathname: () => "/components/input",
}));

describe("DocsNavLinks", () => {
  it("follows the flat documentation hierarchy without framework nesting", () => {
    render(<DocsNavLinks />);

    const nav = screen.getByRole("navigation", { name: "Documentation" });
    const links = within(nav).getAllByRole("link");
    const titles = links.map((link) => link.textContent ?? "");
    const componentNames = [...components]
      .map((component) => component.name)
      .sort((a, b) => a.localeCompare(b));

    expect(within(nav).getByText("SECTIONS")).toBeInTheDocument();
    expect(within(nav).getByText("COMPANION")).toBeInTheDocument();
    expect(within(nav).getByText("COMPONENTS")).toBeInTheDocument();
    expect(within(nav).getByText("GET STARTED")).toBeInTheDocument();
    expect(within(nav).queryByText("RESOURCES")).toBeNull();
    expect(within(nav).queryByRole("link", { name: "Next.js" })).toBeNull();
    expect(
      within(nav).queryByRole("link", { name: "React + Vite" }),
    ).toBeNull();

    const sectionsStart = titles.indexOf("Introduction");
    expect(titles.slice(sectionsStart, sectionsStart + 7)).toEqual([
      "Introduction",
      "Components",
      "Installation",
      "CLI",
      "Theming",
      "Typeset",
      "Changelog",
    ]);

    const companionStart = titles.indexOf("Changelog") + 1;
    expect(titles.slice(companionStart, companionStart + 4)).toEqual([
      "Introduction",
      "Installation",
      "companion.json",
      "Custom Companion",
    ]);
    expect(
      within(nav).getAllByRole("link", { name: "Introduction" })[1],
    ).toHaveAttribute("href", "/companion");
    expect(
      within(nav).getAllByRole("link", { name: "Installation" })[1],
    ).toHaveAttribute("href", "/companion/installation");
    expect(
      within(nav).getByRole("link", { name: "companion.json" }),
    ).toHaveAttribute("href", "/companion/configuration");
    expect(
      within(nav).getByRole("link", { name: "Custom Companion" }),
    ).toHaveAttribute("href", "/companion/custom");

    const componentsStart = titles.indexOf(componentNames[0]!);
    expect(
      titles.slice(componentsStart, componentsStart + componentNames.length),
    ).toEqual(componentNames);

    expect(
      within(nav).getAllByRole("link", { name: "Installation" })[0],
    ).toHaveAttribute("href", "/installation");
    expect(
      within(nav).getAllByRole("link", { name: "CLI" })[0],
    ).toHaveAttribute("href", "/cli");
    expect(
      within(nav).getAllByRole("link", { name: "Theming" })[0],
    ).toHaveAttribute("href", "/theming");
    expect(
      within(nav).getAllByRole("link", { name: "Typeset" })[0],
    ).toHaveAttribute("href", "/typeset");
    expect(
      within(nav).getByRole("link", { name: "Dark Mode" }),
    ).toHaveAttribute("href", "/dark-mode");
    expect(
      within(nav).getByRole("link", { name: "Package Import" }),
    ).toHaveAttribute("href", "/package-import");
    expect(
      within(nav).getByRole("link", { name: "Typography" }),
    ).toHaveAttribute("href", "/components/typography");
    expect(within(nav).getByRole("link", { name: "Tabs" })).toHaveAttribute(
      "href",
      "/components/tabs",
    );
    expect(within(nav).queryByText(", new")).toBeNull();
    expect(nav.querySelector(".bg-primary")).toBeNull();
    expect(within(nav).getByRole("link", { name: "Input" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(
      within(nav).getByRole("link", { name: "Button" }),
    ).not.toHaveAttribute("aria-current");
  });
});

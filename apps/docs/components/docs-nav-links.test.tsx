import { render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { components } from "./component-meta";
import { DocsNavLinks } from "./docs-nav-links";

vi.mock("next/navigation", () => ({
  usePathname: () => "/components/input",
}));

describe("DocsNavLinks", () => {
  it("follows the documentation hierarchy without new-component markers", () => {
    render(<DocsNavLinks />);

    const nav = screen.getByRole("navigation", { name: "Documentation" });
    const links = within(nav).getAllByRole("link");
    const titles = links.map((link) => link.textContent ?? "");
    const componentNames = [...components]
      .map((component) => component.name)
      .sort((a, b) => a.localeCompare(b));

    expect(titles.slice(0, componentNames.length)).toEqual(componentNames);
    expect(within(nav).getByRole("link", { name: "Next.js" })).toHaveAttribute(
      "href",
      "/installation/nextjs",
    );
    expect(
      within(nav).getByRole("link", { name: "React + Vite" }),
    ).toHaveAttribute("href", "/installation/vite");
    expect(within(nav).getByRole("link", { name: "React" })).toHaveAttribute(
      "href",
      "/installation/react",
    );
    expect(
      within(nav).getByRole("link", { name: "Installation" }),
    ).toHaveAttribute("href", "/installation");
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

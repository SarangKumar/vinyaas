import { render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { components } from "./component-meta";
import { DocsNavLinks } from "./docs-nav-links";

vi.mock("next/navigation", () => ({
  usePathname: () => "/components/input",
}));

describe("DocsNavLinks", () => {
  it("follows the documentation hierarchy without navigation icons", () => {
    render(<DocsNavLinks />);

    const nav = screen.getByRole("navigation", { name: "Documentation" });
    const links = within(nav).getAllByRole("link");
    const titles = links.map((link) =>
      (link.getAttribute("aria-label") ?? link.textContent ?? "").replace(
        /, new$/,
        "",
      ),
    );
    const componentNames = [...components]
      .map((component) => component.name)
      .sort((a, b) => a.localeCompare(b));

    expect(titles[0]).toBe("Introduction");
    expect(
      within(nav).getAllByRole("link", { name: "Introduction" }),
    ).toHaveLength(1);
    expect(within(nav).getByText("Components")).toBeInTheDocument();
    expect(titles.slice(1, 1 + componentNames.length)).toEqual(componentNames);
    expect(within(nav).queryByText("Forms")).toBeNull();
    expect(within(nav).queryByText("Feedback")).toBeNull();
    expect(within(nav).queryByText("Data Display")).toBeNull();
    expect(within(nav).getByText("Get Started")).toBeInTheDocument();
    expect(titles.at(-4)).toBe("Installation");
    expect(titles.at(-3)).toBe("components.json");
    expect(titles.at(-2)).toBe("CLI");
    expect(within(nav).getByText("Resources")).toBeInTheDocument();
    expect(titles.at(-1)).toBe("Changelog");
    expect(nav.querySelector("svg")).toBeNull();
    expect(
      within(nav).getByRole("link", { name: "Input, new" }),
    ).toHaveAttribute("aria-current", "page");
    expect(
      within(nav).getByRole("link", { name: "Button" }),
    ).not.toHaveAttribute("aria-current");
  });
});

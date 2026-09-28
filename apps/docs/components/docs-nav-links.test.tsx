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

    expect(titles[0]).toBe("Installation");
    expect(titles[1]).toBe("CLI");
    expect(titles.slice(2)).toEqual(componentNames);
    expect(within(nav).getByText("SECTIONS")).toBeInTheDocument();
    expect(within(nav).getByText("COMPONENTS")).toBeInTheDocument();
    expect(within(nav).queryByText("Forms")).toBeNull();
    expect(within(nav).queryByText("Feedback")).toBeNull();
    expect(within(nav).queryByText("Data Display")).toBeNull();
    expect(within(nav).queryByText("Get Started")).toBeNull();
    expect(nav.querySelector("svg")).toBeNull();
    expect(
      within(nav).getByRole("link", { name: "Input, new" }),
    ).toHaveAttribute("aria-current", "page");
    expect(
      within(nav).getByRole("link", { name: "Button" }),
    ).not.toHaveAttribute("aria-current");
  });
});

import { render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { components } from "./component-meta";
import { DocsNavLinks } from "./docs-nav-links";

vi.mock("next/navigation", () => ({
  usePathname: () => "/components/input",
}));

describe("DocsNavLinks", () => {
  it("follows the documentation hierarchy with nested installation guides", () => {
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
    expect(within(nav).getByRole("link", { name: "CLI" })).toHaveAttribute(
      "href",
      "/installation",
    );
    expect(within(nav).getByText("COMPONENTS")).toBeInTheDocument();
    expect(within(nav).getByText("GET STARTED")).toBeInTheDocument();
    expect(within(nav).getByText("RESOURCES")).toBeInTheDocument();
    expect(within(nav).queryByText("SECTIONS")).toBeNull();
    expect(
      within(nav).getByRole("link", { name: "Changelog" }),
    ).toHaveAttribute("href", "/changelog");
    expect(within(nav).getByRole("link", { name: "Themes" })).toHaveAttribute(
      "href",
      "/themes",
    );
    expect(within(nav).getByRole("link", { name: "Typeset" })).toHaveAttribute(
      "href",
      "/typeset",
    );
    expect(within(nav).queryByText("Forms")).toBeNull();
    expect(
      within(nav).getByText("COMPONENTS").parentElement?.querySelector("ul"),
    ).toHaveClass(
      "grid",
      "grid-cols-1",
      "@[22rem]:grid-cols-2",
      "@[40rem]:grid-cols-3",
    );
    expect(within(nav).getByRole("link", { name: "Input" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(
      within(nav).getByRole("link", { name: "Tabs, new" }),
    ).toHaveAttribute("href", "/components/tabs");
    expect(
      within(nav)
        .getByRole("link", { name: "Tabs, new" })
        .querySelector(".bg-primary"),
    ).toBeTruthy();
    expect(
      within(nav).getByRole("link", { name: "Button" }),
    ).not.toHaveAttribute("aria-current");
  });
});

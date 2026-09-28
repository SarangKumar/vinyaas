import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { DocsMobileNav } from "./docs-mobile-nav";

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
  useRouter: () => ({ push: vi.fn() }),
}));

describe("DocsMobileNav", () => {
  it("names the menu and closes it with Escape", () => {
    render(<DocsMobileNav />);

    const menu = screen.getByRole("button", { name: "Menu" });

    expect(menu).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByText("Forms")).toBeNull();

    fireEvent.click(menu);

    expect(menu).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("link", { name: "Docs" })).toHaveAttribute(
      "href",
      "/introduction",
    );
    expect(
      screen.getAllByRole("link", { name: "Components" })[0],
    ).toHaveAttribute("href", "/components");
    expect(
      screen.getAllByRole("link", { name: "Installation" }).length,
    ).toBeGreaterThan(0);
    expect(screen.getAllByRole("link", { name: "CLI" }).length).toBeGreaterThan(
      0,
    );
    expect(screen.getByText("SECTIONS")).toBeInTheDocument();
    expect(screen.getByText("COMPONENTS")).toBeInTheDocument();
    expect(screen.getByText("GET STARTED")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Introduction" })).toHaveAttribute(
      "href",
      "/introduction",
    );
    expect(screen.queryByText("Forms")).toBeNull();

    fireEvent.keyDown(document, { key: "Escape" });

    expect(menu).toHaveAttribute("aria-expanded", "false");
  });
});

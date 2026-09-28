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
    expect(
      screen.getByRole("link", { name: "Introduction" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Installation" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Changelog" })).toBeInTheDocument();

    fireEvent.keyDown(document, { key: "Escape" });

    expect(menu).toHaveAttribute("aria-expanded", "false");
  });
});

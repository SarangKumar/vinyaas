import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { DocsMobileNav } from "./docs-mobile-nav";

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

describe("DocsMobileNav", () => {
  it("names the menu and closes it with Escape", () => {
    render(<DocsMobileNav />);

    const menu = screen.getByText("Menu");
    const details = menu.closest("details");

    if (!details) {
      throw new Error("Expected the menu disclosure");
    }

    details.open = true;
    fireEvent.keyDown(details, { key: "Escape" });

    expect(menu.tagName).toBe("SUMMARY");
    expect(details.open).toBe(false);
  });
});

import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { DocsNavLinks } from "./docs-nav-links";

vi.mock("next/navigation", () => ({
  usePathname: () => "/components/input",
}));

describe("DocsNavLinks", () => {
  it("marks the current page and exposes the documentation links", () => {
    render(<DocsNavLinks />);

    expect(
      screen.getByRole("navigation", { name: "Documentation" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Input, new" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getByRole("link", { name: "Button" })).not.toHaveAttribute(
      "aria-current",
    );
    expect(screen.getByRole("link", { name: "Introduction" })).toHaveAttribute(
      "href",
      "/introduction",
    );
    expect(screen.getByRole("link", { name: "Installation" })).toHaveClass(
      "text-sidebar-foreground",
    );
  });
});

import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { TableOfContents } from "./table-of-contents";

vi.mock("next/navigation", () => ({
  usePathname: () => "/components/input",
}));

describe("TableOfContents", () => {
  it("scrolls the center article to the selected heading", async () => {
    const scrollTo = vi.fn();

    render(
      <div>
        <main id="docs-content">
          <h2 id="usage">Usage</h2>
        </main>
        <TableOfContents />
      </div>,
    );

    const link = await screen.findByRole("link", { name: "Usage" });
    const scroller = document.getElementById("docs-content");

    if (!scroller) {
      throw new Error("Expected the article scroller");
    }

    scroller.scrollTo = scrollTo;
    fireEvent.click(link);

    expect(link).toHaveAttribute("href", "#usage");
    expect(scrollTo).toHaveBeenCalledWith({
      top: 0,
      behavior: "auto",
    });
    expect(window.location.hash).toBe("#usage");
  });
});

import { render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { DocsShell } from "./docs-shell";

vi.mock("next/navigation", () => ({
  usePathname: () => "/components/button",
}));

describe("DocsShell", () => {
  it("keeps the current page marked and lists article headings", async () => {
    render(
      <DocsShell>
        <article>
          <h2 id="preview">Preview</h2>
          <h2 id="installation">Installation</h2>
          <h3 id="notes">Notes</h3>
        </article>
      </DocsShell>,
    );

    const current = screen.getAllByRole("link", { name: "Button" });

    expect(current.length).toBeGreaterThan(0);
    for (const link of current) {
      expect(link).toHaveAttribute("aria-current", "page");
    }
    expect(
      screen.getAllByRole("navigation", { name: "Documentation" }).length,
    ).toBeGreaterThan(0);
    const onThisPage = await screen.findByRole("navigation", {
      name: "On this page",
    });

    expect(screen.getByRole("link", { name: "Preview" })).toHaveAttribute(
      "href",
      "#preview",
    );
    expect(
      within(onThisPage).getByRole("link", { name: "Installation" }),
    ).toHaveAttribute("href", "#installation");
    expect(
      within(onThisPage).getByRole("link", { name: "Notes" }),
    ).toHaveAttribute("href", "#notes");
    expect(screen.getByRole("link", { name: "GitHub" })).toHaveAttribute(
      "href",
      "https://github.com/SarangKumar/vinyaas",
    );
  });
});

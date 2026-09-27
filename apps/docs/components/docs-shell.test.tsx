import { render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

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
    const start = document.querySelector("[data-header-section='start']");
    const end = document.querySelector("[data-header-section='end']");

    if (!(start instanceof HTMLElement) || !(end instanceof HTMLElement)) {
      throw new Error("Expected header sections");
    }

    expect(
      within(start).getByRole("link", { name: "Vinyaas" }),
    ).toHaveAttribute("href", "/");
    expect(within(start).getByRole("link", { name: "Docs" })).toHaveAttribute(
      "href",
      "/introduction",
    );
    expect(
      within(start).getByRole("link", { name: "Components" }),
    ).toHaveAttribute("href", "/components");
    expect(
      within(start).queryByRole("link", { name: "GitHub" }),
    ).not.toBeInTheDocument();

    const github = within(end).getByRole("link", { name: "GitHub" });

    expect(github).toHaveAttribute(
      "href",
      "https://github.com/SarangKumar/vinyaas",
    );
    expect(github).toHaveAttribute("title", "GitHub");
    expect(github).not.toHaveTextContent("GitHub");
    expect(within(end).getByRole("button")).toBeInTheDocument();
  });

  it("links to the portfolio when the environment variable is a web url", () => {
    vi.stubEnv("NEXT_PUBLIC_PORTFOLIO_URL", "https://sarangkumar.vercel.app");

    render(
      <DocsShell>
        <article>
          <h2 id="preview">Preview</h2>
        </article>
      </DocsShell>,
    );

    const portfolio = screen.getByRole("link", { name: "Portfolio" });

    expect(portfolio).toHaveAttribute(
      "href",
      "https://sarangkumar.vercel.app/",
    );
    expect(portfolio).toHaveAttribute("target", "_blank");
    expect(
      document.querySelector("[data-header-section='end']"),
    ).toContainElement(portfolio);
  });
});

afterEach(() => {
  vi.unstubAllEnvs();
});

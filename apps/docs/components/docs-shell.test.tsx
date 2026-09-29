import { fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { DocsShell } from "./docs-shell";

const navigation = vi.hoisted(() => ({
  pathname: "/components/button",
}));

vi.mock("next/navigation", () => ({
  usePathname: () => navigation.pathname,
  useRouter: () => ({ push: vi.fn() }),
}));

describe("DocsShell", () => {
  beforeEach(() => {
    navigation.pathname = "/components/button";
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));
  });

  it("hides the docs sidebars on the homepage", () => {
    navigation.pathname = "/";

    render(
      <DocsShell>
        <h1>Build with Vinyaas</h1>
      </DocsShell>,
    );

    expect(document.querySelector("[data-docs-frame]")).toHaveAttribute(
      "data-docs-frame",
      "home",
    );
    expect(
      screen.queryByRole("navigation", { name: "Documentation" }),
    ).toBeNull();
    expect(
      screen.queryByRole("navigation", { name: "On this page" }),
    ).toBeNull();
    expect(
      screen.getByRole("heading", { name: "Build with Vinyaas" }),
    ).toBeInTheDocument();
  });

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

    expect(
      await within(onThisPage).findByRole("link", { name: "Preview" }),
    ).toHaveAttribute("href", "#preview");
    expect(
      await within(onThisPage).findByRole("link", { name: "Installation" }),
    ).toHaveAttribute("href", "#installation");
    expect(
      await within(onThisPage).findByRole("link", { name: "Notes" }),
    ).toHaveAttribute("href", "#notes");
    const start = document.querySelector("[data-header-section='start']");
    const end = document.querySelector("[data-header-section='end']");

    if (!(start instanceof HTMLElement) || !(end instanceof HTMLElement)) {
      throw new Error("Expected header sections");
    }

    expect(
      within(start).getByRole("link", { name: "Vinyaas" }),
    ).toHaveAttribute("href", "/");
    expect(within(start).getByRole("button", { name: "Menu" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
    expect(within(start).getByRole("link", { name: "Docs" })).toHaveAttribute(
      "href",
      "/introduction",
    );
    expect(
      within(start).getByRole("link", { name: "Components" }),
    ).toHaveAttribute("href", "/components");
    expect(
      within(start).queryByRole("button", { name: "Search documentation" }),
    ).toBeNull();
    expect(within(start).queryByRole("link", { name: "GitHub" })).toBeNull();
    fireEvent.click(within(start).getByRole("button", { name: "Menu" }));
    expect(within(start).getByRole("button", { name: "Menu" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    expect(
      screen.getByRole("dialog", { name: "Navigation" }),
    ).toBeInTheDocument();
    expect(
      within(screen.getByRole("dialog", { name: "Navigation" })).getByRole(
        "link",
        { name: "GitHub" },
      ),
    ).toBeInTheDocument();

    const github = within(end).getByRole("link", { name: "GitHub" });

    expect(github).toHaveAttribute(
      "href",
      "https://github.com/SarangKumar/vinyaas",
    );
    expect(github).toHaveAttribute("title", "GitHub");
    expect(github).not.toHaveTextContent("GitHub");
    expect(github.querySelector("svg")).toBeInTheDocument();
    expect(end.className).toContain("lg:gap-4");
    expect(document.querySelector("header")).toHaveClass(
      "h-12",
      "relative",
      "z-30",
    );
    expect(document.querySelector("header")).not.toHaveClass("sticky");
    expect(document.querySelector("[data-docs-sidebar]")).toHaveClass(
      "relative",
      "z-0",
    );
    expect(
      within(end).getAllByRole("button", { name: "Search documentation" })
        .length,
    ).toBeGreaterThan(0);
    expect(start.className).toContain("shrink-0");
    expect(screen.queryByText("Forms")).toBeNull();
    expect(screen.queryByText("Data Display")).toBeNull();
    expect(
      within(end).queryByRole("combobox", {
        name: "Component example language",
      }),
    ).toBeNull();
    expect(
      within(end).getByRole("button", {
        name: /color theme|dark mode|light mode/,
      }),
    ).toBeInTheDocument();
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

    const portfolio = within(
      document.querySelector("[data-header-section='end']") as HTMLElement,
    ).getByRole("link", { name: "Portfolio" });

    expect(portfolio).toHaveAttribute(
      "href",
      "https://sarangkumar.vercel.app/",
    );
    expect(portfolio).toHaveAttribute("target", "_blank");
    expect(
      document.querySelector("[data-header-section='end']"),
    ).toContainElement(portfolio);
  });

  it("shows the GitHub star count when the public API responds", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ stargazers_count: 12 }),
      }),
    );

    render(
      <DocsShell>
        <article>
          <h2 id="preview">Preview</h2>
        </article>
      </DocsShell>,
    );

    const github = within(
      document.querySelector("[data-header-section='end']") as HTMLElement,
    ).getByRole("link", { name: "GitHub" });

    expect(await screen.findAllByText("12")).not.toHaveLength(0);
    expect(github).toHaveAccessibleName("GitHub");
    expect(github.querySelector("svg")).toBeInTheDocument();
  });

  it("hides the star count when GitHub is unavailable", async () => {
    render(
      <DocsShell>
        <article>
          <h2 id="preview">Preview</h2>
        </article>
      </DocsShell>,
    );

    const github = within(
      document.querySelector("[data-header-section='end']") as HTMLElement,
    ).getByRole("link", { name: "GitHub" });

    await vi.waitFor(() => {
      expect(fetch).toHaveBeenCalled();
    });
    expect(github.querySelector("span")).toBeNull();
  });
});

afterEach(() => {
  vi.unstubAllEnvs();
});

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
    expect(document.querySelector("[data-docs-feature-card]")).toBeTruthy();
    expect(
      document.querySelector("[data-docs-feature-card]")?.textContent,
    ).toContain("What's new");
    expect(
      document.querySelector("[data-docs-feature-card]")?.textContent,
    ).toMatch(/Toggle|Score Ring/);
    expect(
      document.querySelector("[data-docs-feature-card]")?.textContent,
    ).not.toMatch(/Resizable|Sidebar|Flint/);
    expect(
      document.querySelector("[data-docs-feature-card]")?.textContent,
    ).toContain("View changelog");
    expect(document.querySelector("[data-docs-feature-card] ul")).toBeNull();
    expect(document.querySelector("[data-docs-page-feedback]")).toBeNull();
    const startHeader = document.querySelector(
      "[data-header-section='start']",
    ) as HTMLElement;
    const homeNav = within(startHeader).getByRole("link", { name: "Home" });
    expect(homeNav.className).toContain("text-foreground");
    expect(homeNav).toHaveAttribute("href", "/");
    // The navbar has no logo mark; Home is the link to the homepage.
    expect(
      within(startHeader).queryByRole("link", { name: "Vinyaas home" }),
    ).toBeNull();
    expect(
      within(startHeader).queryByRole("img", { name: "Vinyaas" }),
    ).toBeNull();
    const docsSidebarLink = screen.getAllByRole("link", { name: "Button" })[0]!;
    expect(docsSidebarLink.className).toMatch(/text-foreground/);
    const start = document.querySelector("[data-header-section='start']");
    const end = document.querySelector("[data-header-section='end']");

    if (!(start instanceof HTMLElement) || !(end instanceof HTMLElement)) {
      throw new Error("Expected header sections");
    }

    expect(within(start).getByRole("link", { name: "Home" })).toHaveAttribute(
      "href",
      "/",
    );
    expect(within(start).getByRole("button", { name: "Menu" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
    expect(
      within(start)
        .getByRole("button", { name: "Menu" })
        .querySelector("[data-menu-icon]"),
    ).toHaveAttribute("data-state", "closed");
    expect(within(start).getByRole("link", { name: "Docs" })).toHaveAttribute(
      "href",
      "/introduction",
    );
    expect(
      within(start).getByRole("link", { name: "Components" }),
    ).toHaveAttribute("href", "/components");
    expect(
      within(start).getByRole("link", { name: "Companion" }),
    ).toHaveAttribute("href", "/companion");
    expect(
      within(start)
        .getByRole("link", { name: "Companion" })
        .querySelector('[data-nav-indicator="beta"]'),
    ).toBeNull();
    expect(
      within(start).getByRole("link", { name: "Installation" }),
    ).toHaveAttribute("href", "/installation");
    expect(within(start).getByRole("link", { name: "Themes" })).toHaveAttribute(
      "href",
      "/themes",
    );
    expect(
      within(start).getByRole("link", { name: "Typeset" }),
    ).toHaveAttribute("href", "/typeset/playground");
    expect(within(start).getByRole("link", { name: "Docs" })).toHaveClass(
      "hidden",
      "lg:inline-flex",
    );
    expect(
      within(start).getByRole("button", { name: "Menu" }).parentElement,
    ).toHaveClass("lg:hidden");
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

    expect(document.querySelector('[data-github-link="compact"]')).toBeTruthy();
    expect(document.querySelector('[data-github-link="default"]')).toBeTruthy();

    const github = within(end).getAllByRole("link", { name: /GitHub/i })[0]!;

    expect(github).toHaveAttribute(
      "href",
      "https://github.com/SarangKumar/vinyaas",
    );
    expect(github).toHaveAttribute("title", "GitHub");
    expect(github.querySelector("svg")).toBeInTheDocument();
    expect(end.className).toContain("lg:gap-4");
    expect(document.querySelector("header")).toHaveClass(
      "h-12",
      "relative",
      "z-[60]",
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
    ).getAllByRole("link", { name: /GitHub/i })[0]!;

    expect(await screen.findAllByText("12")).not.toHaveLength(0);
    expect(github).toHaveAccessibleName(/GitHub/);
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

    const end = document.querySelector(
      "[data-header-section='end']",
    ) as HTMLElement;
    const githubLinks = within(end).getAllByRole("link", {
      name: "GitHub",
      hidden: false,
    });
    expect(githubLinks.length).toBeGreaterThanOrEqual(1);

    await vi.waitFor(() => {
      expect(fetch).toHaveBeenCalled();
    });
    const defaultLink = document.querySelector('[data-github-link="default"]');
    const compactLink = document.querySelector('[data-github-link="compact"]');
    expect(defaultLink?.querySelector("span")).toBeNull();
    expect(compactLink?.querySelector("span")).toBeNull();
  });
});

afterEach(() => {
  vi.unstubAllEnvs();
});

import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { DocsMobileNav } from "./docs-mobile-nav";

vi.mock("next/navigation", () => ({
  usePathname: () => "/introduction",
  useRouter: () => ({ push: vi.fn() }),
}));

async function settle() {
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
  });
}

describe("DocsMobileNav", () => {
  afterEach(() => {
    document.body.style.overflow = "";
  });

  it("opens a full-height sheet below the navbar and closes with Escape", async () => {
    render(<DocsMobileNav />);
    await settle();

    const menu = screen.getByRole("button", { name: "Menu" });

    expect(menu).toHaveAttribute("aria-expanded", "false");
    expect(menu.className).toContain("size-12");
    expect(menu.querySelector("[data-menu-icon]")).toHaveAttribute(
      "data-state",
      "closed",
    );
    expect(screen.queryByRole("dialog", { name: "Navigation" })).toBeNull();

    fireEvent.click(menu);
    await settle();

    expect(menu).toHaveAttribute("aria-expanded", "true");
    expect(menu.querySelector("[data-menu-icon]")).toHaveAttribute(
      "data-state",
      "open",
    );
    const dialog = screen.getByRole("dialog", { name: "Navigation" });
    expect(dialog).toBeInTheDocument();
    expect(document.body.style.overflow).toBe("hidden");

    const shell = document.querySelector("[data-docs-mobile-nav]");
    expect(shell).toBeTruthy();
    expect(shell?.className).toContain("top-12");
    expect(shell?.className).toContain("z-50");
    const panel = document.querySelector("[data-docs-mobile-panel]");
    expect(panel).toBeTruthy();
    const backdrop = document.querySelector("[data-docs-mobile-backdrop]");
    expect(backdrop).toBeTruthy();
    expect(backdrop?.className).toContain("bg-white/5");
    expect(backdrop?.className).toContain("backdrop-blur-2xl");

    expect(screen.getByRole("link", { name: "Docs" })).toHaveAttribute(
      "href",
      "/introduction",
    );
    expect(within(dialog).getByRole("link", { name: "Home" })).toHaveAttribute(
      "href",
      "/",
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
    expect(screen.getByText("COMPONENTS")).toBeInTheDocument();
    expect(screen.getByText("COMPANION")).toBeInTheDocument();
    expect(screen.getByText("GET STARTED")).toBeInTheDocument();
    expect(screen.getByText("SECTIONS")).toBeInTheDocument();
    // Companion sits after the Components name list, before Get Started.
    expect(
      screen
        .getByText("COMPONENTS")
        .compareDocumentPosition(screen.getByText("COMPANION")) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    expect(
      screen
        .getByText("COMPANION")
        .compareDocumentPosition(screen.getByText("GET STARTED")) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    expect(screen.queryByText("RESOURCES")).toBeNull();
    expect(screen.queryByRole("link", { name: "Next.js" })).toBeNull();
    expect(screen.getAllByRole("link", { name: "CLI" })[0]).toHaveAttribute(
      "href",
      "/cli",
    );
    expect(
      screen.getByRole("link", { name: "Custom Companion" }),
    ).toHaveAttribute("href", "/companion/custom");
    expect(
      screen.getAllByRole("link", { name: /Introduction/i })[1],
    ).toHaveAttribute("href", "/companion");
    expect(
      screen
        .getAllByRole("link", { name: /Introduction/i })[1]
        ?.querySelector('[data-nav-indicator="beta"]'),
    ).toBeTruthy();
    expect(screen.getByRole("link", { name: "Changelog" })).toHaveAttribute(
      "href",
      "/changelog",
    );

    const github = within(dialog).getByRole("link", { name: /GitHub/i });
    expect(github).toHaveAttribute(
      "href",
      "https://github.com/SarangKumar/vinyaas",
    );
    expect(github).toHaveAttribute("data-github-link", "mobile");
    expect(within(dialog).getByText("View on GitHub")).toBeInTheDocument();

    const docsLink = screen.getByRole("link", { name: "Docs" });
    expect(docsLink.className).toContain("text-base");
    expect(docsLink.className).toContain("min-h-12");

    fireEvent.keyDown(document, { key: "Escape" });
    await settle();

    expect(screen.getByRole("button", { name: "Menu" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
    expect(document.body.style.overflow).toBe("");

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 220));
    });
    expect(screen.queryByRole("dialog", { name: "Navigation" })).toBeNull();
  });

  it("closes when a navigation link is clicked or the menu is toggled", async () => {
    render(<DocsMobileNav />);
    await settle();

    fireEvent.click(screen.getByRole("button", { name: "Menu" }));
    await settle();
    fireEvent.click(screen.getByRole("link", { name: "Changelog" }));
    await settle();

    expect(screen.getByRole("button", { name: "Menu" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 220));
    });
    expect(screen.queryByRole("dialog", { name: "Navigation" })).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "Menu" }));
    await settle();
    fireEvent.click(screen.getByRole("button", { name: "Menu" }));
    await settle();

    expect(screen.getByRole("button", { name: "Menu" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 220));
    });
    expect(screen.queryByRole("dialog", { name: "Navigation" })).toBeNull();
  });
});

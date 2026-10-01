import { act, fireEvent, render, screen } from "@testing-library/react";
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

  it("opens a navigation drawer and closes it with Escape", async () => {
    render(<DocsMobileNav />);
    await settle();

    const menu = screen.getByRole("button", { name: "Menu" });

    expect(menu).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("dialog", { name: "Navigation" })).toBeNull();

    fireEvent.click(menu);
    await settle();

    expect(menu).toHaveAttribute("aria-expanded", "true");
    expect(
      screen.getByRole("dialog", { name: "Navigation" }),
    ).toBeInTheDocument();
    expect(document.body.style.overflow).toBe("hidden");
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
    expect(screen.getByText("COMPONENTS")).toBeInTheDocument();
    expect(screen.getByText("COMPANION")).toBeInTheDocument();
    expect(screen.getByText("GET STARTED")).toBeInTheDocument();
    expect(screen.getByText("SECTIONS")).toBeInTheDocument();
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
      screen.getAllByRole("link", { name: "Introduction" })[1],
    ).toHaveAttribute("href", "/companion");
    expect(screen.getByRole("link", { name: "Changelog" })).toHaveAttribute(
      "href",
      "/changelog",
    );

    fireEvent.keyDown(document, { key: "Escape" });
    await settle();

    expect(screen.getByRole("button", { name: "Menu" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
    expect(screen.queryByRole("dialog", { name: "Navigation" })).toBeNull();
    expect(document.body.style.overflow).toBe("");
  });

  it("closes when a navigation link is clicked or the overlay is used", async () => {
    render(<DocsMobileNav />);
    await settle();

    fireEvent.click(screen.getByRole("button", { name: "Menu" }));
    await settle();
    fireEvent.click(screen.getByRole("link", { name: "Changelog" }));
    await settle();

    expect(screen.queryByRole("dialog", { name: "Navigation" })).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "Menu" }));
    await settle();
    fireEvent.click(screen.getAllByRole("button", { name: "Close menu" })[0]!);
    await settle();

    expect(screen.queryByRole("dialog", { name: "Navigation" })).toBeNull();
  });
});

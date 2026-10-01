import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { DocsStoreProvider } from "@/lib/store/provider";
import { setCodeLanguage } from "@/lib/store/slices/code-language";
import { store } from "@/lib/store/store";

import CompanionPage, { metadata } from "./page";

function renderWithStore(ui: React.ReactElement) {
  store.dispatch(setCodeLanguage("jsx"));
  return render(<DocsStoreProvider>{ui}</DocsStoreProvider>);
}

describe("Companion landing page", () => {
  it("showcases Ember, Soul, and Moss as a product feature area", () => {
    renderWithStore(<CompanionPage />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Meet Vinyaas Companions",
      }),
    ).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Ember" })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Soul" })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Moss" })).toBeInTheDocument();
    expect(screen.queryByRole("img", { name: "Skeleton" })).toBeNull();
    expect(
      screen.getByRole("heading", { name: "Ember" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Soul" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Moss" })).toBeInTheDocument();
    expect(document.querySelector("[data-companion-card-grid]")?.className).toContain(
      "sm:grid-cols-2",
    );
    expect(
      screen.getByRole("link", { name: "Installation" }),
    ).toHaveAttribute("href", "/companion/installation");
    expect(
      screen.getByRole("link", { name: "companion.json" }),
    ).toHaveAttribute("href", "/companion/configuration");
    expect(
      screen.getByRole("link", { name: "Custom Companion" }),
    ).toHaveAttribute("href", "/companion/custom");
    expect(document.body.textContent).not.toMatch(/\bAI\b/);
    expect(metadata.title).toBe("Companions");
    expect(metadata.alternates).toMatchObject({ canonical: "/companion" });
  });
});

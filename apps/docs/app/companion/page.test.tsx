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
  it("showcases Ember, Soul, Moss, Flint, Bubble, Rime, Jab, and Volt with spawn and know-more actions", () => {
    renderWithStore(<CompanionPage />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Meet Vinyaas Companions",
      }),
    ).toBeInTheDocument();
    for (const name of [
      "Ember",
      "Soul",
      "Moss",
      "Flint",
      "Bubble",
      "Rime",
      "Jab",
      "Volt",
    ]) {
      expect(screen.getByRole("img", { name })).toBeInTheDocument();
      expect(screen.getByRole("heading", { name })).toBeInTheDocument();
    }
    expect(
      screen.getAllByRole("link", { name: /Open .* detail page/i }).length,
    ).toBeGreaterThanOrEqual(8);
    expect(
      document.querySelector('[data-companion-surface-id="docs-demo-perch"]'),
    ).toBeTruthy();
    expect(screen.getByText(/Landing surfaces/i)).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Animations" }),
    ).toHaveAttribute("href", "/companion/animations");
    expect(metadata.title).toBe("Companions");
    expect(metadata.alternates).toMatchObject({ canonical: "/companion" });
  });
});

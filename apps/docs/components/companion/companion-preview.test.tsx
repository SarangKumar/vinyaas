import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { CompanionPreview } from "./companion-preview";
import { CompanionShowcase } from "./companion-showcase";
import { CompanionCard } from "./companion-card";
import { companionCatalog } from "./catalog";
import emberIdle from "@/companion/ember/assets/idle.png";

describe("CompanionPreview", () => {
  it("renders a crisp companion sprite from the companion asset path", () => {
    render(<CompanionPreview name="Ember" src={emberIdle} size={96} />);

    const root = document.querySelector('[data-companion-preview="ember"]');
    expect(root).toBeTruthy();

    const image = screen.getByRole("img", { name: "Ember" });
    expect(image).toHaveAttribute("width", "96");
    expect(image).toHaveAttribute("height", "96");
    expect(image.getAttribute("src")).toMatch(/idle/);
    expect(image.style.imageRendering).toBe("pixelated");
  });
});

describe("CompanionCard", () => {
  it("shows metadata from companion.json", () => {
    const ember = companionCatalog.find((entry) => entry.meta.id === "ember");
    expect(ember).toBeTruthy();

    render(<CompanionCard meta={ember!.meta} src={ember!.idle} />);

    expect(screen.getByRole("heading", { name: "Ember" })).toBeInTheDocument();
    expect(
      screen.getByText("A tiny playful flame spirit."),
    ).toBeInTheDocument();
    expect(screen.getByText("playful")).toBeInTheDocument();
    expect(screen.getByText(/16 interactions/)).toBeInTheDocument();
    expect(screen.getByText(/Floating/)).toBeInTheDocument();
  });
});

describe("CompanionShowcase", () => {
  it("showcases Ember, Soul, and Skeleton and links into companion docs", () => {
    render(<CompanionShowcase />);

    expect(
      screen.getByRole("heading", { name: "Meet Vinyaas Companions" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Ember" })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Soul" })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Skeleton" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Companions" })).toHaveAttribute(
      "href",
      "/companion",
    );
    expect(document.body.textContent).not.toMatch(/\bAI\b/);
  });
});

describe("companion catalog", () => {
  it("loads Ember, Soul, and Skeleton metadata with interactions", () => {
    expect(companionCatalog.map((entry) => entry.meta.id)).toEqual([
      "ember",
      "soul",
      "skeleton",
    ]);

    for (const entry of companionCatalog) {
      expect(entry.meta.personalityTraits.length).toBeGreaterThan(0);
      expect(entry.meta.description.length).toBeLessThanOrEqual(40);
      expect(entry.meta.interactions.length).toBeGreaterThanOrEqual(15);
      expect(entry.meta.interactions.every((item) => item.id && item.description))
        .toBe(true);
    }
  });
});

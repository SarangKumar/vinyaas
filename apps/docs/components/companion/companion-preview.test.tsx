import { act, fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { CompanionPreview } from "./companion-preview";
import { CompanionShowcase } from "./companion-showcase";
import { CompanionCard } from "./companion-card";
import { CompanionSprite } from "./companion-sprite";
import {
  companionCatalog,
  normalizeAnimationClip,
} from "./catalog";
import {
  companionFloorY,
  shouldFallOnDrop,
  stepCompanionFall,
} from "./companion-runtime";
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
  it("shows only name and interaction count", () => {
    const ember = companionCatalog.find((entry) => entry.meta.id === "ember");
    expect(ember).toBeTruthy();

    render(<CompanionCard entry={ember!} />);

    const card = document.querySelector('[data-companion-card="ember"]');
    expect(card).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Ember" })).toBeInTheDocument();
    expect(screen.getByText(/17 interactions/)).toBeInTheDocument();
    expect(screen.queryByText(ember!.meta.description)).toBeNull();
    expect(screen.queryByText("playful")).toBeNull();
  });

  it("renders Moss showcase metadata", () => {
    const moss = companionCatalog.find((entry) => entry.meta.id === "moss");
    expect(moss).toBeTruthy();

    render(<CompanionCard entry={moss!} />);

    expect(screen.getByRole("heading", { name: "Moss" })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Moss" })).toBeInTheDocument();
  });
});

describe("CompanionShowcase", () => {
  it("showcases Ember, Soul, and Moss in a 2-column grid", () => {
    render(<CompanionShowcase />);

    expect(
      screen.getByRole("heading", { name: "Meet Vinyaas Companions" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Ember" })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Soul" })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Moss" })).toBeInTheDocument();
    expect(screen.queryByRole("img", { name: "Skeleton" })).toBeNull();
    expect(document.querySelector("[data-companion-card-grid]")?.className).toContain(
      "sm:grid-cols-2",
    );
    expect(document.querySelector("[data-companion-card-grid]")?.className).toContain(
      "grid-cols-1",
    );
    expect(screen.getByRole("link", { name: "Companions" })).toHaveAttribute(
      "href",
      "/companion",
    );
  });
});

describe("companion catalog", () => {
  it("loads Ember, Soul, and Moss metadata with fall interaction", () => {
    expect(companionCatalog.map((entry) => entry.meta.id)).toEqual([
      "ember",
      "soul",
      "moss",
    ]);

    for (const entry of companionCatalog) {
      expect(entry.meta.personalityTraits.length).toBeGreaterThan(0);
      expect(entry.meta.description.length).toBeLessThanOrEqual(40);
      expect(entry.meta.interactions.some((item) => item.id === "fall")).toBe(
        true,
      );
      expect(entry.clips.idle.frames.length).toBeGreaterThanOrEqual(2);
      expect(entry.clips.fall.frames.length).toBeGreaterThanOrEqual(2);

      const idle = normalizeAnimationClip(entry.meta.animations.idle);
      expect(idle.frames.length).toBeGreaterThanOrEqual(2);
    }
  });
});

describe("CompanionSprite", () => {
  it("advances idle frames while playing", () => {
    vi.useFakeTimers();
    const ember = companionCatalog[0]!;

    render(
      <CompanionSprite
        name={ember.meta.name}
        frames={ember.clips.idle.frames}
        fps={ember.clips.idle.fps}
      />,
    );

    const sprite = document.querySelector('[data-companion-sprite="ember"]');
    expect(sprite).toHaveAttribute("data-companion-frame", "0");

    act(() => {
      vi.advanceTimersByTime(250);
    });

    expect(sprite).toHaveAttribute("data-companion-frame", "1");
    vi.useRealTimers();
  });
});

describe("companion runtime physics", () => {
  it("falls toward the floor and lands", () => {
    const floorY = companionFloorY(800);
    expect(shouldFallOnDrop(120, floorY)).toBe(true);

    let y = 120;
    let vy = 0;
    let landed = false;
    for (let i = 0; i < 200 && !landed; i++) {
      const step = stepCompanionFall(y, vy, floorY, 1);
      y = step.y;
      vy = step.vy;
      landed = step.landed;
    }

    expect(landed).toBe(true);
    expect(y).toBe(floorY);
  });
});

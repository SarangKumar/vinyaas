import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { DocsShell } from "@/components/docs-shell";

const navigation = vi.hoisted(() => ({
  pathname: "/companion",
}));

vi.mock("next/navigation", () => ({
  usePathname: () => navigation.pathname,
  useRouter: () => ({ push: vi.fn() }),
}));

describe("CompanionHost in DocsShell", () => {
  it("mounts a global companion layer outside page content", () => {
    navigation.pathname = "/companion";
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));

    render(
      <DocsShell>
        <h1>Companions</h1>
      </DocsShell>,
    );

    const layer = document.querySelector("[data-companion-layer]");
    const host = document.querySelector("[data-companion-host]");
    expect(layer).toBeTruthy();
    expect(host).toBeTruthy();
    expect(host).toHaveAttribute("data-companion-id", "ember");
    expect(host).toHaveAttribute("data-companion-motion", "idle");
    expect(host?.getAttribute("data-companion-instance")).toBeTruthy();
    expect(
      screen.getByRole("heading", { name: "Companions" }),
    ).toBeInTheDocument();
  });

  it("keeps the same companion instance across navigation content changes", () => {
    navigation.pathname = "/companion";
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));

    const { rerender } = render(
      <DocsShell>
        <h1>Companions</h1>
      </DocsShell>,
    );

    const firstId = document
      .querySelector("[data-companion-host]")
      ?.getAttribute("data-companion-instance");
    expect(firstId).toBeTruthy();

    navigation.pathname = "/introduction";
    rerender(
      <DocsShell>
        <h1>Introduction</h1>
      </DocsShell>,
    );

    const host = document.querySelector("[data-companion-host]");
    expect(host?.getAttribute("data-companion-instance")).toBe(firstId);
    expect(host).toHaveAttribute("data-companion-id", "ember");
    expect(
      screen.getByRole("heading", { name: "Introduction" }),
    ).toBeInTheDocument();
  });

  it("drags then falls back toward the floor on release", () => {
    navigation.pathname = "/companion";
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));

    Object.defineProperty(window, "innerWidth", {
      configurable: true,
      value: 1000,
    });
    Object.defineProperty(window, "innerHeight", {
      configurable: true,
      value: 800,
    });
    Object.defineProperty(HTMLElement.prototype, "getBoundingClientRect", {
      configurable: true,
      value() {
        return {
          x: 100,
          y: 200,
          left: 100,
          top: 200,
          right: 172,
          bottom: 272,
          width: 72,
          height: 72,
          toJSON() {
            return {};
          },
        };
      },
    });

    render(
      <DocsShell>
        <main style={{ height: 400 }}>
          <h1>Companions</h1>
        </main>
      </DocsShell>,
    );

    const beforeHeight = document.body.scrollHeight;
    const host = document.querySelector(
      "[data-companion-host]",
    ) as HTMLElement | null;
    expect(host).toBeTruthy();

    fireEvent.pointerDown(host!, {
      button: 0,
      clientX: 120,
      clientY: 220,
      pointerId: 1,
    });
    expect(host).toHaveAttribute("data-companion-motion", "dragging");

    fireEvent.pointerMove(window, { clientX: 180, clientY: 120, pointerId: 1 });
    fireEvent.pointerUp(window, { pointerId: 1 });

    expect(host).toHaveAttribute("data-companion-motion", "falling");
    expect(document.body.scrollHeight).toBe(beforeHeight);
    expect(
      document.querySelector("[data-companion-layer]")?.className,
    ).toContain("fixed");
  });
});

import { render, screen } from "@testing-library/react";
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
  it("mounts a global companion host outside page content", () => {
    navigation.pathname = "/companion";
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));

    render(
      <DocsShell>
        <h1>Companions</h1>
      </DocsShell>,
    );

    const host = document.querySelector("[data-companion-host]");
    expect(host).toBeTruthy();
    expect(host).toHaveAttribute("data-companion-id", "ember");
    expect(host?.getAttribute("data-companion-instance")).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Companions" })).toBeInTheDocument();
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
});

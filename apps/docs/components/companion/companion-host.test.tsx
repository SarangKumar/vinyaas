import { fireEvent, render, screen, act } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { DocsShell } from "@/components/docs-shell";
import {
  CompanionProvider,
  useCompanions,
} from "@/components/companion/companion-provider";
import {
  COMPANION_DEATH_MS,
  COMPANION_SIZE,
} from "@/components/companion/runtime/physics";
import {
  clearCompanionSurfaceHighlight,
  findCompanionSurfaceAt,
  setCompanionSurfaceHighlight,
} from "@/components/companion/runtime/surfaces";
import {
  createCompanionEngine,
  engineBeginRespawn,
  engineEndDrag,
  engineStartDrag,
  engineTick,
} from "@/components/companion/runtime/engine";
import { assertCompanionConfig } from "@/components/companion/runtime/schema";
import { findCompanionSpawnPosition } from "@/components/companion/runtime/spawn";
import { isCompanionInteractive } from "@/components/companion/runtime/state-machine";
import emberMeta from "@/companion/ember/companion.json";
import tuskMeta from "@/companion/tusk/companion.json";

const navigation = vi.hoisted(() => ({
  pathname: "/companion",
}));

vi.mock("next/navigation", () => ({
  usePathname: () => navigation.pathname,
  useRouter: () => ({ push: vi.fn() }),
}));

function SpawnHarness() {
  const { spawnCompanion, instances, spawnFeedback } = useCompanions();
  return (
    <div>
      <button type="button" onClick={() => spawnCompanion("ember")}>
        Spawn Ember
      </button>
      <button type="button" onClick={() => spawnCompanion("tusk")}>
        Spawn Tusk
      </button>
      <button type="button" onClick={() => spawnCompanion("soul")}>
        Spawn Soul
      </button>
      <span data-count={instances.length}>{instances.length}</span>
      <span data-feedback={spawnFeedback?.reason ?? ""}>
        {spawnFeedback?.reason ?? ""}
      </span>
      <ul>
        {instances.map((item) => (
          <li key={item.id} data-type={item.type} data-state={item.state}>
            {item.type}:{item.state}
          </li>
        ))}
      </ul>
    </div>
  );
}

describe("Companion multi-instance spawn", () => {
  beforeEach(() => {
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
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("spawns an instance when requested", () => {
    render(
      <CompanionProvider>
        <SpawnHarness />
      </CompanionProvider>,
    );

    expect(document.querySelector("[data-companion-host]")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Spawn Ember" }));
    expect(document.querySelectorAll("[data-companion-host]")).toHaveLength(1);
    expect(document.querySelector("[data-companion-id='ember']")).toBeTruthy();
  });

  it("allows at most two instances of the same type", () => {
    render(
      <CompanionProvider>
        <SpawnHarness />
      </CompanionProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Spawn Ember" }));
    fireEvent.click(screen.getByRole("button", { name: "Spawn Ember" }));
    fireEvent.click(screen.getByRole("button", { name: "Spawn Ember" }));

    expect(
      document.querySelectorAll("[data-companion-id='ember']"),
    ).toHaveLength(2);
    expect(screen.getByText("limit")).toBeInTheDocument();
  });

  it("allows different types to coexist", () => {
    render(
      <CompanionProvider>
        <SpawnHarness />
      </CompanionProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Spawn Ember" }));
    fireEvent.click(screen.getByRole("button", { name: "Spawn Ember" }));
    fireEvent.click(screen.getByRole("button", { name: "Spawn Tusk" }));
    fireEvent.click(screen.getByRole("button", { name: "Spawn Soul" }));

    expect(document.querySelectorAll("[data-companion-host]").length).toBe(4);
    expect(
      document.querySelectorAll("[data-companion-id='ember']"),
    ).toHaveLength(2);
    expect(
      document.querySelectorAll("[data-companion-id='tusk']"),
    ).toHaveLength(1);
    expect(
      document.querySelectorAll("[data-companion-id='soul']"),
    ).toHaveLength(1);
  });

  it("avoids stacking spawn positions on existing instances", () => {
    const first = findCompanionSpawnPosition({ width: 1000, height: 800 }, []);
    const second = findCompanionSpawnPosition({ width: 1000, height: 800 }, [
      first,
    ]);
    expect(Math.hypot(second.x - first.x, second.y - first.y)).toBeGreaterThan(
      40,
    );
  });
});

describe("Companion surface hit testing", () => {
  it("resolves nested children to the declared surface and accepts buttons", () => {
    document.body.innerHTML = `
      <div data-companion-surface data-companion-surface-id="card" id="card"
        style="position:fixed;left:0;top:0;width:200px;height:120px;">
        <div id="content">
          <button id="inner">Go</button>
        </div>
      </div>
      <button id="lone" data-slot="button" style="position:fixed;left:300px;top:40px;width:80px;height:32px;">Act</button>
      <p id="plain">No surface</p>
    `;

    const card = document.getElementById("card")!;
    card.getBoundingClientRect = () =>
      ({
        left: 0,
        top: 0,
        right: 200,
        bottom: 120,
        width: 200,
        height: 120,
        x: 0,
        y: 0,
        toJSON() {
          return {};
        },
      }) as DOMRect;

    const button = document.getElementById("inner")!;
    button.getBoundingClientRect = () =>
      ({
        left: 40,
        top: 40,
        right: 100,
        bottom: 70,
        width: 60,
        height: 30,
        x: 40,
        y: 40,
        toJSON() {
          return {};
        },
      }) as DOMRect;
    document.elementsFromPoint = () => [
      button,
      document.getElementById("content")!,
      card,
    ];

    const surface = findCompanionSurfaceAt(50, 50);
    expect(surface?.id).toBe("card");

    const lone = document.getElementById("lone")!;
    lone.getBoundingClientRect = () =>
      ({
        left: 300,
        top: 40,
        right: 380,
        bottom: 72,
        width: 80,
        height: 32,
        x: 300,
        y: 40,
        toJSON() {
          return {};
        },
      }) as DOMRect;
    document.elementsFromPoint = () => [lone];
    expect(findCompanionSurfaceAt(320, 50)?.element).toBe(lone);

    document.elementsFromPoint = () => [document.getElementById("plain")!];
    expect(findCompanionSurfaceAt(10, 200)).toBeNull();
  });

  it("applies and clears surface highlight without layout shift attrs", () => {
    const el = document.createElement("div");
    el.setAttribute("data-companion-surface", "");
    document.body.appendChild(el);

    const active = setCompanionSurfaceHighlight(
      {
        id: "x",
        element: el,
        top: 0,
        left: 0,
        right: 10,
        bottom: 10,
      },
      null,
    );
    expect(el.hasAttribute("data-companion-surface-active")).toBe(true);
    clearCompanionSurfaceHighlight(active);
    expect(el.hasAttribute("data-companion-surface-active")).toBe(false);
  });
});

describe("Companion death and respawn engine", () => {
  it("puffs then dies after a fatal drop below 80vh", () => {
    vi.useFakeTimers();
    const config = assertCompanionConfig(emberMeta);
    let engine = createCompanionEngine({
      config,
      position: { x: 100, y: 700 },
    });

    engine = engineStartDrag(engine, config, { x: 100, y: 700 });
    engine = engineEndDrag(engine, config, { width: 1000, height: 800 }, [], {
      deathDrop: true,
      nowMs: 1_000,
    });
    expect(engine.state).toBe("puffing");
    expect(engine.animation.clipId).toBe("puff");
    expect(engine.deathPending).toBe(false);

    for (let i = 0; i < 40 && engine.state === "puffing"; i += 1) {
      engine = engineTick(
        engine,
        config,
        50,
        { width: 1000, height: 800 },
        [],
        COMPANION_SIZE,
        1_000 + i * 50,
      );
    }

    expect(engine.state).toBe("dead");
    expect(engine.deadUntilMs).toBeGreaterThanOrEqual(
      1_000 + COMPANION_DEATH_MS,
    );
    expect(isCompanionInteractive(engine.state)).toBe(false);

    engine = engineBeginRespawn(engine, config, { x: 200, y: 120 });
    expect(engine.state).toBe("respawning");
    expect(engine.deadUntilMs).toBeNull();

    for (let i = 0; i < 40 && engine.state === "respawning"; i += 1) {
      engine = engineTick(engine, config, 50, { width: 1000, height: 800 }, []);
    }
    expect(engine.state).toBe("idle");
  });

  it("snaps onto a declared drop surface instead of falling", () => {
    const config = assertCompanionConfig(tuskMeta);
    let engine = createCompanionEngine({
      config,
      position: { x: 40, y: 20 },
    });
    engine = engineStartDrag(engine, config, { x: 40, y: 20 });
    engine = engineEndDrag(engine, config, { width: 1000, height: 800 }, [], {
      dropSurface: { top: 200, left: 0, right: 400, bottom: 280 },
      surfaceId: "demo",
    });
    expect(engine.state).toBe("landing");
    expect(engine.surfaceId).toBe("demo");
    expect(engine.physics.position.y).toBe(200 - COMPANION_SIZE);
  });
});

describe("CompanionHost in DocsShell", () => {
  beforeEach(() => {
    navigation.pathname = "/companion";
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));
  });

  it("mounts an empty companion layer until a companion is spawned", () => {
    render(
      <DocsShell>
        <h1>Companions</h1>
      </DocsShell>,
    );

    expect(document.querySelector("[data-companion-layer]")).toBeTruthy();
    expect(document.querySelector("[data-companion-host]")).toBeNull();
    expect(
      screen.getByRole("heading", { name: "Companions" }),
    ).toBeInTheDocument();
  });

  it("keeps spawned instances across navigation content changes", () => {
    function ShellSpawn() {
      const { spawnCompanion } = useCompanions();
      return (
        <button type="button" onClick={() => spawnCompanion("ember")}>
          Spawn
        </button>
      );
    }

    const { rerender } = render(
      <DocsShell>
        <ShellSpawn />
        <h1>Companions</h1>
      </DocsShell>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Spawn" }));
    const firstId = document
      .querySelector("[data-companion-host]")
      ?.getAttribute("data-companion-instance");
    expect(firstId).toBeTruthy();

    navigation.pathname = "/introduction";
    rerender(
      <DocsShell>
        <ShellSpawn />
        <h1>Introduction</h1>
      </DocsShell>,
    );

    const host = document.querySelector("[data-companion-host]");
    expect(host?.getAttribute("data-companion-instance")).toBe(firstId);
    expect(host).toHaveAttribute("data-companion-id", "ember");
  });

  it("drags then falls when released without a declared surface", () => {
    function ShellSpawn() {
      const { spawnCompanion } = useCompanions();
      return (
        <button type="button" onClick={() => spawnCompanion("ember")}>
          Spawn
        </button>
      );
    }

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
    document.elementsFromPoint = () => [];

    render(
      <DocsShell>
        <ShellSpawn />
        <main style={{ height: 400 }}>
          <h1>Companions</h1>
        </main>
      </DocsShell>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Spawn" }));
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
  });

  it("cleans up the death timer on unmount", () => {
    vi.useFakeTimers();
    const config = assertCompanionConfig(emberMeta);
    const engine = createCompanionEngine({
      config,
      position: { x: 10, y: 10 },
      state: "dead",
      deadUntilMs: Date.now() + COMPANION_DEATH_MS,
    });
    expect(engine.state).toBe("dead");

    const { unmount } = render(
      <CompanionProvider>
        <SpawnHarness />
      </CompanionProvider>,
    );

    unmount();
    act(() => {
      vi.advanceTimersByTime(COMPANION_DEATH_MS + 100);
    });
    // No throw / no stray timers targeting unmounted trees.
    expect(engine.state).toBe("dead");
  });
});

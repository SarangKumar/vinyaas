import { describe, expect, it } from "vitest";

import {
  createAnimationController,
  playAnimationClip,
  selectAnimationClipId,
  tickAnimation,
} from "@/components/companion/runtime/animation";
import {
  createCompanionEngine,
  engineEndDrag,
  engineMoveDrag,
  engineStartDrag,
  engineTick,
  engineTriggerClick,
} from "@/components/companion/runtime/engine";
import {
  clearInteractionHandlers,
  installDefaultInteractionHandlers,
  resolveInteraction,
} from "@/components/companion/runtime/interactions";
import {
  companionFloorY,
  findPerchLandingY,
  shouldFallOnDrop,
  stepCompanionFallY,
} from "@/components/companion/runtime/physics";
import {
  assertCompanionConfig,
  parseCompanionConfig,
} from "@/components/companion/runtime/schema";
import {
  canTransition,
  clipIdForState,
  transitionCompanionState,
} from "@/components/companion/runtime/state-machine";
import emberMeta from "@/companion/ember/companion.json";

describe("companion schema", () => {
  it("parses a valid companion.json config", () => {
    const result = parseCompanionConfig(emberMeta);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.config.id).toBe("ember");
      expect(result.config.animations.idle).toBeTruthy();
    }
  });

  it("rejects invalid companion configuration", () => {
    expect(parseCompanionConfig(null).ok).toBe(false);
    expect(parseCompanionConfig({}).ok).toBe(false);
    expect(
      parseCompanionConfig({
        id: "x",
        name: "X",
        description: "desc",
        personalityTraits: [],
        capabilities: {},
        interactions: [{ id: 1 }],
        assets: { idle: "a.png" },
        animations: {},
      }).ok,
    ).toBe(false);
    expect(
      parseCompanionConfig({
        id: "x",
        name: "X",
        description: "desc",
        personalityTraits: ["a"],
        capabilities: { floating: true },
        interactions: [],
        assets: { idle: "a.png" },
        animations: { idle: { frames: [] } },
      }).ok,
    ).toBe(false);
    expect(() => assertCompanionConfig({ id: "bad" })).toThrow(/Invalid companion/);
  });
});

describe("companion state machine", () => {
  it("allows and blocks transitions", () => {
    expect(canTransition("idle", "dragging")).toBe(true);
    expect(canTransition("idle", "falling")).toBe(true);
    expect(canTransition("falling", "landing")).toBe(true);
    expect(canTransition("falling", "idle")).toBe(false);
    expect(transitionCompanionState("dragging", "falling").ok).toBe(true);
    expect(transitionCompanionState("sleeping", "falling").ok).toBe(false);
  });

  it("maps states to animation clips", () => {
    expect(clipIdForState("sleeping")).toBe("sleep");
    expect(clipIdForState("falling")).toBe("fall");
    expect(clipIdForState("interacting")).toBe("happy");
    expect(clipIdForState("idle")).toBe("idle");
  });
});

describe("animation controller", () => {
  it("selects clips from metadata and advances frames", () => {
    const config = assertCompanionConfig(emberMeta);
    expect(selectAnimationClipId(config.animations, "happy")).toBe("happy");
    expect(selectAnimationClipId(config.animations, "missing")).toBe("idle");

    const playing = playAnimationClip(config.animations, "happy");
    expect(playing.clipId).toBe("happy");
    expect(playing.loop).toBe(false);

    let current = playing;
    for (let i = 0; i < 20; i++) {
      current = tickAnimation(current, 200);
    }
    expect(current.finished).toBe(true);

    const looping = createAnimationController("idle", {
      frames: ["a", "b", "c"],
      fps: 10,
      loop: true,
    });
    const advanced = tickAnimation(looping, 100);
    expect(advanced.frameIndex).toBe(1);
    expect(advanced.finished).toBe(false);
  });
});

describe("physics", () => {
  it("falls toward the floor and lands", () => {
    const floorY = companionFloorY(800);
    expect(shouldFallOnDrop(120, floorY)).toBe(true);

    let y = 120;
    let vy = 0;
    let landed = false;
    for (let i = 0; i < 200 && !landed; i++) {
      const step = stepCompanionFallY(y, vy, floorY, 1);
      y = step.y;
      vy = step.vy;
      landed = step.landed;
    }

    expect(landed).toBe(true);
    expect(y).toBe(floorY);
  });

  it("lands on a component top edge when falling past it", () => {
    const perch = findPerchLandingY(
      100,
      40,
      200,
      [{ top: 160, left: 80, right: 400, bottom: 400 }],
      72,
    );
    expect(perch).toBe(88);
  });
});

describe("interaction registry", () => {
  it("resolves generic handlers without companion-specific branches", () => {
    clearInteractionHandlers();
    installDefaultInteractionHandlers();
    const config = assertCompanionConfig(emberMeta);

    expect(
      resolveInteraction({
        config,
        currentState: "idle",
        request: { interactionId: "react-click", trigger: "click" },
      }),
    ).toEqual({ nextState: "interacting", clipId: "happy" });

    expect(
      resolveInteraction({
        config,
        currentState: "idle",
        request: { interactionId: "not-declared", trigger: "click" },
      }),
    ).toBeNull();
  });
});

describe("companion engine", () => {
  it("transitions through drag → fall → landing → idle", () => {
    const config = assertCompanionConfig(emberMeta);
    let engine = createCompanionEngine({
      config,
      position: { x: 100, y: 40 },
    });

    engine = engineStartDrag(engine, config, { x: 100, y: 40 });
    expect(engine.state).toBe("dragging");

    engine = engineMoveDrag(
      engine,
      { x: 120, y: 20 },
      { width: 1000, height: 800 },
    );
    expect(engine.physics.position.y).toBe(20);

    engine = engineEndDrag(
      engine,
      config,
      { width: 1000, height: 800 },
      [],
    );
    expect(engine.state).toBe("falling");

    for (let i = 0; i < 300 && engine.state === "falling"; i++) {
      engine = engineTick(
        engine,
        config,
        16,
        { width: 1000, height: 800 },
        [],
      );
    }

    expect(["landing", "idle"]).toContain(engine.state);

    for (let i = 0; i < 100 && engine.state === "landing"; i++) {
      engine = engineTick(
        engine,
        config,
        50,
        { width: 1000, height: 800 },
        [],
      );
    }

    expect(engine.state).toBe("idle");
  });

  it("triggers interacting state on click", () => {
    const config = assertCompanionConfig(emberMeta);
    let engine = createCompanionEngine({
      config,
      position: { x: 10, y: 10 },
    });

    engine = engineTriggerClick(engine, config);
    expect(engine.state).toBe("interacting");
    expect(engine.animation.clipId).toBe("happy");
  });
});

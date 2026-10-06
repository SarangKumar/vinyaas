import { describe, expect, it } from "vitest";

import {
  createAnimationController,
  playAnimationClip,
  selectAnimationClipId,
  tickAnimation,
} from "@/components/companion/runtime/animation";
import {
  createCompanionEngine,
  engineDispatchTrigger,
  engineEndDrag,
  engineMoveDrag,
  engineSetInstanceProfile,
  engineStartDrag,
  engineTick,
  engineTriggerClick,
} from "@/components/companion/runtime/engine";
import {
  clearInteractionHandlers,
  executeTriggeredInteraction,
  installDefaultInteractionHandlers,
  resolveInteraction,
} from "@/components/companion/runtime/interactions";
import {
  deriveCompanionMood,
  resolveCompanionPersonality,
} from "@/components/companion/runtime/personality";
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

const baseValid = {
  id: "x",
  name: "X",
  description: "desc",
  personalityTraits: ["a"],
  capabilities: {
    floating: true,
    followCursor: false,
    reactToClick: true,
  },
  interactions: [] as unknown[],
  assets: { idle: "a.png" },
  animations: {
    idle: { frames: ["idle/1.png"], fps: 5 },
  },
};

describe("companion schema", () => {
  it("parses a valid companion.json config", () => {
    const result = parseCompanionConfig(emberMeta);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.config.id).toBe("ember");
      expect(result.config.animations.idle).toBeTruthy();
      expect(result.config.instances?.spark?.name).toBe("Spark");
      expect(result.config.interactions[0]?.trigger).toBe("click");
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
    expect(() => assertCompanionConfig({ id: "bad" })).toThrow(
      /Invalid companion/,
    );
  });

  it("rejects invalid interaction schema", () => {
    const badTrigger = parseCompanionConfig({
      ...baseValid,
      interactions: [
        {
          id: "bad",
          trigger: "telepathy",
          action: "play_animation",
          animation: "happy",
        },
      ],
    });
    expect(badTrigger.ok).toBe(false);
    if (!badTrigger.ok) {
      expect(badTrigger.path).toBe("interactions[0].trigger");
    }

    const badAction = parseCompanionConfig({
      ...baseValid,
      interactions: [
        {
          id: "bad",
          trigger: "click",
          action: "explode",
          animation: "happy",
        },
      ],
    });
    expect(badAction.ok).toBe(false);
    if (!badAction.ok) {
      expect(badAction.path).toBe("interactions[0].action");
    }

    const badCooldown = parseCompanionConfig({
      ...baseValid,
      interactions: [
        {
          id: "bad",
          trigger: "click",
          action: "play_animation",
          animation: "happy",
          cooldown: -1,
        },
      ],
    });
    expect(badCooldown.ok).toBe(false);
    if (!badCooldown.ok) {
      expect(badCooldown.path).toBe("interactions[0].cooldown");
    }
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

describe("interaction system v0.1", () => {
  it("handles click interaction", () => {
    const config = assertCompanionConfig(emberMeta);
    let engine = createCompanionEngine({
      config,
      position: { x: 10, y: 10 },
    });

    engine = engineTriggerClick(engine, config);
    expect(engine.state).toBe("interacting");
    expect(engine.animation.clipId).toBe("happy");
    expect(engine.mood).toBe("happy");
  });

  it("enforces cooldown handling", () => {
    const config = assertCompanionConfig(emberMeta);
    const allowed = new Set(["react-click", "celebrate"]);
    const first = executeTriggeredInteraction({
      config,
      currentState: "idle",
      request: { trigger: "click" },
      cooldowns: {},
      nowMs: 1_000,
      allowedInteractionIds: allowed,
    });
    expect(first).not.toBeNull();
    expect(first?.effect.interactionId).toBe("react-click");

    // While react-click cools, celebrate (same trigger) can still fire.
    const fallthrough = executeTriggeredInteraction({
      config,
      currentState: "idle",
      request: { trigger: "click" },
      cooldowns: first!.cooldowns,
      nowMs: 1_100,
      allowedInteractionIds: allowed,
    });
    expect(fallthrough?.effect.interactionId).toBe("celebrate");

    const blocked = executeTriggeredInteraction({
      config,
      currentState: "idle",
      request: { trigger: "click" },
      cooldowns: fallthrough!.cooldowns,
      nowMs: 1_200,
      allowedInteractionIds: allowed,
    });
    expect(blocked).toBeNull();

    const readyAgain = executeTriggeredInteraction({
      config,
      currentState: "idle",
      request: { trigger: "click" },
      cooldowns: fallthrough!.cooldowns,
      nowMs: 2_500,
      allowedInteractionIds: allowed,
    });
    expect(readyAgain).not.toBeNull();
  });

  it("fires idle timeout through the engine", () => {
    const config = assertCompanionConfig(emberMeta);
    let engine = createCompanionEngine({
      config,
      position: { x: 10, y: 10 },
      instanceProfileId: "ash",
    });

    expect(engine.personality.idleTimeoutMs).toBe(30000);
    expect(engine.mood).toBe("sleepy");

    engine = engineTick(engine, config, engine.personality.idleTimeoutMs + 1, {
      width: 1000,
      height: 800,
    });

    expect(engine.state).toBe("sleeping");
    expect(engine.animation.clipId).toBe("sleep");
  });

  it("handles drop trigger after drag end", () => {
    const config = assertCompanionConfig(emberMeta);
    let engine = createCompanionEngine({
      config,
      position: { x: 100, y: 40 },
    });

    engine = engineStartDrag(engine, config, { x: 100, y: 40 });
    engine = engineMoveDrag(
      engine,
      { x: 120, y: 20 },
      { width: 1000, height: 800 },
    );
    engine = engineEndDrag(engine, config, { width: 1000, height: 800 }, []);

    expect(engine.state).toBe("falling");
    expect(engine.animation.clipId).toBe("fall");
  });

  it("applies personality override for named instances", () => {
    const config = assertCompanionConfig(emberMeta);
    const spark = resolveCompanionPersonality(config, "spark");
    const ash = resolveCompanionPersonality(config, "ash");

    expect(spark.displayName).toBe("Spark");
    expect(spark.energy).toBe("high");
    expect(spark.idleTimeoutMs).toBe(30000);
    expect(deriveCompanionMood("idle", spark)).toBe("excited");

    expect(ash.displayName).toBe("Ash");
    expect(ash.energy).toBe("calm");
    expect(ash.idleTimeoutMs).toBe(30000);
    expect(deriveCompanionMood("idle", ash)).toBe("sleepy");

    let engine = createCompanionEngine({
      config,
      position: { x: 0, y: 0 },
      instanceProfileId: "spark",
    });
    expect(engine.displayName).toBe("Spark");
    expect(engine.mood).toBe("excited");

    engine = engineSetInstanceProfile(engine, config, "ash");
    expect(engine.displayName).toBe("Ash");
    expect(engine.mood).toBe("sleepy");
    expect(engine.instanceProfileId).toBe("ash");
  });

  it("dispatches page_navigation and cursor_nearby generically", () => {
    const config = assertCompanionConfig(emberMeta);
    let engine = createCompanionEngine({
      config,
      position: { x: 40, y: 40 },
    });

    engine = engineDispatchTrigger(engine, config, {
      trigger: "page_navigation",
      payload: { pathname: "/introduction" },
    });
    expect(engine.state).toBe("interacting");
    expect(engine.animation.clipId).toBe("happy");

    engine = createCompanionEngine({
      config,
      position: { x: 40, y: 40 },
    });
    engine = engineDispatchTrigger(engine, config, {
      trigger: "cursor_nearby",
      payload: {
        cursorDistance: 40,
        cursorNearbyRadius: engine.personality.cursorNearbyRadius,
      },
    });
    expect(engine.state).toBe("interacting");
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

    engine = engineEndDrag(engine, config, { width: 1000, height: 800 }, []);
    expect(engine.state).toBe("falling");

    for (let i = 0; i < 300 && engine.state === "falling"; i++) {
      engine = engineTick(engine, config, 16, { width: 1000, height: 800 }, []);
    }

    expect(["landing", "idle"]).toContain(engine.state);

    for (let i = 0; i < 100 && engine.state === "landing"; i++) {
      engine = engineTick(engine, config, 50, { width: 1000, height: 800 }, []);
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

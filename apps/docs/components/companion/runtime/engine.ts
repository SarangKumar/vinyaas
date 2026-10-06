/**
 * Generic companion runtime engine.
 * companion.json → trigger resolver → interaction executor → engine → renderer
 */

import {
  playAnimationClip,
  tickAnimation,
  type AnimationControllerState,
} from "@/components/companion/runtime/animation";
import {
  executeTriggeredInteraction,
  type CooldownMap,
} from "@/components/companion/runtime/interactions";
import {
  deriveCompanionMood,
  resolveCompanionPersonality,
  type ResolvedCompanionPersonality,
} from "@/components/companion/runtime/personality";
import {
  clampCompanionPosition,
  companionFloorY,
  COMPANION_SIZE,
  createPhysicsBody,
  resolveFallTargetY,
  shouldFallOnDrop,
  stepCompanionFall,
  type CompanionPhysicsBody,
  type CompanionVec2,
  type LandingSurface,
} from "@/components/companion/runtime/physics";
import type {
  CompanionConfig,
  CompanionMood,
} from "@/components/companion/runtime/schema";
import {
  clipIdForState,
  transitionCompanionState,
  type CompanionRuntimeState,
} from "@/components/companion/runtime/state-machine";
import type { TriggerEvent } from "@/components/companion/runtime/triggers";

export type CompanionEngineSnapshot = {
  companionId: string;
  instanceProfileId: string | null;
  displayName: string;
  state: CompanionRuntimeState;
  mood: CompanionMood;
  physics: CompanionPhysicsBody;
  animation: AnimationControllerState;
  /** True after the user has placed the companion at least once. */
  placed: boolean;
  ambientElapsedMs: number;
  /** interactionId → ready-at epoch ms */
  cooldowns: CooldownMap;
  /** Active interaction duration budget. */
  interactionDurationMs: number;
  personality: ResolvedCompanionPersonality;
  /** Falling will end in dead instead of landing. */
  deathPending: boolean;
  /** Epoch ms when a dead companion should begin respawn. */
  deadUntilMs: number | null;
  /** Declared surface id the companion is perched on, if any. */
  surfaceId: string | null;
  /** Y to settle to after a jump arc (set when a jump impulse is applied). */
  jumpBaseY: number | null;
  /** Last interaction id that successfully fired (for bond XP). */
  lastInteractionId: string | null;
};

export type CompanionEngineOptions = {
  config: CompanionConfig;
  size?: number;
  position?: CompanionVec2 | null;
  state?: CompanionRuntimeState;
  instanceProfileId?: string | null;
  nowMs?: number;
  surfaceId?: string | null;
  deathPending?: boolean;
  deadUntilMs?: number | null;
};

export type EngineEndDragOptions = {
  size?: number;
  nowMs?: number;
  /** Declared Companion surface under the drop point. */
  dropSurface?: LandingSurface | null;
  surfaceId?: string | null;
  /** Drop center at or below 80vh — enter the death cycle. */
  deathDrop?: boolean;
};

function playForState(
  config: CompanionConfig,
  state: CompanionRuntimeState,
  clipOverride?: string,
): AnimationControllerState {
  const preferred = clipOverride ?? clipIdForState(state);
  return playAnimationClip(config.animations, preferred, "idle");
}

export function createCompanionEngine(
  options: CompanionEngineOptions,
): CompanionEngineSnapshot {
  const state = options.state ?? "idle";
  const position = options.position ?? { x: 0, y: 0 };
  const personality = resolveCompanionPersonality(
    options.config,
    options.instanceProfileId ?? null,
  );

  const snapshot: CompanionEngineSnapshot = {
    companionId: options.config.id,
    instanceProfileId: personality.instanceId,
    displayName: personality.displayName,
    state,
    mood: "neutral",
    physics: createPhysicsBody(position),
    animation: playForState(options.config, state),
    placed: options.position !== null && options.position !== undefined,
    ambientElapsedMs: 0,
    cooldowns: {},
    interactionDurationMs: 0,
    personality,
    deathPending: options.deathPending ?? false,
    deadUntilMs: options.deadUntilMs ?? null,
    surfaceId: options.surfaceId ?? null,
    jumpBaseY: null,
    lastInteractionId: null,
  };

  return {
    ...snapshot,
    mood: deriveCompanionMood(state, personality),
  };
}

function applyState(
  snapshot: CompanionEngineSnapshot,
  config: CompanionConfig,
  nextState: CompanionRuntimeState,
  clipOverride?: string,
  durationMs = 0,
): CompanionEngineSnapshot {
  const transition = transitionCompanionState(snapshot.state, nextState);
  if (!transition.ok && snapshot.state !== nextState) {
    return snapshot;
  }

  const next: CompanionEngineSnapshot = {
    ...snapshot,
    state: nextState,
    animation: playForState(config, nextState, clipOverride),
    ambientElapsedMs: 0,
    interactionDurationMs: durationMs,
    mood: deriveCompanionMood(nextState, snapshot.personality),
  };
  return next;
}

function applyEffect(
  snapshot: CompanionEngineSnapshot,
  config: CompanionConfig,
  effect: {
    nextState: CompanionRuntimeState;
    clipId: string;
    positionDelta?: CompanionVec2;
    velocityImpulse?: CompanionVec2;
    durationMs?: number;
  },
  cooldowns: CooldownMap,
  viewport?: { width: number; height: number },
): CompanionEngineSnapshot {
  let position = { ...snapshot.physics.position };
  let velocity = { ...snapshot.physics.velocity };

  if (effect.positionDelta) {
    position = {
      x: position.x + effect.positionDelta.x,
      y: position.y + effect.positionDelta.y,
    };
  }
  if (effect.velocityImpulse) {
    velocity = {
      x: velocity.x + effect.velocityImpulse.x,
      y: velocity.y + effect.velocityImpulse.y,
    };
  }
  if (viewport) {
    position = clampCompanionPosition(
      position.x,
      position.y,
      viewport.width,
      viewport.height,
    );
  }

  const jumpBaseY =
    effect.velocityImpulse && effect.velocityImpulse.y < 0
      ? snapshot.physics.position.y
      : snapshot.jumpBaseY;

  return applyState(
    {
      ...snapshot,
      cooldowns,
      jumpBaseY,
      physics: { position, velocity },
    },
    config,
    effect.nextState,
    effect.clipId,
    effect.durationMs ?? 0,
  );
}

export function engineDispatchTrigger(
  snapshot: CompanionEngineSnapshot,
  config: CompanionConfig,
  event: TriggerEvent,
  nowMs = Date.now(),
  viewport?: { width: number; height: number },
  allowedInteractionIds?: ReadonlySet<string> | null,
): CompanionEngineSnapshot {
  if (
    snapshot.state === "dead" ||
    snapshot.state === "respawning" ||
    snapshot.state === "falling" ||
    snapshot.state === "puffing"
  ) {
    return snapshot;
  }

  const executed = executeTriggeredInteraction({
    config,
    currentState: snapshot.state,
    request: { trigger: event.trigger, payload: event.payload },
    cooldowns: snapshot.cooldowns,
    nowMs,
    personality: snapshot.personality,
    mood: snapshot.mood,
    allowedInteractionIds,
  });

  if (!executed) {
    return snapshot;
  }

  return {
    ...applyEffect(
      snapshot,
      config,
      executed.effect,
      executed.cooldowns,
      viewport,
    ),
    lastInteractionId: executed.effect.interactionId,
  };
}

export function engineStartDrag(
  snapshot: CompanionEngineSnapshot,
  config: CompanionConfig,
  position: CompanionVec2,
  nowMs = Date.now(),
): CompanionEngineSnapshot {
  if (
    snapshot.state === "dead" ||
    snapshot.state === "respawning" ||
    snapshot.state === "falling" ||
    snapshot.state === "puffing"
  ) {
    return snapshot;
  }

  const withDrag = applyState(
    {
      ...snapshot,
      physics: createPhysicsBody(position, { x: 0, y: 0 }),
      placed: true,
      surfaceId: null,
      deathPending: false,
    },
    config,
    "dragging",
  );

  const triggered = engineDispatchTrigger(
    withDrag,
    config,
    { trigger: "drag_start" },
    nowMs,
  );

  // Grab gesture must remain in dragging regardless of drag_start animation side effects.
  return {
    ...triggered,
    state: "dragging",
    physics: createPhysicsBody(position, { x: 0, y: 0 }),
    placed: true,
    surfaceId: null,
    deathPending: false,
    mood: deriveCompanionMood("dragging", triggered.personality),
  };
}

export function engineMoveDrag(
  snapshot: CompanionEngineSnapshot,
  position: CompanionVec2,
  viewport: { width: number; height: number },
  size = COMPANION_SIZE,
  options: {
    config?: CompanionConfig;
    /** True when the held height would be a fatal drop if released. */
    fatalHeight?: boolean;
  } = {},
): CompanionEngineSnapshot {
  if (snapshot.state !== "dragging") {
    return snapshot;
  }

  const clamped = clampCompanionPosition(
    position.x,
    position.y,
    viewport.width,
    viewport.height,
    size,
  );

  let next: CompanionEngineSnapshot = {
    ...snapshot,
    physics: createPhysicsBody(clamped, { x: 0, y: 0 }),
  };

  const config = options.config;
  if (!config) {
    return next;
  }

  if (options.fatalHeight) {
    if (next.animation.clipId !== "cry") {
      next = {
        ...next,
        animation: playForState(config, "dragging", "cry"),
      };
    }
  } else if (next.animation.clipId === "cry") {
    next = {
      ...next,
      animation: playForState(config, "dragging", "idle"),
    };
  }

  return next;
}

export function engineEndDrag(
  snapshot: CompanionEngineSnapshot,
  config: CompanionConfig,
  viewport: { width: number; height: number },
  surfaces: LandingSurface[],
  options: EngineEndDragOptions = {},
): CompanionEngineSnapshot {
  if (snapshot.state !== "dragging") {
    return snapshot;
  }

  const size = options.size ?? COMPANION_SIZE;
  const nowMs = options.nowMs ?? Date.now();

  let next = engineDispatchTrigger(
    snapshot,
    config,
    { trigger: "drag_end" },
    nowMs,
    viewport,
  );

  if (options.deathDrop) {
    // Fatal height: cry while falling toward the surface, then puff on impact.
    let falling = engineDispatchTrigger(
      {
        ...next,
        physics: {
          ...next.physics,
          velocity: { x: 0, y: 0 },
        },
        deathPending: true,
        surfaceId: null,
        deadUntilMs: null,
      },
      config,
      { trigger: "drop" },
      nowMs,
      viewport,
    );

    if (falling.state !== "falling") {
      falling = applyState(falling, config, "falling", "cry");
    } else {
      falling = {
        ...falling,
        animation: playForState(config, "falling", "cry"),
      };
    }

    return {
      ...falling,
      deathPending: true,
      surfaceId: null,
      deadUntilMs: null,
    };
  }

  if (options.dropSurface) {
    const perchY = options.dropSurface.top - size;
    const clamped = clampCompanionPosition(
      next.physics.position.x,
      perchY,
      viewport.width,
      viewport.height,
      size,
    );

    return applyState(
      {
        ...next,
        deathPending: false,
        deadUntilMs: null,
        surfaceId: options.surfaceId ?? null,
        physics: createPhysicsBody(clamped, { x: 0, y: 0 }),
        placed: true,
      },
      config,
      "landing",
      "happy",
      700,
    );
  }

  const floorY = resolveFallTargetY(
    next.physics.position.x,
    next.physics.position.y,
    companionFloorY(viewport.height, size),
    surfaces,
    companionFloorY(viewport.height, size),
    size,
  );

  if (shouldFallOnDrop(next.physics.position.y, floorY)) {
    next = engineDispatchTrigger(
      {
        ...next,
        physics: {
          ...next.physics,
          velocity: { x: 0, y: 0 },
        },
        deathPending: false,
        surfaceId: null,
      },
      config,
      { trigger: "drop" },
      nowMs,
      viewport,
    );

    if (next.state !== "falling") {
      next = applyState(next, config, "falling", "fall");
    }
    return {
      ...next,
      deathPending: false,
      surfaceId: null,
    };
  }

  return applyState(
    {
      ...next,
      deathPending: false,
      surfaceId: null,
    },
    config,
    "idle",
  );
}

export function engineEnterDead(
  snapshot: CompanionEngineSnapshot,
  config: CompanionConfig,
): CompanionEngineSnapshot {
  return applyState(
    {
      ...snapshot,
      deathPending: false,
      // Permanent death — no respawn timer.
      deadUntilMs: null,
      surfaceId: null,
      physics: {
        ...snapshot.physics,
        velocity: { x: 0, y: 0 },
      },
    },
    config,
    "dead",
    "puff",
  );
}

export function engineBeginRespawn(
  snapshot: CompanionEngineSnapshot,
  config: CompanionConfig,
  position: CompanionVec2,
): CompanionEngineSnapshot {
  if (snapshot.state !== "dead") {
    return snapshot;
  }

  return applyState(
    {
      ...snapshot,
      deathPending: false,
      deadUntilMs: null,
      surfaceId: null,
      placed: true,
      physics: createPhysicsBody(position, { x: 0, y: 0 }),
    },
    config,
    "respawning",
    "happy",
    600,
  );
}

export function engineTriggerClick(
  snapshot: CompanionEngineSnapshot,
  config: CompanionConfig,
  nowMs = Date.now(),
  viewport?: { width: number; height: number },
  allowedInteractionIds?: ReadonlySet<string> | null,
): CompanionEngineSnapshot {
  if (snapshot.state !== "idle" && snapshot.state !== "sleeping") {
    return snapshot;
  }

  return engineDispatchTrigger(
    snapshot,
    config,
    { trigger: "click" },
    nowMs,
    viewport,
    allowedInteractionIds,
  );
}

export function engineTriggerDoubleClick(
  snapshot: CompanionEngineSnapshot,
  config: CompanionConfig,
  nowMs = Date.now(),
  viewport?: { width: number; height: number },
  allowedInteractionIds?: ReadonlySet<string> | null,
): CompanionEngineSnapshot {
  if (snapshot.state !== "idle" && snapshot.state !== "sleeping") {
    return snapshot;
  }

  return engineDispatchTrigger(
    snapshot,
    config,
    { trigger: "double_click" },
    nowMs,
    viewport,
    allowedInteractionIds,
  );
}

const PERCH_FOLLOW_STATES = new Set<CompanionRuntimeState>([
  "idle",
  "sleeping",
  "landing",
  "interacting",
]);

/**
 * Keep a perched companion glued to its surface while the page scrolls.
 * When the surface (or companion) hits the top of the viewport, start falling.
 */
export function engineFollowPerch(
  snapshot: CompanionEngineSnapshot,
  config: CompanionConfig,
  surface: LandingSurface | null,
  viewport: { width: number; height: number },
  size = COMPANION_SIZE,
): CompanionEngineSnapshot {
  if (!snapshot.surfaceId || !PERCH_FOLLOW_STATES.has(snapshot.state)) {
    return snapshot;
  }

  if (!surface) {
    return applyState(
      {
        ...snapshot,
        surfaceId: null,
        physics: {
          ...snapshot.physics,
          velocity: { x: 0, y: 0 },
        },
      },
      config,
      "falling",
      "fall",
    );
  }

  const perchY = surface.top - size;
  // Surface scrolled off the top — tip over and fall.
  if (surface.top <= size || perchY < 0) {
    return applyState(
      {
        ...snapshot,
        surfaceId: null,
        physics: {
          position: clampCompanionPosition(
            snapshot.physics.position.x,
            Math.max(0, perchY),
            viewport.width,
            viewport.height,
            size,
          ),
          velocity: { x: 0, y: 0 },
        },
      },
      config,
      "falling",
      "fall",
    );
  }

  const minX = surface.left;
  const maxX = Math.max(surface.left, surface.right - size);
  const x = Math.min(Math.max(snapshot.physics.position.x, minX), maxX);
  const clamped = clampCompanionPosition(
    x,
    perchY,
    viewport.width,
    viewport.height,
    size,
  );

  if (
    clamped.x === snapshot.physics.position.x &&
    clamped.y === snapshot.physics.position.y
  ) {
    return snapshot;
  }

  return {
    ...snapshot,
    physics: createPhysicsBody(clamped, { x: 0, y: 0 }),
  };
}

export function engineTick(
  snapshot: CompanionEngineSnapshot,
  config: CompanionConfig,
  dtMs: number,
  viewport: { width: number; height: number },
  surfaces: LandingSurface[] = [],
  size = COMPANION_SIZE,
  nowMs = Date.now(),
  allowedInteractionIds?: ReadonlySet<string> | null,
): CompanionEngineSnapshot {
  let next: CompanionEngineSnapshot = {
    ...snapshot,
    animation: tickAnimation(snapshot.animation, dtMs),
    ambientElapsedMs: snapshot.ambientElapsedMs + dtMs,
    mood: deriveCompanionMood(snapshot.state, snapshot.personality),
  };

  if (next.state === "dead") {
    return next;
  }

  if (next.state === "puffing") {
    const budget =
      next.interactionDurationMs > 0 ? next.interactionDurationMs : 480;
    if (next.animation.finished || next.ambientElapsedMs >= budget) {
      return engineEnterDead(next, config);
    }
    return next;
  }

  if (next.state === "respawning") {
    if (
      next.animation.finished ||
      (next.interactionDurationMs > 0 &&
        next.ambientElapsedMs >= next.interactionDurationMs)
    ) {
      return applyState(next, config, "idle");
    }
    return next;
  }

  if (next.state === "falling") {
    const viewportFloor = companionFloorY(viewport.height, size);
    // Fatal falls still land on the surface beneath, then puff on impact.
    const projected = stepCompanionFall(
      next.physics,
      viewportFloor,
      dtMs / (1000 / 60),
    );
    const targetY = resolveFallTargetY(
      next.physics.position.x,
      next.physics.position.y,
      projected.position.y,
      surfaces,
      viewportFloor,
      size,
    );
    const stepped = stepCompanionFall(
      next.physics,
      targetY,
      dtMs / (1000 / 60),
    );
    const clamped = clampCompanionPosition(
      stepped.position.x,
      stepped.position.y,
      viewport.width,
      viewport.height,
      size,
    );

    next = {
      ...next,
      physics: {
        position: clamped,
        velocity: stepped.velocity,
      },
    };

    if (next.deathPending && stepped.landed) {
      return applyState(
        {
          ...next,
          physics: createPhysicsBody(clamped, { x: 0, y: 0 }),
          deathPending: false,
          surfaceId: null,
        },
        config,
        "puffing",
        "puff",
        520,
      );
    }

    if (stepped.landed) {
      next = applyState(
        {
          ...next,
          physics: createPhysicsBody(clamped, { x: 0, y: 0 }),
          deathPending: false,
        },
        config,
        "landing",
        "happy",
        700,
      );
    }

    return next;
  }

  if (next.state === "landing") {
    if (
      next.animation.finished ||
      (next.interactionDurationMs > 0 &&
        next.ambientElapsedMs >= next.interactionDurationMs)
    ) {
      return applyState(next, config, "idle");
    }
    return next;
  }

  if (next.state === "interacting") {
    const budget =
      next.interactionDurationMs > 0 ? next.interactionDurationMs : 1800;

    // Ease jump arcs when a velocity impulse was applied.
    if (next.physics.velocity.y !== 0 || next.physics.velocity.x !== 0) {
      const baseY = next.jumpBaseY ?? next.physics.position.y;
      const floorY = companionFloorY(viewport.height, size);
      const settleY = Math.min(baseY, floorY);
      const frame = dtMs / (1000 / 60);
      let vy = next.physics.velocity.y + 0.55 * frame;
      let y = next.physics.position.y + vy * frame;
      let vx = next.physics.velocity.x * 0.9;
      const x = next.physics.position.x + vx * frame;

      if (y >= settleY && vy >= 0) {
        y = settleY;
        vy = 0;
        vx = 0;
      }

      const clamped = clampCompanionPosition(
        x,
        y,
        viewport.width,
        viewport.height,
        size,
      );
      next = {
        ...next,
        physics: {
          position: clamped,
          velocity: { x: vx, y: vy },
        },
      };
    }

    if (next.animation.finished || next.ambientElapsedMs >= budget) {
      return applyState(
        {
          ...next,
          jumpBaseY: null,
          physics: {
            ...next.physics,
            velocity: { x: 0, y: 0 },
          },
        },
        config,
        "idle",
      );
    }
    return next;
  }

  if (next.state === "sleeping") {
    const budget =
      next.interactionDurationMs > 0 ? next.interactionDurationMs : 4200;
    if (next.ambientElapsedMs >= budget) {
      return applyState(next, config, "idle");
    }
    return next;
  }

  if (next.state === "idle") {
    if (next.ambientElapsedMs >= next.personality.idleTimeoutMs) {
      return engineDispatchTrigger(
        { ...next, ambientElapsedMs: 0 },
        config,
        { trigger: "idle_timeout" },
        nowMs,
        viewport,
        allowedInteractionIds,
      );
    }
  }

  return next;
}

export function engineSetPosition(
  snapshot: CompanionEngineSnapshot,
  position: CompanionVec2,
): CompanionEngineSnapshot {
  return {
    ...snapshot,
    placed: true,
    physics: {
      ...snapshot.physics,
      position: { ...position },
    },
  };
}

export function engineSetInstanceProfile(
  snapshot: CompanionEngineSnapshot,
  config: CompanionConfig,
  instanceProfileId: string | null,
): CompanionEngineSnapshot {
  const personality = resolveCompanionPersonality(config, instanceProfileId);
  return {
    ...snapshot,
    instanceProfileId: personality.instanceId,
    displayName: personality.displayName,
    personality,
    mood: deriveCompanionMood(snapshot.state, personality),
  };
}

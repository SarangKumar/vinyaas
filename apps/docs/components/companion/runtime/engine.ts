/**
 * Generic companion runtime engine.
 * companion.json → engine snapshot → renderer
 */

import {
  playAnimationClip,
  tickAnimation,
  type AnimationControllerState,
} from "@/components/companion/runtime/animation";
import {
  pickAmbientInteractionId,
  pickClickInteractionId,
  resolveInteraction,
} from "@/components/companion/runtime/interactions";
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
import type { CompanionConfig } from "@/components/companion/runtime/schema";
import {
  clipIdForState,
  transitionCompanionState,
  type CompanionRuntimeState,
} from "@/components/companion/runtime/state-machine";

export type CompanionEngineSnapshot = {
  companionId: string;
  state: CompanionRuntimeState;
  physics: CompanionPhysicsBody;
  animation: AnimationControllerState;
  /** True after the user has placed the companion at least once. */
  placed: boolean;
  ambientElapsedMs: number;
};

export type CompanionEngineOptions = {
  config: CompanionConfig;
  size?: number;
  position?: CompanionVec2 | null;
  state?: CompanionRuntimeState;
};

function ambientDurationMs(state: CompanionRuntimeState) {
  switch (state) {
    case "sleeping":
      return 4200;
    case "interacting":
      return 1800;
    case "landing":
      return 700;
    default:
      return 2800;
  }
}

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
  const size = options.size ?? COMPANION_SIZE;
  const state = options.state ?? "idle";
  const position = options.position ?? {
    x: 0,
    y: 0,
  };

  return {
    companionId: options.config.id,
    state,
    physics: createPhysicsBody(position),
    animation: playForState(options.config, state),
    placed: options.position !== null && options.position !== undefined,
    ambientElapsedMs: 0,
  };
}

function applyState(
  snapshot: CompanionEngineSnapshot,
  config: CompanionConfig,
  nextState: CompanionRuntimeState,
  clipOverride?: string,
): CompanionEngineSnapshot {
  const transition = transitionCompanionState(snapshot.state, nextState);
  if (!transition.ok && snapshot.state !== nextState) {
    return snapshot;
  }

  return {
    ...snapshot,
    state: nextState,
    animation: playForState(config, nextState, clipOverride),
    ambientElapsedMs: 0,
  };
}

export function engineStartDrag(
  snapshot: CompanionEngineSnapshot,
  config: CompanionConfig,
  position: CompanionVec2,
): CompanionEngineSnapshot {
  return {
    ...applyState(snapshot, config, "dragging"),
    physics: createPhysicsBody(position, { x: 0, y: 0 }),
    placed: true,
  };
}

export function engineMoveDrag(
  snapshot: CompanionEngineSnapshot,
  position: CompanionVec2,
  viewport: { width: number; height: number },
  size = COMPANION_SIZE,
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

  return {
    ...snapshot,
    physics: createPhysicsBody(clamped, { x: 0, y: 0 }),
  };
}

export function engineEndDrag(
  snapshot: CompanionEngineSnapshot,
  config: CompanionConfig,
  viewport: { width: number; height: number },
  surfaces: LandingSurface[],
  size = COMPANION_SIZE,
): CompanionEngineSnapshot {
  if (snapshot.state !== "dragging") {
    return snapshot;
  }

  const floorY = resolveFallTargetY(
    snapshot.physics.position.x,
    snapshot.physics.position.y,
    companionFloorY(viewport.height, size),
    surfaces,
    companionFloorY(viewport.height, size),
    size,
  );

  if (shouldFallOnDrop(snapshot.physics.position.y, floorY)) {
    const fall = resolveInteraction({
      config,
      currentState: snapshot.state,
      request: { interactionId: "fall", trigger: "drop" },
    });

    return applyState(
      {
        ...snapshot,
        physics: {
          ...snapshot.physics,
          velocity: { x: 0, y: 0 },
        },
      },
      config,
      fall?.nextState ?? "falling",
      fall?.clipId ?? "fall",
    );
  }

  return applyState(snapshot, config, "idle");
}

export function engineTriggerClick(
  snapshot: CompanionEngineSnapshot,
  config: CompanionConfig,
): CompanionEngineSnapshot {
  if (snapshot.state !== "idle" && snapshot.state !== "sleeping") {
    return snapshot;
  }

  const interactionId = pickClickInteractionId(config);
  if (!interactionId) {
    return snapshot;
  }

  const effect = resolveInteraction({
    config,
    currentState: snapshot.state,
    request: { interactionId, trigger: "click" },
  });

  if (!effect) {
    return snapshot;
  }

  return applyState(snapshot, config, effect.nextState, effect.clipId);
}

export function engineTick(
  snapshot: CompanionEngineSnapshot,
  config: CompanionConfig,
  dtMs: number,
  viewport: { width: number; height: number },
  surfaces: LandingSurface[] = [],
  size = COMPANION_SIZE,
  random = Math.random,
): CompanionEngineSnapshot {
  let next: CompanionEngineSnapshot = {
    ...snapshot,
    animation: tickAnimation(snapshot.animation, dtMs),
    ambientElapsedMs: snapshot.ambientElapsedMs + dtMs,
  };

  if (next.state === "falling") {
    const viewportFloor = companionFloorY(viewport.height, size);
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

    if (stepped.landed) {
      next = applyState(
        {
          ...next,
          physics: createPhysicsBody(clamped, { x: 0, y: 0 }),
        },
        config,
        "landing",
        "happy",
      );
    }

    return next;
  }

  if (next.state === "landing") {
    if (next.animation.finished || next.ambientElapsedMs >= ambientDurationMs("landing")) {
      return applyState(next, config, "idle");
    }
    return next;
  }

  if (next.state === "interacting") {
    if (next.animation.finished || next.ambientElapsedMs >= ambientDurationMs("interacting")) {
      return applyState(next, config, "idle");
    }
    return next;
  }

  if (next.state === "sleeping") {
    if (next.ambientElapsedMs >= ambientDurationMs("sleeping")) {
      return applyState(next, config, "idle");
    }
    return next;
  }

  if (next.state === "idle") {
    if (next.ambientElapsedMs >= ambientDurationMs("idle")) {
      const interactionId = pickAmbientInteractionId(config, random);
      const effect = resolveInteraction({
        config,
        currentState: next.state,
        request: { interactionId, trigger: "ambient" },
      });

      if (effect) {
        return applyState(next, config, effect.nextState, effect.clipId);
      }

      return {
        ...next,
        ambientElapsedMs: 0,
      };
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

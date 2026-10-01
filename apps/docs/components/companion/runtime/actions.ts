/**
 * Reusable interaction actions — work for every companion.
 */

import type {
  CompanionInteractionAction,
  CompanionInteractionDefinition,
} from "@/components/companion/runtime/schema";
import type { CompanionRuntimeState } from "@/components/companion/runtime/state-machine";
import type { CompanionVec2 } from "@/components/companion/runtime/physics";

export type ActionResult = {
  nextState: CompanionRuntimeState;
  clipId: string;
  /** Optional instantaneous position nudge (jump / move). */
  positionDelta?: CompanionVec2;
  /** Optional velocity impulse. */
  velocityImpulse?: CompanionVec2;
  durationMs?: number;
};

const STATE_VALUES = new Set<CompanionRuntimeState>([
  "idle",
  "dragging",
  "falling",
  "landing",
  "sleeping",
  "interacting",
]);

function asRuntimeState(value: string | undefined): CompanionRuntimeState | null {
  if (!value) {
    return null;
  }
  return STATE_VALUES.has(value as CompanionRuntimeState)
    ? (value as CompanionRuntimeState)
    : null;
}

/**
 * Execute a metadata action into a concrete runtime effect.
 */
export function executeInteractionAction(
  interaction: CompanionInteractionDefinition,
  currentState: CompanionRuntimeState,
): ActionResult | null {
  const action: CompanionInteractionAction = interaction.action;
  const clipId = interaction.animation ?? "idle";
  const durationMs = interaction.duration;

  switch (action) {
    case "play_animation":
      return {
        nextState: currentState === "sleeping" ? "interacting" : "interacting",
        clipId,
        durationMs,
      };

    case "change_state": {
      const nextState =
        asRuntimeState(interaction.state) ??
        (clipId === "fall" ? "falling" : clipId === "sleep" ? "sleeping" : "idle");
      return {
        nextState,
        clipId: interaction.animation ?? (nextState === "falling" ? "fall" : "idle"),
        durationMs,
      };
    }

    case "jump":
      return {
        nextState: "interacting",
        clipId: interaction.animation ?? "happy",
        positionDelta: { x: 0, y: -18 },
        velocityImpulse: { x: 0, y: -2 },
        durationMs: durationMs ?? 1400,
      };

    case "sleep":
      return {
        nextState: "sleeping",
        clipId: interaction.animation ?? "sleep",
        durationMs: durationMs ?? 4200,
      };

    case "move":
      return {
        nextState: "interacting",
        clipId: interaction.animation ?? "idle",
        positionDelta: { x: 12, y: 0 },
        durationMs: durationMs ?? 1000,
      };

    default:
      return null;
  }
}

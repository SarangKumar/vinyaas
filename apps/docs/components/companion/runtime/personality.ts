/**
 * Companion instance personality + deterministic mood.
 * Base assets stay on the species; instances only override behavior/display.
 */

import type {
  CompanionConfig,
  CompanionEnergyPreference,
  CompanionInstanceProfile,
  CompanionMood,
} from "@/components/companion/runtime/schema";
import type { CompanionRuntimeState } from "@/components/companion/runtime/state-machine";

export type ResolvedCompanionPersonality = {
  instanceId: string | null;
  displayName: string;
  personalityTraits: string[];
  moodBias: CompanionMood;
  energy: CompanionEnergyPreference;
  idleTimeoutMs: number;
  cursorNearbyRadius: number;
};

const ENERGY_IDLE_MS: Record<CompanionEnergyPreference, number> = {
  high: 30_000,
  balanced: 30_000,
  calm: 30_000,
};

export function resolveCompanionPersonality(
  config: CompanionConfig,
  instanceId: string | null = null,
): ResolvedCompanionPersonality {
  const profile: CompanionInstanceProfile | undefined =
    instanceId && config.instances ? config.instances[instanceId] : undefined;

  const energy = profile?.behavior?.energy ?? "balanced";

  return {
    instanceId: profile ? instanceId : null,
    displayName: profile?.name ?? config.name,
    personalityTraits: profile?.personalityTraits ?? config.personalityTraits,
    moodBias: profile?.moodBias ?? "neutral",
    energy,
    idleTimeoutMs: profile?.behavior?.idleTimeoutMs ?? ENERGY_IDLE_MS[energy],
    cursorNearbyRadius: profile?.behavior?.cursorNearbyRadius ?? 120,
  };
}

/**
 * Deterministic mood from runtime state + personality bias. No AI.
 */
export function deriveCompanionMood(
  state: CompanionRuntimeState,
  personality: ResolvedCompanionPersonality,
): CompanionMood {
  if (state === "sleeping" || state === "dead" || state === "puffing") {
    return "sleepy";
  }
  if (state === "falling") {
    return "excited";
  }
  if (
    state === "landing" ||
    state === "interacting" ||
    state === "respawning"
  ) {
    if (personality.moodBias === "excited") {
      return "excited";
    }
    return "happy";
  }
  if (state === "dragging") {
    return personality.energy === "calm" ? "neutral" : "excited";
  }

  // Idle / default
  if (personality.energy === "calm") {
    return personality.moodBias === "sleepy" ? "sleepy" : "neutral";
  }
  if (personality.energy === "high") {
    return personality.moodBias === "excited" ? "excited" : "happy";
  }
  return personality.moodBias;
}

/** Mood can nudge which idle_timeout interaction is preferred. */
export function moodPreferredIdleInteractionId(
  mood: CompanionMood,
): string | null {
  switch (mood) {
    case "sleepy":
      return "sleep";
    case "happy":
    case "excited":
      return "celebrate";
    default:
      return "idle";
  }
}

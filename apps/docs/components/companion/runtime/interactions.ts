/**
 * Interaction executor: trigger → cooldown check → action → effect.
 * Generic for all companions.
 */

import { executeInteractionAction, type ActionResult } from "@/components/companion/runtime/actions";
import {
  moodPreferredIdleInteractionId,
  type ResolvedCompanionPersonality,
} from "@/components/companion/runtime/personality";
import type {
  CompanionConfig,
  CompanionInteractionDefinition,
  CompanionMood,
} from "@/components/companion/runtime/schema";
import type { CompanionRuntimeState } from "@/components/companion/runtime/state-machine";
import {
  resolveTriggerInteraction,
  type TriggerEvent,
} from "@/components/companion/runtime/triggers";

export type InteractionTrigger = TriggerEvent["trigger"];

export type InteractionRequest = {
  interactionId?: string;
  trigger: InteractionTrigger;
  payload?: TriggerEvent["payload"];
};

export type InteractionEffect = ActionResult & {
  interactionId: string;
  cooldownMs: number;
};

export type CooldownMap = Record<string, number>;

export function isInteractionReady(
  interaction: CompanionInteractionDefinition,
  cooldowns: CooldownMap,
  nowMs: number,
): boolean {
  const readyAt = cooldowns[interaction.id] ?? 0;
  return nowMs >= readyAt;
}

export function markInteractionCooldown(
  cooldowns: CooldownMap,
  interaction: CompanionInteractionDefinition,
  nowMs: number,
): CooldownMap {
  const cooldownMs = interaction.cooldown ?? 0;
  if (cooldownMs <= 0) {
    return cooldowns;
  }
  return {
    ...cooldowns,
    [interaction.id]: nowMs + cooldownMs,
  };
}

/**
 * Resolve + execute an interaction for a trigger event.
 */
export function executeTriggeredInteraction(args: {
  config: CompanionConfig;
  currentState: CompanionRuntimeState;
  request: InteractionRequest;
  cooldowns: CooldownMap;
  nowMs: number;
  personality?: ResolvedCompanionPersonality;
  mood?: CompanionMood;
}): { effect: InteractionEffect; cooldowns: CooldownMap } | null {
  const ready = (interaction: CompanionInteractionDefinition) =>
    isInteractionReady(interaction, args.cooldowns, args.nowMs);

  let interaction: CompanionInteractionDefinition | null = null;

  if (args.request.interactionId) {
    const found = args.config.interactions.find(
      (item) => item.id === args.request.interactionId,
    );
    if (found && ready(found)) {
      interaction = found;
    }
  } else {
    const payload = { ...args.request.payload };
    if (
      args.request.trigger === "cursor_nearby" &&
      args.personality &&
      payload.cursorNearbyRadius === undefined
    ) {
      payload.cursorNearbyRadius = args.personality.cursorNearbyRadius;
    }

    interaction = resolveTriggerInteraction(
      args.config,
      {
        trigger: args.request.trigger,
        payload,
      },
      ready,
    );

    // Mood can prefer a specific idle_timeout interaction when multiple match.
    if (
      args.request.trigger === "idle_timeout" &&
      args.mood &&
      interaction
    ) {
      const preferredId = moodPreferredIdleInteractionId(args.mood);
      if (preferredId) {
        const preferred = args.config.interactions.find(
          (item) =>
            item.id === preferredId &&
            item.trigger === "idle_timeout" &&
            ready(item),
        );
        if (preferred) {
          interaction = preferred;
        }
      }
    }
  }

  if (!interaction) {
    return null;
  }

  // Capability gate for click-like reactions.
  if (
    (interaction.trigger === "click" ||
      interaction.trigger === "double_click") &&
    !args.config.capabilities.reactToClick
  ) {
    return null;
  }

  const actionResult = executeInteractionAction(
    interaction,
    args.currentState,
  );
  if (!actionResult) {
    return null;
  }

  const effect: InteractionEffect = {
    ...actionResult,
    interactionId: interaction.id,
    cooldownMs: interaction.cooldown ?? 0,
  };

  return {
    effect,
    cooldowns: markInteractionCooldown(
      args.cooldowns,
      interaction,
      args.nowMs,
    ),
  };
}

/** @deprecated Prefer executeTriggeredInteraction. */
export function resolveInteraction(args: {
  config: CompanionConfig;
  currentState: CompanionRuntimeState;
  request: { interactionId: string; trigger: InteractionTrigger };
}): { nextState: CompanionRuntimeState; clipId: string } | null {
  const result = executeTriggeredInteraction({
    config: args.config,
    currentState: args.currentState,
    request: {
      interactionId: args.request.interactionId,
      trigger: args.request.trigger,
    },
    cooldowns: {},
    nowMs: Date.now(),
  });
  if (!result) {
    return null;
  }
  return {
    nextState: result.effect.nextState,
    clipId: result.effect.clipId,
  };
}

export function hasInteraction(
  config: CompanionConfig,
  interactionId: string,
): boolean {
  return config.interactions.some((item) => item.id === interactionId);
}

export function pickClickInteractionId(config: CompanionConfig): string | null {
  if (!config.capabilities.reactToClick) {
    return null;
  }
  const click = config.interactions.find((item) => item.trigger === "click");
  return click?.id ?? null;
}

export function pickAmbientInteractionId(
  config: CompanionConfig,
  _random = Math.random,
): string {
  const idle = config.interactions.find(
    (item) => item.trigger === "idle_timeout",
  );
  return idle?.id ?? "idle";
}

/** No-ops kept for older tests that reset handler registries. */
export function clearInteractionHandlers() {}
export function installDefaultInteractionHandlers() {}
export function registerInteractionHandler(
  _id: string,
  _handler: unknown,
) {}

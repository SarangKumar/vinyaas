/**
 * Generic trigger resolver.
 * Matches runtime events to companion.json interactions.
 */

import type {
  CompanionConfig,
  CompanionInteractionDefinition,
  CompanionInteractionTrigger,
} from "@/components/companion/runtime/schema";

export type TriggerEvent = {
  trigger: CompanionInteractionTrigger;
  /** Optional payload for cursor distance, navigation path, etc. */
  payload?: {
    cursorDistance?: number;
    /** Overrides the default nearby radius when provided by personality. */
    cursorNearbyRadius?: number;
    pathname?: string;
  };
};

export function interactionsForTrigger(
  config: CompanionConfig,
  trigger: CompanionInteractionTrigger,
): CompanionInteractionDefinition[] {
  return config.interactions.filter((item) => item.trigger === trigger);
}

function pickPreferredInteraction(
  matches: CompanionInteractionDefinition[],
): CompanionInteractionDefinition | null {
  const preferredOrder = [
    "react-click",
    "celebrate",
    "jump",
    "fall",
    "sleep",
    "idle",
    "follow-cursor",
  ];

  for (const id of preferredOrder) {
    const found = matches.find((item) => item.id === id);
    if (found) {
      return found;
    }
  }

  return matches[0] ?? null;
}

/**
 * Resolve the first eligible interaction for a trigger.
 * Prefers a stable primary interaction; cooldown filtering happens in the executor
 * so a cooling preferred interaction does not silently fall through to another.
 */
export function resolveTriggerInteraction(
  config: CompanionConfig,
  event: TriggerEvent,
  isReady: (interaction: CompanionInteractionDefinition) => boolean,
): CompanionInteractionDefinition | null {
  const matches = interactionsForTrigger(config, event.trigger);

  if (event.trigger === "cursor_nearby") {
    const radius = event.payload?.cursorNearbyRadius ?? 120;
    const distance = event.payload?.cursorDistance;
    if (distance === undefined || distance > radius) {
      return null;
    }
    const preferred = pickPreferredInteraction(matches);
    if (!preferred || !isReady(preferred)) {
      return null;
    }
    return preferred;
  }

  const preferred = pickPreferredInteraction(matches);
  if (!preferred || !isReady(preferred)) {
    return null;
  }

  return preferred;
}

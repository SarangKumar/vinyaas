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
    theme?: string;
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
  isReady: (interaction: CompanionInteractionDefinition) => boolean,
): CompanionInteractionDefinition | null {
  const preferredOrder = [
    "react-click",
    "celebrate",
    "wake",
    "jump",
    "surprise",
    "sleep",
    "blink",
    "idle",
    "scroll-glance",
    "dance",
    "nearby",
    "glow",
    "follow-cursor",
    "page-hello",
    "theme-shift",
    "spin",
    "drag-start",
    "wiggle",
    "fall",
  ];

  for (const id of preferredOrder) {
    const found = matches.find((item) => item.id === id);
    if (found && isReady(found)) {
      return found;
    }
  }

  return matches.find((item) => isReady(item)) ?? null;
}

/**
 * Resolve the first eligible interaction for a trigger.
 * Walks a preferred order, then any other ready match for that trigger.
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
  }

  return pickPreferredInteraction(matches, isReady);
}

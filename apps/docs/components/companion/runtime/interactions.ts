/**
 * Generic interaction registry.
 * Handlers key off interaction ids from companion.json — never companion ids.
 */

import type { CompanionConfig } from "@/components/companion/runtime/schema";
import type { CompanionRuntimeState } from "@/components/companion/runtime/state-machine";

export type InteractionTrigger =
  | "click"
  | "drop"
  | "ambient"
  | "land"
  | "manual";

export type InteractionRequest = {
  /** Interaction id from companion.json (e.g. react-click, sleep, fall). */
  interactionId: string;
  trigger: InteractionTrigger;
};

export type InteractionEffect = {
  nextState: CompanionRuntimeState;
  clipId: string;
};

export type InteractionHandler = (args: {
  config: CompanionConfig;
  currentState: CompanionRuntimeState;
  request: InteractionRequest;
}) => InteractionEffect | null;

const handlers = new Map<string, InteractionHandler>();

function register(id: string, handler: InteractionHandler) {
  handlers.set(id, handler);
}

/** Built-in generic handlers shared by all companions. */
export function installDefaultInteractionHandlers() {
  if (handlers.size > 0) {
    return;
  }

  register("react-click", () => ({
    nextState: "interacting",
    clipId: "happy",
  }));

  register("celebrate", () => ({
    nextState: "interacting",
    clipId: "happy",
  }));

  register("surprise", () => ({
    nextState: "interacting",
    clipId: "happy",
  }));

  register("sleep", () => ({
    nextState: "sleeping",
    clipId: "sleep",
  }));

  register("wake", () => ({
    nextState: "idle",
    clipId: "idle",
  }));

  register("fall", () => ({
    nextState: "falling",
    clipId: "fall",
  }));

  register("idle", () => ({
    nextState: "idle",
    clipId: "idle",
  }));

  register("dance", () => ({
    nextState: "interacting",
    clipId: "happy",
  }));

  register("jump", () => ({
    nextState: "interacting",
    clipId: "happy",
  }));
}

export function clearInteractionHandlers() {
  handlers.clear();
}

export function registerInteractionHandler(
  id: string,
  handler: InteractionHandler,
) {
  handlers.set(id, handler);
}

export function hasInteraction(
  config: CompanionConfig,
  interactionId: string,
): boolean {
  return config.interactions.some((item) => item.id === interactionId);
}

/**
 * Resolve an interaction against the companion's declared interactions
 * and the generic handler registry.
 */
export function resolveInteraction(args: {
  config: CompanionConfig;
  currentState: CompanionRuntimeState;
  request: InteractionRequest;
}): InteractionEffect | null {
  installDefaultInteractionHandlers();

  if (!hasInteraction(args.config, args.request.interactionId)) {
    return null;
  }

  const handler = handlers.get(args.request.interactionId);
  if (!handler) {
    return null;
  }

  return handler(args);
}

/**
 * Pick a click interaction declared by the companion, preferring react-click.
 */
export function pickClickInteractionId(config: CompanionConfig): string | null {
  if (!config.capabilities.reactToClick) {
    return null;
  }

  const preferred = ["react-click", "celebrate", "surprise", "dance", "jump"];
  for (const id of preferred) {
    if (hasInteraction(config, id)) {
      return id;
    }
  }

  return null;
}

/**
 * Ambient interaction candidates while resting.
 */
export function pickAmbientInteractionId(
  config: CompanionConfig,
  random = Math.random,
): string {
  const roll = random();
  if (roll < 0.55) {
    return "idle";
  }
  if (roll < 0.8 && hasInteraction(config, "celebrate")) {
    return "celebrate";
  }
  if (hasInteraction(config, "sleep")) {
    return "sleep";
  }
  return "idle";
}

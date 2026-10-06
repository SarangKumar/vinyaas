/**
 * Companion runtime state machine.
 * Transitions are generic — never branch on companion id.
 */

export type CompanionRuntimeState =
  | "idle"
  | "dragging"
  | "falling"
  | "landing"
  | "sleeping"
  | "interacting"
  | "puffing"
  | "dead"
  | "respawning";

const ALLOWED: Record<CompanionRuntimeState, readonly CompanionRuntimeState[]> =
  {
    idle: ["dragging", "falling", "sleeping", "interacting", "puffing", "dead"],
    dragging: ["falling", "idle", "landing", "puffing", "dead"],
    falling: ["landing", "puffing", "dead"],
    landing: ["idle", "sleeping"],
    sleeping: ["idle", "dragging", "interacting", "puffing", "dead"],
    interacting: ["idle", "dragging", "sleeping", "puffing", "dead"],
    puffing: ["dead"],
    dead: ["respawning"],
    respawning: ["idle"],
  };

export function canTransition(
  from: CompanionRuntimeState,
  to: CompanionRuntimeState,
): boolean {
  if (from === to) {
    return true;
  }
  return ALLOWED[from].includes(to);
}

export type TransitionResult =
  | { ok: true; state: CompanionRuntimeState }
  | { ok: false; state: CompanionRuntimeState; reason: string };

export function transitionCompanionState(
  from: CompanionRuntimeState,
  to: CompanionRuntimeState,
): TransitionResult {
  if (!canTransition(from, to)) {
    return {
      ok: false,
      state: from,
      reason: `Cannot transition from "${from}" to "${to}".`,
    };
  }

  return { ok: true, state: to };
}

/** Preferred animation clip id for a runtime state. */
export function clipIdForState(state: CompanionRuntimeState): string {
  switch (state) {
    case "sleeping":
      return "sleep";
    case "falling":
      return "fall";
    case "puffing":
    case "dead":
      return "puff";
    case "landing":
    case "interacting":
    case "respawning":
      return "happy";
    case "dragging":
    case "idle":
    default:
      return "idle";
  }
}

/** Non-interactive lifecycle states (still occupy a spawn slot). */
export function isCompanionSlotOccupied(): boolean {
  return true;
}

export function isCompanionInteractive(state: CompanionRuntimeState): boolean {
  return (
    state !== "dead" &&
    state !== "respawning" &&
    state !== "falling" &&
    state !== "puffing"
  );
}

export function isCompanionVisible(state: CompanionRuntimeState): boolean {
  return state !== "dead";
}

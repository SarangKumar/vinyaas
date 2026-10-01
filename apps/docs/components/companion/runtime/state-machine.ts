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
  | "interacting";

const ALLOWED: Record<CompanionRuntimeState, readonly CompanionRuntimeState[]> =
  {
    idle: ["dragging", "falling", "sleeping", "interacting"],
    dragging: ["falling", "idle", "landing"],
    falling: ["landing"],
    landing: ["idle", "sleeping"],
    sleeping: ["idle", "dragging", "interacting"],
    interacting: ["idle", "dragging", "sleeping"],
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
    case "landing":
      return "happy";
    case "interacting":
      return "happy";
    case "dragging":
    case "idle":
    default:
      return "idle";
  }
}

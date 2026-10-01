import type { CompanionAnimationRole } from "@/components/companion/catalog";

/**
 * Choose the next ambient animation role.
 * Weighted toward idle, with occasional happy/sleep.
 */
export function pickAmbientRole(
  current: CompanionAnimationRole,
  random = Math.random,
): CompanionAnimationRole {
  const roll = random();

  if (current === "idle") {
    if (roll < 0.55) {
      return "idle";
    }
    if (roll < 0.8) {
      return "happy";
    }
    return "sleep";
  }

  if (roll < 0.75) {
    return "idle";
  }
  if (roll < 0.9) {
    return "happy";
  }
  return "sleep";
}

/** How long to stay on an ambient role before considering a switch. */
export function ambientRoleDurationMs(role: CompanionAnimationRole) {
  switch (role) {
    case "happy":
      return 1800;
    case "sleep":
      return 4200;
    case "fall":
      return 800;
    case "idle":
    default:
      return 2800;
  }
}

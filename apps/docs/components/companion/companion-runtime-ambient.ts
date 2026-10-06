import type { CompanionAnimationRole } from "@/components/companion/catalog";

/**
 * Choose the next ambient animation role.
 * Weighted toward idle, with occasional happy/blink/sleep.
 */
export function pickAmbientRole(
  current: CompanionAnimationRole,
  random = Math.random,
): CompanionAnimationRole {
  const roll = random();

  if (current === "idle") {
    if (roll < 0.5) {
      return "idle";
    }
    if (roll < 0.75) {
      return "happy";
    }
    if (roll < 0.88) {
      return "blink";
    }
    return "sleep";
  }

  if (roll < 0.7) {
    return "idle";
  }
  if (roll < 0.85) {
    return "happy";
  }
  if (roll < 0.93) {
    return "blink";
  }
  return "sleep";
}

/** How long to stay on an ambient role before considering a switch. */
export function ambientRoleDurationMs(role: CompanionAnimationRole) {
  switch (role) {
    case "happy":
    case "celebrate":
    case "dance":
    case "surprise":
    case "glow":
    case "wiggle":
    case "spin":
      return 1800;
    case "blink":
      return 600;
    case "sleep":
      return 4200;
    case "fall":
    case "cry":
      return 800;
    case "idle":
    default:
      return 2800;
  }
}

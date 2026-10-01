/**
 * Compatibility re-exports for the companion runtime engine.
 * Prefer importing from `@/components/companion/runtime`.
 */

export {
  COMPANION_SIZE,
  COMPANION_FLOOR_INSET,
  COMPANION_GRAVITY,
  COMPANION_MAX_FALL_SPEED,
  companionFloorY,
  clampCompanionPosition,
  findPerchLandingY,
  shouldFallOnDrop,
  stepCompanionFallY as stepCompanionFall,
  resolveFallTargetY,
  type LandingSurface,
  type FallStep,
} from "@/components/companion/runtime/physics";

export {
  frameIntervalMs,
  nextAnimationFrameIndex as nextAnimationFrameIndexLegacy,
} from "@/components/companion/runtime/animation";

import { nextAnimationFrameIndex as nextFrame } from "@/components/companion/runtime/animation";

/** Legacy helper used by CompanionSprite before controlled playback. */
export function nextAnimationFrameIndex(
  current: number,
  frameCount: number,
): number {
  return nextFrame(current, frameCount, true).index;
}

export type CompanionMotionState =
  | "idle"
  | "dragging"
  | "falling"
  | "landing"
  | "sleeping"
  | "interacting";

export {
  pickAmbientRole,
  ambientRoleDurationMs,
} from "@/components/companion/companion-runtime-ambient";

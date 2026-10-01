/** Shared companion motion helpers — no companion-specific branches. */

export type CompanionMotionState = "idle" | "dragging" | "falling";

export const COMPANION_SIZE = 72;
export const COMPANION_FLOOR_INSET = 24;
/** Gravity in pixels per frame-unit² (normalized to ~60fps steps). */
export const COMPANION_GRAVITY = 0.55;
export const COMPANION_MAX_FALL_SPEED = 18;

export function companionFloorY(
  viewportHeight: number,
  size = COMPANION_SIZE,
  inset = COMPANION_FLOOR_INSET,
): number {
  return Math.max(0, viewportHeight - size - inset);
}

export function clampCompanionPosition(
  x: number,
  y: number,
  viewportWidth: number,
  viewportHeight: number,
  size = COMPANION_SIZE,
): { x: number; y: number } {
  const maxX = Math.max(0, viewportWidth - size);
  const maxY = Math.max(0, viewportHeight - size);

  return {
    x: Math.min(Math.max(0, x), maxX),
    y: Math.min(Math.max(0, y), maxY),
  };
}

export type FallStep = {
  y: number;
  vy: number;
  landed: boolean;
};

/**
 * Advance one fall simulation step.
 * `dt` is normalized so `1` ≈ one 60fps frame.
 */
export function stepCompanionFall(
  y: number,
  vy: number,
  floorY: number,
  dt = 1,
): FallStep {
  const nextVy = Math.min(
    COMPANION_MAX_FALL_SPEED,
    vy + COMPANION_GRAVITY * dt,
  );
  const nextY = y + nextVy * dt;

  if (nextY >= floorY) {
    return { y: floorY, vy: 0, landed: true };
  }

  return { y: nextY, vy: nextVy, landed: false };
}

export function shouldFallOnDrop(y: number, floorY: number, threshold = 2) {
  return y < floorY - threshold;
}

export function nextAnimationFrameIndex(
  current: number,
  frameCount: number,
): number {
  if (frameCount <= 0) {
    return 0;
  }

  return (current + 1) % frameCount;
}

export function frameIntervalMs(fps: number) {
  return Math.max(50, Math.round(1000 / Math.max(1, fps)));
}

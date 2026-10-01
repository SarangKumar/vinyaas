/**
 * Lightweight companion physics — position, velocity, gravity, floor/perch.
 * No external libraries.
 */

export const COMPANION_SIZE = 72;
export const COMPANION_FLOOR_INSET = 24;
export const COMPANION_GRAVITY = 0.55;
export const COMPANION_MAX_FALL_SPEED = 18;

export type CompanionVec2 = {
  x: number;
  y: number;
};

export type CompanionPhysicsBody = {
  position: CompanionVec2;
  velocity: CompanionVec2;
};

export type LandingSurface = {
  top: number;
  left: number;
  right: number;
  bottom: number;
};

export type FallStep = {
  position: CompanionVec2;
  velocity: CompanionVec2;
  landed: boolean;
};

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
): CompanionVec2 {
  const maxX = Math.max(0, viewportWidth - size);
  const maxY = Math.max(0, viewportHeight - size);

  return {
    x: Math.min(Math.max(0, x), maxX),
    y: Math.min(Math.max(0, y), maxY),
  };
}

export function createPhysicsBody(
  position: CompanionVec2,
  velocity: CompanionVec2 = { x: 0, y: 0 },
): CompanionPhysicsBody {
  return {
    position: { ...position },
    velocity: { ...velocity },
  };
}

/**
 * Advance one fall simulation step toward a landing Y (surface or floor).
 * `dt` is normalized so `1` ≈ one 60fps frame.
 */
export function stepCompanionFall(
  body: CompanionPhysicsBody,
  floorY: number,
  dt = 1,
): FallStep {
  const nextVy = Math.min(
    COMPANION_MAX_FALL_SPEED,
    body.velocity.y + COMPANION_GRAVITY * dt,
  );
  const nextY = body.position.y + nextVy * dt;

  if (nextY >= floorY) {
    return {
      position: { x: body.position.x, y: floorY },
      velocity: { x: 0, y: 0 },
      landed: true,
    };
  }

  return {
    position: { x: body.position.x, y: nextY },
    velocity: { x: body.velocity.x, y: nextVy },
    landed: false,
  };
}

/** @deprecated Prefer stepCompanionFall with a physics body. */
export function stepCompanionFallY(
  y: number,
  vy: number,
  floorY: number,
  dt = 1,
): { y: number; vy: number; landed: boolean } {
  const stepped = stepCompanionFall(
    createPhysicsBody({ x: 0, y }, { x: 0, y: vy }),
    floorY,
    dt,
  );
  return {
    y: stepped.position.y,
    vy: stepped.velocity.y,
    landed: stepped.landed,
  };
}

/**
 * Pick the nearest perch top below the companion feet within the next fall step.
 * Returns the companion top `y` that sits on that surface, or null.
 */
export function findPerchLandingY(
  x: number,
  y: number,
  nextY: number,
  surfaces: LandingSurface[],
  size = COMPANION_SIZE,
): number | null {
  const pad = size * 0.22;
  const left = x + pad;
  const right = x + size - pad;
  const feetStart = y + size;
  const feetEnd = nextY + size;

  let hitTop: number | null = null;

  for (const surface of surfaces) {
    if (surface.right <= left || surface.left >= right) {
      continue;
    }

    if (surface.top + 0.5 >= feetStart && surface.top <= feetEnd + 1) {
      if (hitTop === null || surface.top < hitTop) {
        hitTop = surface.top;
      }
    }
  }

  if (hitTop === null) {
    return null;
  }

  return hitTop - size;
}

export function shouldFallOnDrop(y: number, floorY: number, threshold = 2) {
  return y < floorY - threshold;
}

export function resolveFallTargetY(
  x: number,
  y: number,
  nextY: number,
  surfaces: LandingSurface[],
  viewportFloorY: number,
  size = COMPANION_SIZE,
): number {
  const perchY = findPerchLandingY(x, y, nextY, surfaces, size);
  if (perchY !== null && perchY < viewportFloorY) {
    return perchY;
  }
  return viewportFloorY;
}

/**
 * Spawn placement helpers for Companion instances.
 */

import {
  clampCompanionPosition,
  COMPANION_SIZE,
  type CompanionVec2,
} from "@/components/companion/runtime/physics";

export const MAX_COMPANION_INSTANCES_PER_TYPE = 1;

/** Minimum spacing between companion tops when spawning. */
const SPAWN_CLEARANCE = COMPANION_SIZE + 16;

export type OccupiedSpawnSlot = {
  x: number;
  y: number;
};

/**
 * Pick a visible spawn position that stays in-viewport and clears existing
 * companions. Prefers the upper-right third of the viewport.
 */
export function findCompanionSpawnPosition(
  viewport: { width: number; height: number },
  occupied: OccupiedSpawnSlot[],
  size = COMPANION_SIZE,
): CompanionVec2 {
  const baseX = Math.max(24, viewport.width - size - 48);
  const baseY = Math.min(
    Math.max(72, Math.round(viewport.height * 0.28)),
    companionFloorCap(viewport.height, size),
  );

  const candidates: CompanionVec2[] = [
    { x: baseX, y: baseY },
    { x: baseX - SPAWN_CLEARANCE, y: baseY },
    { x: baseX, y: baseY + SPAWN_CLEARANCE },
    { x: baseX - SPAWN_CLEARANCE, y: baseY + SPAWN_CLEARANCE },
    { x: Math.round(viewport.width * 0.55), y: baseY },
    { x: Math.round(viewport.width * 0.4), y: baseY + 40 },
    { x: 24, y: baseY },
  ];

  for (const candidate of candidates) {
    const clamped = clampCompanionPosition(
      candidate.x,
      candidate.y,
      viewport.width,
      viewport.height,
      size,
    );
    if (!overlapsAny(clamped, occupied, size)) {
      return clamped;
    }
  }

  // Last resort: nudge downward until clear or floor.
  let fallback = clampCompanionPosition(
    baseX,
    baseY,
    viewport.width,
    viewport.height,
    size,
  );
  for (let i = 0; i < 12; i += 1) {
    if (!overlapsAny(fallback, occupied, size)) {
      return fallback;
    }
    fallback = clampCompanionPosition(
      fallback.x - 12,
      fallback.y + 28,
      viewport.width,
      viewport.height,
      size,
    );
  }

  return fallback;
}

/**
 * Safe respawn after death — prefer upper-mid viewport, avoid stack-ups.
 */
export function findCompanionRespawnPosition(
  viewport: { width: number; height: number },
  occupied: OccupiedSpawnSlot[],
  size = COMPANION_SIZE,
): CompanionVec2 {
  return findCompanionSpawnPosition(viewport, occupied, size);
}

function companionFloorCap(viewportHeight: number, size: number) {
  return Math.max(0, viewportHeight - size - 48);
}

function overlapsAny(
  position: CompanionVec2,
  occupied: OccupiedSpawnSlot[],
  size: number,
): boolean {
  for (const other of occupied) {
    const dx = position.x - other.x;
    const dy = position.y - other.y;
    if (Math.hypot(dx, dy) < SPAWN_CLEARANCE * 0.85) {
      return true;
    }
    // Also treat axis-aligned box overlap as collision.
    if (
      position.x < other.x + size &&
      position.x + size > other.x &&
      position.y < other.y + size &&
      position.y + size > other.y
    ) {
      return true;
    }
  }
  return false;
}

/**
 * Companion bond progression (Pokédex-style unlocks).
 * Persisted in localStorage — survives fatal drops.
 */

export type CompanionElementType =
  | "fire"
  | "grass"
  | "water"
  | "rock"
  | "dragon"
  | "psychic"
  | "ghost"
  | "electric"
  | "ice"
  | "fighting";

/** Element matchups — foundation for future type battles. */
export const ELEMENT_MATCHUPS: Record<
  CompanionElementType,
  { strongAgainst: CompanionElementType[]; weakAgainst: CompanionElementType[] }
> = {
  fire: {
    strongAgainst: ["grass", "ice", "ghost"],
    weakAgainst: ["water", "rock"],
  },
  grass: {
    strongAgainst: ["water", "rock"],
    weakAgainst: ["fire", "ice", "dragon"],
  },
  water: {
    strongAgainst: ["fire", "rock"],
    weakAgainst: ["grass", "electric"],
  },
  rock: {
    strongAgainst: ["fire", "electric", "ice"],
    weakAgainst: ["water", "grass", "fighting"],
  },
  dragon: {
    strongAgainst: ["dragon"],
    weakAgainst: ["ice", "dragon"],
  },
  psychic: {
    strongAgainst: ["fighting", "ghost"],
    weakAgainst: ["psychic", "ghost"],
  },
  ghost: {
    strongAgainst: ["psychic", "ghost"],
    weakAgainst: ["ghost"],
  },
  electric: {
    strongAgainst: ["water"],
    weakAgainst: ["rock"],
  },
  ice: {
    strongAgainst: ["grass", "dragon"],
    weakAgainst: ["fire", "fighting", "rock"],
  },
  fighting: {
    strongAgainst: ["rock", "ice"],
    weakAgainst: ["psychic", "ghost"],
  },
};

export type CompanionBondRecord = {
  companionId: string;
  /** Bond rank 1–5 (shown on cards). Grows with XP. */
  bond: number;
  xp: number;
  interactionCount: number;
  lifetimeMs: number;
  deaths: number;
  /** Evolution stage stub (0 = base). */
  evolutionStage: number;
  unlockedInteractionIds: string[];
  updatedAt: number;
};

const STORAGE_KEY = "vinyaas.companion.bond.v1";

/** XP thresholds to reach bond ranks 2–5. */
export const BOND_THRESHOLDS = [0, 40, 120, 280, 500] as const;

export type EmberUnlockTier = {
  bond: number;
  /** Cumulative awake / alive time required. */
  lifetimeMs: number;
  moveIds: string[];
};

/**
 * Ember unlock tiers — Bond + awake time gate higher moves.
 * Rank 1 = starter kit; higher tiers reveal the rest.
 */
export const EMBER_UNLOCK_TIERS: EmberUnlockTier[] = [
  {
    bond: 1,
    lifetimeMs: 0,
    moveIds: [
      "react-click",
      "drag-start",
      "fall",
      "nearby",
      "scroll-glance",
      "page-hello",
      "idle",
    ],
  },
  {
    bond: 2,
    lifetimeMs: 60_000,
    moveIds: ["jump", "celebrate"],
  },
  {
    bond: 3,
    lifetimeMs: 5 * 60_000,
    moveIds: ["sleep", "wake", "blink"],
  },
  {
    bond: 4,
    lifetimeMs: 15 * 60_000,
    moveIds: ["wave", "dance", "glow"],
  },
  {
    bond: 5,
    lifetimeMs: 30 * 60_000,
    moveIds: ["spin", "surprise", "follow-cursor"],
  },
];

/** @deprecated Prefer EMBER_UNLOCK_TIERS — kept for older call sites. */
export const EMBER_UNLOCK_BY_BOND: Record<number, string[]> = Object.fromEntries(
  EMBER_UNLOCK_TIERS.map((tier) => [tier.bond, tier.moveIds]),
);

export type MoveUnlockRequirement = {
  bond: number;
  lifetimeMs: number;
};

export function unlockRequirementForMove(
  moveId: string,
): MoveUnlockRequirement | null {
  for (const tier of EMBER_UNLOCK_TIERS) {
    if (tier.moveIds.includes(moveId)) {
      return { bond: tier.bond, lifetimeMs: tier.lifetimeMs };
    }
  }
  return null;
}

function formatAwakeRequirement(ms: number): string {
  const totalSec = Math.floor(ms / 1000);
  const m = Math.floor(totalSec / 60);
  const h = Math.floor(m / 60);
  if (h > 0) {
    const rem = m % 60;
    return rem > 0 ? `${h}h ${rem}m` : `${h}h`;
  }
  if (m > 0) {
    return `${m}m`;
  }
  return `${totalSec}s`;
}

export function formatUnlockRequirement(req: MoveUnlockRequirement): string {
  if (req.bond <= 1 && req.lifetimeMs <= 0) {
    return "Starter move — available from spawn";
  }
  const parts = [`Bond ${req.bond}`];
  if (req.lifetimeMs > 0) {
    parts.push(`${formatAwakeRequirement(req.lifetimeMs)} awake`);
  }
  return parts.join(" · ");
}

export function isMoveUnlocked(
  moveId: string,
  bond: number,
  lifetimeMs: number,
): boolean {
  const req = unlockRequirementForMove(moveId);
  if (!req) {
    return true;
  }
  return bond >= req.bond && lifetimeMs >= req.lifetimeMs;
}

export function elementTypeForCompanion(
  companionId: string,
  rawType?: string,
): CompanionElementType {
  if (companionId === "ember" || rawType === "flame") {
    return "fire";
  }
  if (companionId === "moss" || rawType === "frog") {
    return "grass";
  }
  if (companionId === "soul" || rawType === "ghost") {
    return "ghost";
  }
  if (companionId === "flint" || rawType === "pebble") {
    return "rock";
  }
  if (companionId === "bubble" || rawType === "bubble" || rawType === "droplet") {
    return "water";
  }
  if (companionId === "rime" || rawType === "fox") {
    return "ice";
  }
  if (companionId === "jab" || rawType === "fighter") {
    return "fighting";
  }
  if (companionId === "volt" || rawType === "mouse") {
    return "electric";
  }
  return "psychic";
}

export function bondRankFromXp(xp: number): number {
  let rank = 1;
  for (let i = BOND_THRESHOLDS.length - 1; i >= 0; i -= 1) {
    if (xp >= BOND_THRESHOLDS[i]!) {
      rank = i + 1;
      break;
    }
  }
  return Math.min(5, rank);
}

export function unlockedIdsForEmber(
  bond: number,
  lifetimeMs = 0,
): string[] {
  const ids: string[] = [];
  for (const tier of EMBER_UNLOCK_TIERS) {
    if (bond >= tier.bond && lifetimeMs >= tier.lifetimeMs) {
      ids.push(...tier.moveIds);
    }
  }
  return ids;
}

export function defaultBondRecord(companionId: string): CompanionBondRecord {
  const bond = 1;
  const lifetimeMs = 0;
  return {
    companionId,
    bond,
    xp: 0,
    interactionCount: 0,
    lifetimeMs,
    deaths: 0,
    evolutionStage: 0,
    unlockedInteractionIds:
      companionId === "ember" ? unlockedIdsForEmber(bond, lifetimeMs) : [],
    updatedAt: Date.now(),
  };
}

function readAll(): Record<string, CompanionBondRecord> {
  if (typeof window === "undefined") {
    return {};
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {};
    }
    const parsed = JSON.parse(raw) as Record<string, CompanionBondRecord>;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function writeAll(map: Record<string, CompanionBondRecord>) {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
}

export function getCompanionBond(companionId: string): CompanionBondRecord {
  const all = readAll();
  return all[companionId] ?? defaultBondRecord(companionId);
}

export function saveCompanionBond(record: CompanionBondRecord) {
  const all = readAll();
  all[record.companionId] = { ...record, updatedAt: Date.now() };
  writeAll(all);
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("vinyaas:companion-bond"));
  }
}

export function recordCompanionInteraction(
  companionId: string,
  interactionId: string,
  xpGain = 8,
): CompanionBondRecord {
  const current = getCompanionBond(companionId);
  const xp = current.xp + xpGain;
  const bond = bondRankFromXp(xp);
  const unlocked =
    companionId === "ember"
      ? unlockedIdsForEmber(bond, current.lifetimeMs)
      : Array.from(
          new Set([...current.unlockedInteractionIds, interactionId]),
        );

  const next: CompanionBondRecord = {
    ...current,
    xp,
    bond,
    interactionCount: current.interactionCount + 1,
    unlockedInteractionIds: unlocked,
    evolutionStage: bond >= 5 ? 1 : current.evolutionStage,
  };
  saveCompanionBond(next);
  return next;
}

export function recordCompanionLifetime(
  companionId: string,
  deltaMs: number,
): CompanionBondRecord {
  const current = getCompanionBond(companionId);
  const lifetimeMs = current.lifetimeMs + Math.max(0, deltaMs);
  // Slow XP from simply being alive.
  const xp = current.xp + Math.floor(deltaMs / 15_000);
  const bond = bondRankFromXp(xp);
  const next: CompanionBondRecord = {
    ...current,
    lifetimeMs,
    xp,
    bond,
    unlockedInteractionIds:
      companionId === "ember"
        ? unlockedIdsForEmber(bond, lifetimeMs)
        : current.unlockedInteractionIds,
    evolutionStage: bond >= 5 ? Math.max(1, current.evolutionStage) : current.evolutionStage,
  };
  saveCompanionBond(next);
  return next;
}

export function recordCompanionDeath(companionId: string): CompanionBondRecord {
  const current = getCompanionBond(companionId);
  const next: CompanionBondRecord = {
    ...current,
    deaths: current.deaths + 1,
  };
  saveCompanionBond(next);
  return next;
}

export function xpToNextBond(record: CompanionBondRecord): number | null {
  if (record.bond >= 5) {
    return null;
  }
  const nextThreshold = BOND_THRESHOLDS[record.bond];
  if (nextThreshold === undefined) {
    return null;
  }
  return Math.max(0, nextThreshold - record.xp);
}

export function formatLifetime(ms: number): string {
  const totalSec = Math.floor(ms / 1000);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  if (m <= 0) {
    return `${s}s`;
  }
  const h = Math.floor(m / 60);
  if (h <= 0) {
    return `${m}m ${s}s`;
  }
  return `${h}h ${m % 60}m`;
}

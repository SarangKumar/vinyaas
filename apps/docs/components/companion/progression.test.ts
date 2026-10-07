import { afterEach, describe, expect, it } from "vitest";

import {
  BOND_THRESHOLDS,
  DEATH_XP_PENALTY,
  EMBER_UNLOCK_TIERS,
  bondRankFromXp,
  elementTypeForCompanion,
  getCompanionBond,
  recordCompanionDeath,
  resetCompanionBond,
  saveCompanionBond,
  unlockedIdsForEmber,
} from "./progression";

describe("companion progression", () => {
  afterEach(() => {
    window.localStorage.removeItem("vinyaas.companion.bond.v1");
  });

  it("maps Drake to dragon type", () => {
    expect(elementTypeForCompanion("drake", "dragon")).toBe("dragon");
  });

  it("maps Nyx to dark type", () => {
    expect(elementTypeForCompanion("nyx", "shade")).toBe("dark");
  });

  it("uses steeper bond XP thresholds", () => {
    expect(BOND_THRESHOLDS).toEqual([0, 60, 160, 360, 640]);
    expect(bondRankFromXp(59)).toBe(1);
    expect(bondRankFromXp(60)).toBe(2);
    expect(bondRankFromXp(160)).toBe(3);
  });

  it("requires longer awake time for higher Ember unlock tiers", () => {
    expect(EMBER_UNLOCK_TIERS[1]?.lifetimeMs).toBe(2 * 60_000);
    expect(EMBER_UNLOCK_TIERS[4]?.lifetimeMs).toBe(45 * 60_000);
    expect(unlockedIdsForEmber(2, 60_000)).not.toContain("celebrate");
    expect(unlockedIdsForEmber(2, 2 * 60_000)).toContain("celebrate");
  });

  it("reduces XP on fatal death and can drop bond unlocks", () => {
    saveCompanionBond({
      companionId: "ember",
      bond: 2,
      xp: 80,
      interactionCount: 10,
      lifetimeMs: 2 * 60_000,
      deaths: 0,
      evolutionStage: 0,
      unlockedInteractionIds: unlockedIdsForEmber(2, 2 * 60_000),
      updatedAt: Date.now(),
    });

    const after = recordCompanionDeath("ember");
    expect(after.deaths).toBe(1);
    expect(after.xp).toBe(80 - DEATH_XP_PENALTY);
    expect(after.bond).toBe(bondRankFromXp(80 - DEATH_XP_PENALTY));
    expect(after.unlockedInteractionIds).toEqual(
      unlockedIdsForEmber(after.bond, after.lifetimeMs),
    );
    expect(getCompanionBond("ember").xp).toBe(after.xp);
  });

  it("resets one companion without touching others", () => {
    saveCompanionBond({
      companionId: "ember",
      bond: 3,
      xp: 200,
      interactionCount: 20,
      lifetimeMs: 8 * 60_000,
      deaths: 2,
      evolutionStage: 0,
      unlockedInteractionIds: unlockedIdsForEmber(3, 8 * 60_000),
      updatedAt: Date.now(),
    });
    saveCompanionBond({
      companionId: "drake",
      bond: 2,
      xp: 90,
      interactionCount: 8,
      lifetimeMs: 5_000,
      deaths: 1,
      evolutionStage: 0,
      unlockedInteractionIds: [],
      updatedAt: Date.now(),
    });

    const reset = resetCompanionBond("ember");
    expect(reset.xp).toBe(0);
    expect(reset.bond).toBe(1);
    expect(reset.deaths).toBe(0);
    expect(reset.lifetimeMs).toBe(0);
    expect(reset.unlockedInteractionIds).toEqual(unlockedIdsForEmber(1, 0));
    expect(reset.unlockedInteractionIds).not.toContain("celebrate");
    expect(reset.unlockedInteractionIds).not.toContain("spin");
    expect(getCompanionBond("ember").xp).toBe(0);
    expect(getCompanionBond("ember").unlockedInteractionIds).toEqual(
      unlockedIdsForEmber(1, 0),
    );
    expect(getCompanionBond("drake").xp).toBe(90);
    expect(getCompanionBond("drake").deaths).toBe(1);
  });
});

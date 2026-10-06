"use client";

import { useCallback, useSyncExternalStore } from "react";

import {
  defaultBondRecord,
  getCompanionBond,
  type CompanionBondRecord,
} from "@/components/companion/progression";

const BOND_EVENT = "vinyaas:companion-bond";

const bondSnapshotCache = new Map<
  string,
  { json: string; record: CompanionBondRecord }
>();

function subscribeCompanionBond(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(BOND_EVENT, onStoreChange);
  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(BOND_EVENT, onStoreChange);
  };
}

/**
 * Returns a referentially stable bond record for the current localStorage
 * contents. Critical for useSyncExternalStore — a new object every read
 * causes an infinite re-render loop.
 */
function readBondSnapshot(companionId: string): CompanionBondRecord {
  const record = getCompanionBond(companionId);
  const json = JSON.stringify(record);
  const cached = bondSnapshotCache.get(companionId);
  if (cached && cached.json === json) {
    return cached.record;
  }
  bondSnapshotCache.set(companionId, { json, record });
  return record;
}

function readBondServerSnapshot(companionId: string): CompanionBondRecord {
  return defaultBondRecord(companionId);
}

/** Live Bond record for a companion species (localStorage + custom event). */
export function useCompanionBond(companionId: string): CompanionBondRecord {
  const getSnapshot = useCallback(
    () => readBondSnapshot(companionId),
    [companionId],
  );
  const getServerSnapshot = useCallback(
    () => readBondServerSnapshot(companionId),
    [companionId],
  );

  return useSyncExternalStore(
    subscribeCompanionBond,
    getSnapshot,
    getServerSnapshot,
  );
}

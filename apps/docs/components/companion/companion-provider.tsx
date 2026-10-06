"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { CompanionHost } from "@/components/companion/companion-host";
import { getCatalogEntry } from "@/components/companion/catalog";
import {
  findCompanionSpawnPosition,
  MAX_COMPANION_INSTANCES_PER_TYPE,
} from "@/components/companion/runtime/spawn";
import type { CompanionRuntimeState } from "@/components/companion/runtime/state-machine";
import type { CompanionVec2 } from "@/components/companion/runtime/physics";

export type CompanionPosition = CompanionVec2;

/**
 * One live Companion instance (distinct from Companion type/species).
 *
 * Decision: dead / falling / respawning instances still occupy a type slot
 * until they fully despawn. A fallen companion cannot be replaced by spawning
 * a third of the same type during its 5s death window.
 */
export type CompanionInstanceState = {
  /** Stable runtime id for this session instance. */
  id: string;
  /** Companion type / species id (ember, soul, moss, tusk, …). */
  type: string;
  /**
   * Optional personality instance profile id from companion.json `instances`.
   * Base species assets stay the same; only display/behavior overrides apply.
   */
  instanceProfileId: string | null;
  x: number;
  y: number;
  state: CompanionRuntimeState;
  surfaceId: string | null;
  deadUntilMs: number | null;
};

export type SpawnCompanionResult =
  | { ok: true; instance: CompanionInstanceState }
  | {
      ok: false;
      reason: "unknown_type" | "limit";
      type: string;
      count: number;
    };

type CompanionContextValue = {
  instances: CompanionInstanceState[];
  /** Last rejected spawn — drives brief UI feedback on the companion card. */
  spawnFeedback: { type: string; reason: "limit"; at: number } | null;
  clearSpawnFeedback: () => void;
  spawnCompanion: (type: string) => SpawnCompanionResult;
  countByType: (type: string) => number;
  patchInstance: (
    id: string,
    patch: Partial<
      Pick<
        CompanionInstanceState,
        | "x"
        | "y"
        | "state"
        | "instanceProfileId"
        | "surfaceId"
        | "deadUntilMs"
        | "type"
      >
    >,
  ) => void;
  removeInstance: (id: string) => void;
  /** @deprecated Prefer spawnCompanion — kept for older call sites. */
  setCompanionId: (companionId: string) => void;
  setInstanceProfileId: (instanceProfileId: string | null) => void;
  setPosition: (position: CompanionPosition) => void;
  setRuntimeState: (runtimeState: CompanionRuntimeState) => void;
};

const CompanionContext = createContext<CompanionContextValue | null>(null);

function createInstanceId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `companion-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function viewportSize() {
  if (typeof window === "undefined") {
    return { width: 1024, height: 768 };
  }
  return { width: window.innerWidth, height: window.innerHeight };
}

/**
 * Keeps Companion instances alive for the docs shell lifetime.
 * In-memory only — no localStorage or sync.
 *
 * Starts empty: companions appear when the user activates a Companion card.
 */
export function CompanionProvider({ children }: { children: ReactNode }) {
  const [instances, setInstances] = useState<CompanionInstanceState[]>([]);
  const [spawnFeedback, setSpawnFeedback] =
    useState<CompanionContextValue["spawnFeedback"]>(null);

  const countByType = useCallback(
    (type: string) => instances.filter((item) => item.type === type).length,
    [instances],
  );

  const spawnCompanion = useCallback(
    (type: string): SpawnCompanionResult => {
      const entry = getCatalogEntry(type);
      if (!entry) {
        return { ok: false, reason: "unknown_type", type, count: 0 };
      }

      const existing = instances.filter((item) => item.type === type);
      if (existing.length >= MAX_COMPANION_INSTANCES_PER_TYPE) {
        setSpawnFeedback({ type, reason: "limit", at: Date.now() });
        return {
          ok: false,
          reason: "limit",
          type,
          count: existing.length,
        };
      }

      const occupied = instances.map((item) => ({ x: item.x, y: item.y }));
      const position = findCompanionSpawnPosition(viewportSize(), occupied);
      const instance: CompanionInstanceState = {
        id: createInstanceId(),
        type: entry.meta.id,
        instanceProfileId: null,
        x: position.x,
        y: position.y,
        state: "idle",
        surfaceId: null,
        deadUntilMs: null,
      };

      setInstances((current) => [...current, instance]);
      setSpawnFeedback(null);
      return { ok: true, instance };
    },
    [instances],
  );

  const patchInstance = useCallback(
    (
      id: string,
      patch: Partial<
        Pick<
          CompanionInstanceState,
          | "x"
          | "y"
          | "state"
          | "instanceProfileId"
          | "surfaceId"
          | "deadUntilMs"
          | "type"
        >
      >,
    ) => {
      setInstances((current) =>
        current.map((item) => (item.id === id ? { ...item, ...patch } : item)),
      );
    },
    [],
  );

  const removeInstance = useCallback((id: string) => {
    setInstances((current) => current.filter((item) => item.id !== id));
  }, []);

  const clearSpawnFeedback = useCallback(() => {
    setSpawnFeedback(null);
  }, []);

  const value = useMemo<CompanionContextValue>(
    () => ({
      instances,
      spawnFeedback,
      clearSpawnFeedback,
      spawnCompanion,
      countByType,
      patchInstance,
      removeInstance,
      // Legacy single-instance shims operate on the first instance when present.
      setCompanionId: (companionId: string) => {
        const result = spawnCompanion(companionId);
        if (!result.ok && result.reason === "limit") {
          return;
        }
      },
      setInstanceProfileId: (instanceProfileId: string | null) => {
        setInstances((current) => {
          if (current.length === 0) {
            return current;
          }
          const [first, ...rest] = current;
          return [{ ...first, instanceProfileId }, ...rest];
        });
      },
      setPosition: (position: CompanionPosition) => {
        setInstances((current) => {
          if (current.length === 0) {
            return current;
          }
          const [first, ...rest] = current;
          return [{ ...first, x: position.x, y: position.y }, ...rest];
        });
      },
      setRuntimeState: (runtimeState: CompanionRuntimeState) => {
        setInstances((current) => {
          if (current.length === 0) {
            return current;
          }
          const [first, ...rest] = current;
          return [{ ...first, state: runtimeState }, ...rest];
        });
      },
    }),
    [
      instances,
      spawnFeedback,
      clearSpawnFeedback,
      spawnCompanion,
      countByType,
      patchInstance,
      removeInstance,
    ],
  );

  return (
    <CompanionContext.Provider value={value}>
      {children}
      <CompanionHost />
    </CompanionContext.Provider>
  );
}

export function useCompanionInstance(): CompanionContextValue {
  const context = useContext(CompanionContext);

  if (!context) {
    throw new Error(
      "useCompanionInstance must be used within CompanionProvider.",
    );
  }

  return context;
}

/** Soft hook for showcase cards that may render outside the provider. */
export function useCompanionsOptional(): CompanionContextValue | null {
  return useContext(CompanionContext);
}

/** Alias clarifying multi-instance usage. */
export const useCompanions = useCompanionInstance;

export { MAX_COMPANION_INSTANCES_PER_TYPE };

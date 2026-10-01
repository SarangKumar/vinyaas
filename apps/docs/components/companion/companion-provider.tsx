"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { CompanionHost } from "@/components/companion/companion-host";
import { companionCatalog } from "@/components/companion/catalog";
import type { CompanionRuntimeState } from "@/components/companion/runtime/state-machine";
import type { CompanionVec2 } from "@/components/companion/runtime/physics";

export type CompanionPosition = CompanionVec2;

export type CompanionInstanceState = {
  /** Stable id for this website session instance. */
  instanceId: string;
  companionId: string;
  /**
   * Absolute fixed position. `null` uses the default bottom-right placement
   * until the user drags the companion.
   */
  position: CompanionPosition | null;
  /** Persisted runtime state machine value. */
  runtimeState: CompanionRuntimeState;
};

type CompanionContextValue = {
  instance: CompanionInstanceState;
  setCompanionId: (companionId: string) => void;
  setPosition: (position: CompanionPosition) => void;
  setRuntimeState: (runtimeState: CompanionRuntimeState) => void;
  patchInstance: (
    patch: Partial<
      Pick<CompanionInstanceState, "position" | "runtimeState" | "companionId">
    >,
  ) => void;
};

const CompanionContext = createContext<CompanionContextValue | null>(null);

function createInstanceId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `companion-${Date.now()}`;
}

/**
 * Keeps one companion instance alive for the docs shell lifetime.
 * In-memory only — no localStorage or sync.
 * Preserves companion id, position, and runtime state across navigations.
 */
export function CompanionProvider({ children }: { children: ReactNode }) {
  const [instance, setInstance] = useState<CompanionInstanceState>(() => ({
    instanceId: createInstanceId(),
    companionId: companionCatalog[0]?.meta.id ?? "ember",
    position: null,
    runtimeState: "idle",
  }));

  const value = useMemo<CompanionContextValue>(
    () => ({
      instance,
      setCompanionId: (companionId: string) => {
        setInstance((current) =>
          current.companionId === companionId
            ? current
            : { ...current, companionId, runtimeState: "idle" },
        );
      },
      setPosition: (position: CompanionPosition) => {
        setInstance((current) => ({ ...current, position }));
      },
      setRuntimeState: (runtimeState: CompanionRuntimeState) => {
        setInstance((current) =>
          current.runtimeState === runtimeState
            ? current
            : { ...current, runtimeState },
        );
      },
      patchInstance: (patch) => {
        setInstance((current) => ({ ...current, ...patch }));
      },
    }),
    [instance],
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

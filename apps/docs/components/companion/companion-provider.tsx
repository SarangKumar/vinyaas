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

export type CompanionInstanceState = {
  /** Stable id for this website session instance. */
  instanceId: string;
  companionId: string;
  /** Placeholder for a future free-positioned companion. */
  position: { x: number | null; y: number | null };
};

type CompanionContextValue = {
  instance: CompanionInstanceState;
  setCompanionId: (companionId: string) => void;
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
 */
export function CompanionProvider({ children }: { children: ReactNode }) {
  const [instance, setInstance] = useState<CompanionInstanceState>(() => ({
    instanceId: createInstanceId(),
    companionId: companionCatalog[0]?.meta.id ?? "ember",
    position: { x: null, y: null },
  }));

  const value = useMemo<CompanionContextValue>(
    () => ({
      instance,
      setCompanionId: (companionId: string) => {
        setInstance((current) =>
          current.companionId === companionId
            ? current
            : { ...current, companionId },
        );
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
    throw new Error("useCompanionInstance must be used within CompanionProvider.");
  }

  return context;
}

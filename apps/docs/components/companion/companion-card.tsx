"use client";

import { useEffect } from "react";

import { CompanionSprite } from "@/components/companion/companion-sprite";
import type { CompanionCatalogEntry } from "@/components/companion/catalog";
import {
  MAX_COMPANION_INSTANCES_PER_TYPE,
  useCompanionsOptional,
} from "@/components/companion/companion-provider";
import { focusRing } from "@/components/focus-ring";
import { cn } from "@/lib/utils";

type CompanionCardProps = {
  entry: CompanionCatalogEntry;
  size?: number;
};

/**
 * Companion species card — activates / spawns an instance on the page.
 * Distinct from clicking a live instance (which triggers a reaction).
 *
 * Outside CompanionProvider (static showcases / unit tests) it renders as a
 * non-interactive article with the same visual language.
 */
export function CompanionCard({ entry, size = 128 }: CompanionCardProps) {
  const companions = useCompanionsOptional();
  const interactionCount = entry.meta.interactions?.length ?? 0;
  const count = companions?.countByType(entry.meta.id) ?? 0;
  const atLimit = count >= MAX_COMPANION_INSTANCES_PER_TYPE;
  const showReject =
    companions?.spawnFeedback?.type === entry.meta.id &&
    companions.spawnFeedback.reason === "limit";

  useEffect(() => {
    if (!showReject || !companions) {
      return;
    }
    const id = window.setTimeout(() => companions.clearSpawnFeedback(), 700);
    return () => window.clearTimeout(id);
  }, [showReject, companions, companions?.spawnFeedback?.at]);

  const body = (
    <>
      <CompanionSprite
        name={entry.meta.name}
        frames={entry.clips.idle.frames}
        fps={entry.clips.idle.fps}
        size={size}
      />
      <div className="flex flex-col gap-1">
        <h3 className="text-foreground text-lg font-medium tracking-tight">
          {entry.meta.name}
        </h3>
        <p className="text-muted-foreground text-sm leading-5">
          {interactionCount} interactions
          {companions && count > 0
            ? ` · ${count}/${MAX_COMPANION_INSTANCES_PER_TYPE}`
            : ""}
        </p>
        {showReject ? (
          <p className="text-muted-foreground text-xs" role="status">
            Already at the limit
          </p>
        ) : null}
      </div>
    </>
  );

  const surfaceProps = {
    "data-companion-card": entry.meta.id,
    "data-companion-surface": "",
    "data-companion-surface-id": `companion-card-${entry.meta.id}`,
  } as const;

  if (!companions) {
    return (
      <article
        {...surfaceProps}
        className="hover:bg-muted/40 flex flex-col items-center gap-4 rounded-[var(--radius)] px-6 py-10 text-center transition-colors"
      >
        {body}
      </article>
    );
  }

  return (
    <button
      type="button"
      {...surfaceProps}
      data-companion-card-control=""
      data-companion-spawn-reject={showReject ? "" : undefined}
      aria-label={
        atLimit
          ? `${entry.meta.name}: maximum ${MAX_COMPANION_INSTANCES_PER_TYPE} on screen`
          : `Spawn ${entry.meta.name} companion`
      }
      aria-pressed={count > 0}
      className={cn(
        "hover:bg-muted/40 flex w-full flex-col items-center gap-4 rounded-[var(--radius)] px-6 py-10 text-center transition-colors",
        focusRing,
      )}
      onClick={() => {
        companions.spawnCompanion(entry.meta.id);
      }}
    >
      {body}
    </button>
  );
}

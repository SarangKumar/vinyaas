"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { CompanionSprite } from "@/components/companion/companion-sprite";
import type { CompanionCatalogEntry } from "@/components/companion/catalog";
import {
  MAX_COMPANION_INSTANCES_PER_TYPE,
  useCompanionsOptional,
} from "@/components/companion/companion-provider";
import {
  BookIcon,
  ElementTypeBadge,
  SpawnIcon,
} from "@/components/companion/element-type";
import {
  elementTypeForCompanion,
  getCompanionBond,
  type CompanionBondRecord,
} from "@/components/companion/progression";
import { focusRing } from "@/components/focus-ring";
import { cn } from "@/lib/utils";

type CompanionCardProps = {
  entry: CompanionCatalogEntry;
  size?: number;
};

function StatPill({ label }: { label: string }) {
  return (
    <span className="border-border text-foreground inline-flex items-center rounded-full border px-2 py-0.5 text-[0.7rem]">
      {label}
    </span>
  );
}

/**
 * Species card for the Companions introduction.
 * Compact icon actions; type badge colored to the element.
 */
export function CompanionCard({ entry, size = 112 }: CompanionCardProps) {
  const companions = useCompanionsOptional();
  const interactionCount = entry.meta.interactions?.length ?? 0;
  const count = companions?.countByType(entry.meta.id) ?? 0;
  const atLimit = count >= MAX_COMPANION_INSTANCES_PER_TYPE;
  const showReject =
    companions?.spawnFeedback?.type === entry.meta.id &&
    companions.spawnFeedback.reason === "limit";
  const element = elementTypeForCompanion(entry.meta.id, entry.meta.type);
  const detailHref = `/companion/${entry.meta.id}`;
  const [bond, setBond] = useState<CompanionBondRecord | null>(null);

  useEffect(() => {
    setBond(getCompanionBond(entry.meta.id));
    function onStorage() {
      setBond(getCompanionBond(entry.meta.id));
    }
    window.addEventListener("storage", onStorage);
    window.addEventListener("vinyaas:companion-bond", onStorage);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("vinyaas:companion-bond", onStorage);
    };
  }, [entry.meta.id]);

  useEffect(() => {
    if (!showReject || !companions) {
      return;
    }
    const id = window.setTimeout(() => companions.clearSpawnFeedback(), 700);
    return () => window.clearTimeout(id);
  }, [showReject, companions, companions?.spawnFeedback?.at]);

  const unlocked = bond?.unlockedInteractionIds.length ?? 0;
  const bondRank = bond?.bond ?? 1;

  return (
    <article
      data-companion-card={entry.meta.id}
      data-companion-surface=""
      data-companion-surface-id={`companion-card-${entry.meta.id}`}
      className="border-border bg-card flex h-full flex-col gap-4 rounded-[var(--radius)] border p-5"
    >
      <div className="flex flex-1 items-start gap-4">
        <CompanionSprite
          name={entry.meta.name}
          frames={entry.clips.idle.frames}
          fps={entry.clips.idle.fps}
          size={size}
        />
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-foreground text-lg font-medium tracking-tight">
              {entry.meta.name}
            </h3>
            <ElementTypeBadge type={element} />
          </div>
          <p className="text-muted-foreground text-sm leading-5">
            {entry.meta.description}
          </p>
          <div className="flex flex-wrap gap-1.5">
            <StatPill label={`${interactionCount} moves`} />
            <StatPill label={`Bond ${bondRank}`} />
            {entry.meta.id === "ember" ? (
              <StatPill label={`${unlocked} unlocked`} />
            ) : null}
            {bond && bond.deaths > 0 ? (
              <StatPill label={`${bond.deaths} falls`} />
            ) : null}
          </div>
          {showReject ? (
            <p className="text-muted-foreground text-xs" role="status">
              Already on screen — only one {entry.meta.name} at a time
            </p>
          ) : null}
        </div>
      </div>

      <div className="flex flex-row items-center gap-2">
        {companions ? (
          <button
            type="button"
            data-companion-card-control=""
            data-companion-spawn-reject={showReject ? "" : undefined}
            aria-label={
              atLimit
                ? `${entry.meta.name} is already on screen`
                : `Spawn ${entry.meta.name}`
            }
            aria-pressed={count > 0}
            disabled={atLimit}
            className={cn(
              "bg-primary text-primary-foreground inline-flex h-8 flex-1 items-center justify-center gap-1.5 rounded-md px-2.5 text-xs font-medium",
              "disabled:pointer-events-none disabled:opacity-50",
              focusRing,
            )}
            onClick={() => {
              companions.spawnCompanion(entry.meta.id);
            }}
          >
            <SpawnIcon />
            {atLimit ? "On screen" : "Spawn"}
          </button>
        ) : (
          <span className="bg-muted text-muted-foreground inline-flex h-8 flex-1 items-center justify-center gap-1.5 rounded-md px-2.5 text-xs">
            <SpawnIcon />
            Spawn
          </span>
        )}
        <Link
          href={detailHref}
          className={cn(
            "border-border bg-background text-foreground hover:bg-muted inline-flex h-8 flex-1 items-center justify-center gap-1.5 rounded-md border px-2.5 text-xs font-medium no-underline",
            focusRing,
          )}
          aria-label={`Open ${entry.meta.name} detail page`}
        >
          <BookIcon />
          Know more
        </Link>
      </div>
    </article>
  );
}

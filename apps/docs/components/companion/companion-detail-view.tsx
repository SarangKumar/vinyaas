"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { CompanionSprite } from "@/components/companion/companion-sprite";
import { getCatalogEntry } from "@/components/companion/catalog";
import {
  MAX_COMPANION_INSTANCES_PER_TYPE,
  useCompanionsOptional,
} from "@/components/companion/companion-provider";
import {
  BookIcon,
  ElementTypeBadge,
  ElementTypeIcon,
  ElementTypeMark,
  LockIcon,
  SpawnIcon,
  UnlockIcon,
  ELEMENT_VISUALS,
} from "@/components/companion/element-type";
import {
  ELEMENT_MATCHUPS,
  elementTypeForCompanion,
  formatLifetime,
  formatUnlockRequirement,
  getCompanionBond,
  isMoveUnlocked,
  unlockRequirementForMove,
  unlockedIdsForEmber,
  xpToNextBond,
  type CompanionBondRecord,
} from "@/components/companion/progression";
import { focusRing } from "@/components/focus-ring";
import { companionPath } from "@/components/docs-nav";
import { cn } from "@/lib/utils";

type CompanionDetailViewProps = {
  companionId: string;
};

function StatTile({
  label,
  value,
  hint,
  surfaceId,
}: {
  label: string;
  value: string;
  hint?: string;
  surfaceId: string;
}) {
  return (
    <div
      data-companion-surface=""
      data-companion-surface-id={surfaceId}
      className="border-border bg-card flex min-w-[7.5rem] flex-1 flex-col gap-1 rounded-lg border px-4 py-3 shadow-sm"
    >
      <span className="text-muted-foreground text-[0.7rem] font-medium tracking-wide uppercase">
        {label}
      </span>
      <span className="text-foreground text-2xl font-semibold tracking-tight tabular-nums">
        {value}
      </span>
      {hint ? (
        <span className="text-muted-foreground text-xs leading-4">{hint}</span>
      ) : null}
    </div>
  );
}

function isStarterMove(moveId: string): boolean {
  const req = unlockRequirementForMove(moveId);
  return Boolean(req && req.bond <= 1 && req.lifetimeMs <= 0);
}

/**
 * Pokédex-style detail sheet for one companion species.
 * Bond / unlock data is localStorage-backed (Ember fully wired first).
 */
export function CompanionDetailView({ companionId }: CompanionDetailViewProps) {
  const entry = getCatalogEntry(companionId);
  const companions = useCompanionsOptional();
  const [bond, setBond] = useState<CompanionBondRecord | null>(null);

  useEffect(() => {
    setBond(getCompanionBond(companionId));
    function refresh() {
      setBond(getCompanionBond(companionId));
    }
    window.addEventListener("vinyaas:companion-bond", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("vinyaas:companion-bond", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, [companionId]);

  const element = elementTypeForCompanion(companionId, entry?.meta.type);
  const matchup = ELEMENT_MATCHUPS[element] ?? {
    strongAgainst: [] as const,
    weakAgainst: [] as const,
  };
  const interactions = entry?.meta.interactions ?? [];
  const bondRank = bond?.bond ?? 1;
  const lifetimeMs = bond?.lifetimeMs ?? 0;
  const unlockedSet = useMemo(
    () =>
      new Set(
        bond?.unlockedInteractionIds ??
          unlockedIdsForEmber(bondRank, lifetimeMs),
      ),
    [bond, bondRank, lifetimeMs],
  );

  const sortedMoves = useMemo(() => {
    const withState = interactions.map((item) => {
      const unlocked =
        companionId !== "ember" ||
        unlockedSet.has(item.id) ||
        isMoveUnlocked(item.id, bondRank, lifetimeMs);
      const starter = isStarterMove(item.id);
      return { item, unlocked, starter };
    });
    return withState.sort((a, b) => {
      const rank = (row: { unlocked: boolean; starter: boolean }) => {
        if (row.unlocked && row.starter) {
          return 0;
        }
        if (row.unlocked) {
          return 1;
        }
        return 2;
      };
      return rank(a) - rank(b);
    });
  }, [interactions, unlockedSet, companionId, bondRank, lifetimeMs]);

  const count = companions?.countByType(companionId) ?? 0;
  const atLimit = count >= MAX_COMPANION_INSTANCES_PER_TYPE;
  const showReject =
    companions?.spawnFeedback?.type === companionId &&
    companions.spawnFeedback.reason === "limit";

  useEffect(() => {
    if (!showReject || !companions) {
      return;
    }
    const id = window.setTimeout(() => companions.clearSpawnFeedback(), 700);
    return () => window.clearTimeout(id);
  }, [showReject, companions, companions?.spawnFeedback?.at]);

  if (!entry) {
    return (
      <p className="text-muted-foreground text-base">
        Unknown companion.{" "}
        <Link href={companionPath} className={`text-primary underline ${focusRing}`}>
          Back to companions
        </Link>
      </p>
    );
  }

  const nextXp = bond ? xpToNextBond(bond) : null;
  const isEmber = companionId === "ember";
  const elementLabel = ELEMENT_VISUALS[element].label;
  const story = entry.meta.lore ?? entry.meta.description;

  return (
    <div className="flex flex-col gap-10" data-companion-detail={companionId}>
      <section className="flex flex-col gap-6 sm:flex-row sm:items-start">
        <div className="relative w-fit shrink-0">
          <CompanionSprite
            name={entry.meta.name}
            frames={entry.clips.idle.frames}
            fps={entry.clips.idle.fps}
            size={160}
          />
          <ElementTypeMark
            type={element}
            size={28}
            className="absolute right-0 bottom-0"
          />
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <ElementTypeBadge type={element} />
              <span className="text-muted-foreground text-xs tracking-wide uppercase">
                {entry.meta.type ?? "companion"}
              </span>
            </div>
            <p className="text-foreground text-base leading-7">{story}</p>
            <p className="text-muted-foreground text-sm leading-6">
              Traits: {entry.meta.personalityTraits.join(" · ")}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {companions ? (
              <button
                type="button"
                data-companion-card-control=""
                aria-label={
                  atLimit
                    ? `${entry.meta.name} is already on screen`
                    : `Spawn ${entry.meta.name}`
                }
                disabled={atLimit}
                className={cn(
                  "bg-primary text-primary-foreground inline-flex h-9 items-center gap-1.5 rounded-md px-3 text-sm font-medium",
                  "disabled:pointer-events-none disabled:opacity-50",
                  focusRing,
                )}
                onClick={() => companions.spawnCompanion(companionId)}
              >
                <SpawnIcon />
                {atLimit ? "On screen" : "Spawn"}
              </button>
            ) : null}
            <Link
              href={companionPath}
              className={cn(
                "border-border bg-background text-foreground hover:bg-muted inline-flex h-9 items-center gap-1.5 rounded-md border px-3 text-sm font-medium no-underline",
                focusRing,
              )}
            >
              <BookIcon />
              All companions
            </Link>
          </div>
          {showReject ? (
            <p className="text-muted-foreground text-xs" role="status">
              Already on screen — only one {entry.meta.name} at a time
            </p>
          ) : null}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-foreground text-xl font-semibold tracking-tight">
          Bond sheet
        </h2>
        <div className="flex flex-wrap gap-3">
          <StatTile
            label="Bond"
            value={String(bondRank)}
            hint={
              nextXp !== null
                ? `${nextXp} XP to Bond ${bondRank + 1}`
                : "Max bond"
            }
            surfaceId={`${companionId}-stat-bond`}
          />
          <StatTile
            label="Awake time"
            value={formatLifetime(lifetimeMs)}
            hint="Persists across spawns"
            surfaceId={`${companionId}-stat-awake`}
          />
          <StatTile
            label="XP"
            value={String(bond?.xp ?? 0)}
            hint={`${bond?.interactionCount ?? 0} interactions`}
            surfaceId={`${companionId}-stat-xp`}
          />
          <StatTile
            label="Fatal falls"
            value={String(bond?.deaths ?? 0)}
            hint={
              (bond?.evolutionStage ?? 0) > 0
                ? `Evolution stage ${bond?.evolutionStage}`
                : "Base form"
            }
            surfaceId={`${companionId}-stat-falls`}
          />
        </div>
        {isEmber ? (
          <p className="text-muted-foreground text-sm leading-6">
            Stats live in local storage. A puff death keeps Bond, awake time,
            and unlocks — only the on-screen instance is removed.
          </p>
        ) : (
          <p className="text-muted-foreground text-sm leading-6">
            Full Bond unlock tracking ships first for Ember; other companions
            will share the same sheet soon.
          </p>
        )}
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-foreground text-xl font-semibold tracking-tight">
          Type chart
        </h2>
        <div
          data-companion-surface=""
          data-companion-surface-id={`${companionId}-type-chart`}
          className="border-border bg-card flex flex-col gap-3 rounded-lg border p-4"
        >
          <div className="flex items-center gap-2">
            <ElementTypeIcon type={element} className="size-4" />
            <span className="text-foreground text-sm font-medium">
              {elementLabel} type
            </span>
          </div>
          <div className="flex flex-col gap-2 text-sm leading-6 sm:flex-row sm:gap-8">
            <p>
              <span className="text-muted-foreground">Strong against </span>
              <span className="text-foreground font-medium">
                {matchup.strongAgainst.length > 0
                  ? matchup.strongAgainst.join(", ")
                  : "—"}
              </span>
            </p>
            <p>
              <span className="text-muted-foreground">Weak against </span>
              <span className="text-foreground font-medium">
                {matchup.weakAgainst.length > 0
                  ? matchup.weakAgainst.join(", ")
                  : "—"}
              </span>
            </p>
          </div>
          <p className="text-muted-foreground text-xs leading-5">
            Matchups are reserved for future companion encounters.
          </p>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-foreground text-xl font-semibold tracking-tight">
          Moves
        </h2>
        <p className="text-muted-foreground text-sm leading-6">
          Starter moves first, then other unlocks, then locked gates (Bond +
          awake time). Drop onto a move row to perch on it.
        </p>
        <ul className="flex flex-col gap-2">
          {sortedMoves.map(({ item, unlocked, starter }) => {
            const req = unlockRequirementForMove(item.id);
            const requirementLabel = req
              ? formatUnlockRequirement(req)
              : "Available";
            return (
              <li
                key={item.id}
                data-companion-surface=""
                data-companion-surface-id={`${companionId}-move-${item.id}`}
                className={cn(
                  "relative rounded-lg border px-3 py-3 pr-16 text-sm sm:pr-20",
                  unlocked
                    ? "border-border bg-card"
                    : "border-border/70 bg-muted/30",
                )}
              >
                <span
                  className={cn(
                    "absolute top-2.5 right-2.5 inline-flex items-center rounded-full border px-1.5 py-0.5 text-[0.6rem] font-medium uppercase",
                    unlocked
                      ? "border-[#7db88a]/50 bg-[#eef8f0] text-[#2f7a45] dark:border-[#7db88a]/35 dark:bg-[#1c2e22] dark:text-[#9fd4ad]"
                      : "border-border bg-background text-muted-foreground",
                  )}
                >
                  {unlocked ? "Unlocked" : "Locked"}
                </span>
                <div className="flex min-w-0 items-start gap-2">
                  <span
                    className={cn(
                      "mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full border",
                      unlocked
                        ? "border-[#7db88a]/50 bg-[#eef8f0] text-[#2f7a45] dark:border-[#7db88a]/35 dark:bg-[#1c2e22] dark:text-[#9fd4ad]"
                        : "border-border text-muted-foreground bg-background",
                    )}
                    aria-hidden="true"
                  >
                    {unlocked ? (
                      <UnlockIcon className="size-3" />
                    ) : (
                      <LockIcon className="size-3" />
                    )}
                  </span>
                  <div className="min-w-0">
                    <div className="text-foreground flex flex-wrap items-center gap-1.5 font-medium">
                      {item.id}
                      {starter ? (
                        <span className="text-muted-foreground text-[0.65rem] font-normal tracking-wide uppercase">
                          starter
                        </span>
                      ) : null}
                    </div>
                    <p className="text-muted-foreground mt-0.5 text-sm leading-5">
                      {item.description ?? item.trigger}
                      {" · "}
                      <code>{item.trigger}</code>
                      {" → "}
                      <code>{item.action}</code>
                      {item.animation ? (
                        <>
                          {" "}
                          (<code>{item.animation}</code>)
                        </>
                      ) : null}
                    </p>
                  </div>
                </div>
                {isEmber ? (
                  <p
                    className={cn(
                      "mt-2 pl-7 text-xs leading-5",
                      unlocked ? "text-foreground/80" : "text-muted-foreground",
                    )}
                  >
                    {unlocked ? "Requirement met · " : "Requires · "}
                    {requirementLabel}
                  </p>
                ) : null}
              </li>
            );
          })}
        </ul>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-foreground text-xl font-semibold tracking-tight">
          Animation clips
        </h2>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 sm:gap-4">
          {(["idle", "happy", "sleep", "fall", "puff"] as const).map((role) => {
            const clip = entry.clips[role];
            if (!clip) {
              return null;
            }
            return (
              <div
                key={role}
                data-companion-surface=""
                data-companion-surface-id={`${companionId}-clip-${role}`}
                className="border-border bg-card flex flex-col items-center gap-2 rounded-lg border px-2 py-3 sm:px-3"
              >
                <CompanionSprite
                  name={`${entry.meta.name} ${role}`}
                  frames={clip.frames}
                  fps={clip.fps}
                  size={72}
                />
                <span className="text-foreground font-mono text-xs">{role}</span>
                <span className="text-muted-foreground text-[0.7rem]">
                  {clip.frames.length} frames
                </span>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

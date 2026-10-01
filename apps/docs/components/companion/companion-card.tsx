"use client";

import { CompanionSprite } from "@/components/companion/companion-sprite";
import type { CompanionCatalogEntry } from "@/components/companion/catalog";

type CompanionCardProps = {
  entry: CompanionCatalogEntry;
  size?: number;
};

/**
 * Minimal character-select showcase for one companion species.
 */
export function CompanionCard({ entry, size = 128 }: CompanionCardProps) {
  const interactionCount = entry.meta.interactions?.length ?? 0;

  return (
    <article
      data-companion-card={entry.meta.id}
      className="hover:bg-muted/40 flex flex-col items-center gap-4 rounded-[var(--radius)] px-6 py-10 text-center transition-colors"
    >
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
        </p>
      </div>
    </article>
  );
}

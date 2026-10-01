"use client";

import Link from "next/link";

import { PlayBlock } from "@/app/home/play-block";
import { companionCatalog } from "@/components/companion/catalog";
import { CompanionPreview } from "@/components/companion/companion-preview";
import { companionPath } from "@/components/docs-nav";
import { focusRing } from "@/components/focus-ring";

/**
 * Homepage masonry card: one companion preview with short info.
 * Sits with the other PlayBlock cards — not a standalone section.
 */
export function CompanionBlock() {
  const ember = companionCatalog.find((entry) => entry.meta.id === "ember");

  if (!ember) {
    return null;
  }

  return (
    <PlayBlock
      title="Companion"
      description="A tiny desk friend for the docs workspace."
    >
      <div
        data-companion-home-preview
        className="flex flex-col items-center gap-4 text-center"
      >
        <CompanionPreview name={ember.meta.name} src={ember.idle} size={88} />
        <div className="flex flex-col gap-1">
          <p className="text-foreground text-sm font-medium tracking-tight">
            {ember.meta.name}
          </p>
          <p className="text-muted-foreground text-sm leading-6">
            {ember.meta.description}
          </p>
          <p className="text-muted-foreground text-xs leading-5">
            {ember.meta.personalityTraits.slice(0, 3).join(" · ")}
          </p>
        </div>
        <Link
          href={companionPath}
          className={`border-border bg-background text-foreground hover:bg-muted inline-flex h-8 items-center justify-center rounded-md border px-3 text-sm font-medium no-underline ${focusRing}`}
        >
          Meet companions
        </Link>
      </div>
    </PlayBlock>
  );
}

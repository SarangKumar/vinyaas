"use client";

import { CompanionPreview } from "@/components/companion/companion-preview";
import { companionCatalog } from "@/components/companion/catalog";
import { useCompanionInstance } from "@/components/companion/companion-provider";

/**
 * Global floating companion display for the docs site.
 * Mounted once under CompanionProvider — not inside route pages.
 */
export function CompanionHost() {
  const { instance } = useCompanionInstance();
  const entry =
    companionCatalog.find((item) => item.meta.id === instance.companionId) ??
    companionCatalog[0];

  if (!entry) {
    return null;
  }

  return (
    <div
      data-companion-host
      data-companion-instance={instance.instanceId}
      data-companion-id={entry.meta.id}
      aria-hidden="true"
      className="pointer-events-none fixed right-4 bottom-4 z-40 print:hidden sm:right-6 sm:bottom-6"
    >
      <div className="border-border bg-background/80 rounded-[var(--radius)] border p-2 shadow-sm backdrop-blur-sm">
        <CompanionPreview name={entry.meta.name} src={entry.idle} size={64} />
      </div>
    </div>
  );
}

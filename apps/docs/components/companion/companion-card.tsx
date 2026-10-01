import { CompanionPreview } from "@/components/companion/companion-preview";
import {
  summarizeCapabilities,
  type CompanionMeta,
} from "@/components/companion/catalog";
import type { StaticImageData } from "next/image";

type CompanionCardProps = {
  meta: CompanionMeta;
  src: StaticImageData;
  size?: number;
};

/**
 * Showcase card for one companion species.
 * Presentational only — reads metadata, does not run companion logic.
 */
export function CompanionCard({ meta, src, size = 120 }: CompanionCardProps) {
  const capabilities = summarizeCapabilities(meta.capabilities);
  const interactionCount = meta.interactions?.length ?? 0;

  return (
    <article
      data-companion-card={meta.id}
      className="border-border bg-muted/30 flex flex-col items-center gap-2 rounded-[var(--radius)] border px-6 py-8 text-center"
    >
      <CompanionPreview name={meta.name} src={src} size={size} />
      <div className="flex flex-col gap-2">
        <h3 className="text-foreground text-lg font-medium tracking-tight">
          {meta.name}
        </h3>
        <p className="text-muted-foreground text-sm leading-6">
          {meta.description}
        </p>
      </div>
      <ul className="text-muted-foreground flex flex-wrap justify-center gap-2 text-xs">
        {meta.personalityTraits.map((trait) => (
          <li
            key={trait}
            className="border-border bg-background rounded-md border px-2 py-1"
          >
            {trait}
          </li>
        ))}
      </ul>
      <p className="text-muted-foreground text-xs leading-5">
        {interactionCount} interactions
        {capabilities.length > 0 ? ` · ${capabilities.join(" · ")}` : ""}
      </p>
    </article>
  );
}

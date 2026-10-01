import type { StaticImageData } from "next/image";

import emberMeta from "@/companion/ember/companion.json";
import emberIdle from "@/companion/ember/assets/idle.png";
import soulMeta from "@/companion/soul/companion.json";
import soulIdle from "@/companion/soul/assets/idle.png";
import skeletonMeta from "@/companion/skeleton/companion.json";
import skeletonIdle from "@/companion/skeleton/assets/idle.png";

export type CompanionCapabilities = {
  floating: boolean;
  followCursor: boolean;
  reactToClick: boolean;
};

export type CompanionInteraction = {
  id: string;
  description: string;
};

export type CompanionMeta = {
  id: string;
  name: string;
  type: string;
  description: string;
  personalityTraits: string[];
  capabilities: CompanionCapabilities;
  interactions: CompanionInteraction[];
  assets: { idle: string };
  animations: Record<string, string[]>;
};

export type CompanionCatalogEntry = {
  meta: CompanionMeta;
  idle: StaticImageData;
};

/**
 * Built-in companion catalog for docs showcases and the global host.
 * Metadata comes from companion.json; sprites stay in companion asset folders.
 */
export const companionCatalog: CompanionCatalogEntry[] = [
  {
    meta: emberMeta as CompanionMeta,
    idle: emberIdle,
  },
  {
    meta: soulMeta as CompanionMeta,
    idle: soulIdle,
  },
  {
    meta: skeletonMeta as CompanionMeta,
    idle: skeletonIdle,
  },
];

export function summarizeCapabilities(
  capabilities: CompanionCapabilities,
): string[] {
  const labels: string[] = [];

  if (capabilities.floating) {
    labels.push("Floating");
  }
  if (capabilities.reactToClick) {
    labels.push("Click reactions");
  }
  if (capabilities.followCursor) {
    labels.push("Follows cursor");
  }

  return labels;
}

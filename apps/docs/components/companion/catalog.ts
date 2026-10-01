import type { StaticImageData } from "next/image";

import emberMeta from "@/companion/ember/companion.json";
import emberIdle from "@/companion/ember/assets/idle.png";
import emberIdle1 from "@/companion/ember/animations/idle/1.png";
import emberIdle2 from "@/companion/ember/animations/idle/2.png";
import emberIdle3 from "@/companion/ember/animations/idle/3.png";
import emberFall1 from "@/companion/ember/animations/fall/1.png";
import emberFall2 from "@/companion/ember/animations/fall/2.png";

import soulMeta from "@/companion/soul/companion.json";
import soulIdle from "@/companion/soul/assets/idle.png";
import soulIdle1 from "@/companion/soul/animations/idle/1.png";
import soulIdle2 from "@/companion/soul/animations/idle/2.png";
import soulIdle3 from "@/companion/soul/animations/idle/3.png";
import soulFall1 from "@/companion/soul/animations/fall/1.png";
import soulFall2 from "@/companion/soul/animations/fall/2.png";

import mossMeta from "@/companion/moss/companion.json";
import mossIdle from "@/companion/moss/assets/idle.png";
import mossIdle1 from "@/companion/moss/animations/idle/1.png";
import mossIdle2 from "@/companion/moss/animations/idle/2.png";
import mossIdle3 from "@/companion/moss/animations/idle/3.png";
import mossFall1 from "@/companion/moss/animations/fall/1.png";
import mossFall2 from "@/companion/moss/animations/fall/2.png";

export type CompanionCapabilities = {
  floating: boolean;
  followCursor: boolean;
  reactToClick: boolean;
};

export type CompanionInteraction = {
  id: string;
  description: string;
};

export type CompanionAnimationClip = {
  frames: string[];
  fps?: number;
};

/** Raw companion.json animation map (paths relative to the companion folder). */
export type CompanionAnimationsMeta = Record<
  string,
  string[] | CompanionAnimationClip
>;

export type CompanionMeta = {
  id: string;
  name: string;
  type: string;
  description: string;
  personalityTraits: string[];
  capabilities: CompanionCapabilities;
  interactions: CompanionInteraction[];
  assets: { idle: string };
  animations: CompanionAnimationsMeta;
};

export type CompanionClipFrames = {
  frames: StaticImageData[];
  fps: number;
};

export type CompanionCatalogEntry = {
  meta: CompanionMeta;
  idle: StaticImageData;
  clips: {
    idle: CompanionClipFrames;
    fall: CompanionClipFrames;
  };
};

/** Normalize legacy string[] or { frames } animation entries. */
export function normalizeAnimationClip(
  value: string[] | CompanionAnimationClip | undefined,
  fallbackFps = 5,
): { frames: string[]; fps: number } {
  if (!value) {
    return { frames: [], fps: fallbackFps };
  }

  if (Array.isArray(value)) {
    return { frames: value, fps: fallbackFps };
  }

  return {
    frames: value.frames ?? [],
    fps: value.fps ?? fallbackFps,
  };
}

/**
 * Built-in companion catalog for docs showcases and the global host.
 * Metadata comes from companion.json; sprites stay in companion asset folders.
 */
export const companionCatalog: CompanionCatalogEntry[] = [
  {
    meta: emberMeta as CompanionMeta,
    idle: emberIdle,
    clips: {
      idle: { frames: [emberIdle1, emberIdle2, emberIdle3], fps: 5 },
      fall: { frames: [emberFall1, emberFall2], fps: 8 },
    },
  },
  {
    meta: soulMeta as CompanionMeta,
    idle: soulIdle,
    clips: {
      idle: { frames: [soulIdle1, soulIdle2, soulIdle3], fps: 4 },
      fall: { frames: [soulFall1, soulFall2], fps: 8 },
    },
  },
  {
    meta: mossMeta as CompanionMeta,
    idle: mossIdle,
    clips: {
      idle: { frames: [mossIdle1, mossIdle2, mossIdle3], fps: 5 },
      fall: { frames: [mossFall1, mossFall2], fps: 8 },
    },
  },
];

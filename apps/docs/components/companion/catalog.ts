import type { StaticImageData } from "next/image";

import emberMeta from "@/companion/ember/companion.json";
import emberIdle from "@/companion/ember/assets/idle.png";
import emberIdle1 from "@/companion/ember/animations/idle/1.png";
import emberIdle2 from "@/companion/ember/animations/idle/2.png";
import emberIdle3 from "@/companion/ember/animations/idle/3.png";
import emberHappy1 from "@/companion/ember/animations/happy/1.png";
import emberHappy2 from "@/companion/ember/animations/happy/2.png";
import emberSleep1 from "@/companion/ember/animations/sleep/1.png";
import emberSleep2 from "@/companion/ember/animations/sleep/2.png";
import emberFall1 from "@/companion/ember/animations/fall/1.png";
import emberFall2 from "@/companion/ember/animations/fall/2.png";
import emberPuff1 from "@/companion/ember/animations/puff/1.png";
import emberPuff2 from "@/companion/ember/animations/puff/2.png";
import emberPuff3 from "@/companion/ember/animations/puff/3.png";

import soulMeta from "@/companion/soul/companion.json";
import soulIdle from "@/companion/soul/assets/idle.png";
import soulIdle1 from "@/companion/soul/animations/idle/1.png";
import soulIdle2 from "@/companion/soul/animations/idle/2.png";
import soulIdle3 from "@/companion/soul/animations/idle/3.png";
import soulHappy1 from "@/companion/soul/animations/happy/1.png";
import soulHappy2 from "@/companion/soul/animations/happy/2.png";
import soulSleep1 from "@/companion/soul/animations/sleep/1.png";
import soulSleep2 from "@/companion/soul/animations/sleep/2.png";
import soulFall1 from "@/companion/soul/animations/fall/1.png";
import soulFall2 from "@/companion/soul/animations/fall/2.png";
import soulPuff1 from "@/companion/soul/animations/puff/1.png";
import soulPuff2 from "@/companion/soul/animations/puff/2.png";
import soulPuff3 from "@/companion/soul/animations/puff/3.png";

import mossMeta from "@/companion/moss/companion.json";
import mossIdle from "@/companion/moss/assets/idle.png";
import mossIdle1 from "@/companion/moss/animations/idle/1.png";
import mossIdle2 from "@/companion/moss/animations/idle/2.png";
import mossIdle3 from "@/companion/moss/animations/idle/3.png";
import mossHappy1 from "@/companion/moss/animations/happy/1.png";
import mossHappy2 from "@/companion/moss/animations/happy/2.png";
import mossSleep1 from "@/companion/moss/animations/sleep/1.png";
import mossSleep2 from "@/companion/moss/animations/sleep/2.png";
import mossFall1 from "@/companion/moss/animations/fall/1.png";
import mossFall2 from "@/companion/moss/animations/fall/2.png";
import mossPuff1 from "@/companion/moss/animations/puff/1.png";
import mossPuff2 from "@/companion/moss/animations/puff/2.png";
import mossPuff3 from "@/companion/moss/animations/puff/3.png";

import tuskMeta from "@/companion/tusk/companion.json";
import tuskIdle from "@/companion/tusk/assets/idle.png";
import tuskIdle1 from "@/companion/tusk/animations/idle/1.png";
import tuskIdle2 from "@/companion/tusk/animations/idle/2.png";
import tuskIdle3 from "@/companion/tusk/animations/idle/3.png";
import tuskHappy1 from "@/companion/tusk/animations/happy/1.png";
import tuskHappy2 from "@/companion/tusk/animations/happy/2.png";
import tuskSleep1 from "@/companion/tusk/animations/sleep/1.png";
import tuskSleep2 from "@/companion/tusk/animations/sleep/2.png";
import tuskFall1 from "@/companion/tusk/animations/fall/1.png";
import tuskFall2 from "@/companion/tusk/animations/fall/2.png";
import tuskPuff1 from "@/companion/tusk/animations/puff/1.png";
import tuskPuff2 from "@/companion/tusk/animations/puff/2.png";
import tuskPuff3 from "@/companion/tusk/animations/puff/3.png";

import {
  assertCompanionConfig,
  normalizeAnimationClipCompat,
  type CompanionConfig,
} from "@/components/companion/runtime/schema";

export type {
  CompanionCapabilities,
  CompanionInteractionDefinition as CompanionInteraction,
  CompanionConfig as CompanionMeta,
} from "@/components/companion/runtime/schema";

export type CompanionClipFrames = {
  frames: StaticImageData[];
  fps: number;
  loop: boolean;
};

/** Ambient + motion clips available to the generic renderer. */
export type CompanionAnimationRole =
  "idle" | "happy" | "sleep" | "fall" | "puff";

export type CompanionCatalogEntry = {
  meta: CompanionConfig;
  idle: StaticImageData;
  clips: Record<CompanionAnimationRole, CompanionClipFrames>;
};

/** @deprecated Use resolveClipDefinition from runtime/schema. */
export function normalizeAnimationClip(
  value: CompanionConfig["animations"][string] | undefined,
  fallbackFps = 5,
): { frames: string[]; fps: number } {
  return normalizeAnimationClipCompat(value, fallbackFps);
}

function clip(
  frames: StaticImageData[],
  fps: number,
  loop: boolean,
): CompanionClipFrames {
  return { frames, fps, loop };
}

/**
 * Built-in companion catalog for docs showcases and the global host.
 * Metadata comes from companion.json; sprites stay in companion asset folders.
 */
export const companionCatalog: CompanionCatalogEntry[] = [
  {
    meta: assertCompanionConfig(emberMeta),
    idle: emberIdle,
    clips: {
      idle: clip([emberIdle1, emberIdle2, emberIdle3], 5, true),
      happy: clip([emberHappy1, emberHappy2], 6, false),
      sleep: clip([emberSleep1, emberSleep2], 3, true),
      fall: clip([emberFall1, emberFall2], 8, true),
      puff: clip([emberPuff1, emberPuff2, emberPuff3], 10, false),
    },
  },
  {
    meta: assertCompanionConfig(soulMeta),
    idle: soulIdle,
    clips: {
      idle: clip([soulIdle1, soulIdle2, soulIdle3], 4, true),
      happy: clip([soulHappy1, soulHappy2], 5, false),
      sleep: clip([soulSleep1, soulSleep2], 3, true),
      fall: clip([soulFall1, soulFall2], 8, true),
      puff: clip([soulPuff1, soulPuff2, soulPuff3], 10, false),
    },
  },
  {
    meta: assertCompanionConfig(mossMeta),
    idle: mossIdle,
    clips: {
      idle: clip([mossIdle1, mossIdle2, mossIdle3], 5, true),
      happy: clip([mossHappy1, mossHappy2], 6, false),
      sleep: clip([mossSleep1, mossSleep2], 3, true),
      fall: clip([mossFall1, mossFall2], 8, true),
      puff: clip([mossPuff1, mossPuff2, mossPuff3], 10, false),
    },
  },
  {
    meta: assertCompanionConfig(tuskMeta),
    idle: tuskIdle,
    clips: {
      idle: clip([tuskIdle1, tuskIdle2, tuskIdle3], 5, true),
      happy: clip([tuskHappy1, tuskHappy2], 6, false),
      sleep: clip([tuskSleep1, tuskSleep2], 3, true),
      fall: clip([tuskFall1, tuskFall2], 8, true),
      puff: clip([tuskPuff1, tuskPuff2, tuskPuff3], 10, false),
    },
  },
];

export function getCatalogEntry(companionId: string) {
  return companionCatalog.find((entry) => entry.meta.id === companionId);
}

/** First catalog entry — used only when a default is explicitly needed. */
export function getDefaultCatalogEntry() {
  return companionCatalog[0];
}

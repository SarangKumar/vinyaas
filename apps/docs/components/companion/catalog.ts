import type { StaticImageData } from "next/image";

import emberMeta from "@/companion/ember/companion.json";
import emberIdle from "@/companion/ember/assets/idle.png";
import emberIdle1 from "@/companion/ember/animations/idle/1.png";
import emberIdle2 from "@/companion/ember/animations/idle/2.png";
import emberIdle3 from "@/companion/ember/animations/idle/3.png";
import emberIdle4 from "@/companion/ember/animations/idle/4.png";
import emberIdle5 from "@/companion/ember/animations/idle/5.png";
import emberHappy1 from "@/companion/ember/animations/happy/1.png";
import emberHappy2 from "@/companion/ember/animations/happy/2.png";
import emberHappy3 from "@/companion/ember/animations/happy/3.png";
import emberHappy4 from "@/companion/ember/animations/happy/4.png";
import emberSleep1 from "@/companion/ember/animations/sleep/1.png";
import emberSleep2 from "@/companion/ember/animations/sleep/2.png";
import emberSleep3 from "@/companion/ember/animations/sleep/3.png";
import emberFall1 from "@/companion/ember/animations/fall/1.png";
import emberFall2 from "@/companion/ember/animations/fall/2.png";
import emberFall3 from "@/companion/ember/animations/fall/3.png";
import emberPuff1 from "@/companion/ember/animations/puff/1.png";
import emberPuff2 from "@/companion/ember/animations/puff/2.png";
import emberPuff3 from "@/companion/ember/animations/puff/3.png";
import emberPuff4 from "@/companion/ember/animations/puff/4.png";

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

import flintMeta from "@/companion/flint/companion.json";
import flintIdle from "@/companion/flint/assets/idle.png";
import flintIdle1 from "@/companion/flint/animations/idle/1.png";
import flintIdle2 from "@/companion/flint/animations/idle/2.png";
import flintIdle3 from "@/companion/flint/animations/idle/3.png";
import flintHappy1 from "@/companion/flint/animations/happy/1.png";
import flintHappy2 from "@/companion/flint/animations/happy/2.png";
import flintSleep1 from "@/companion/flint/animations/sleep/1.png";
import flintSleep2 from "@/companion/flint/animations/sleep/2.png";
import flintFall1 from "@/companion/flint/animations/fall/1.png";
import flintFall2 from "@/companion/flint/animations/fall/2.png";
import flintPuff1 from "@/companion/flint/animations/puff/1.png";
import flintPuff2 from "@/companion/flint/animations/puff/2.png";
import flintPuff3 from "@/companion/flint/animations/puff/3.png";

import bubbleMeta from "@/companion/bubble/companion.json";
import bubbleIdle from "@/companion/bubble/assets/idle.png";
import bubbleIdle1 from "@/companion/bubble/animations/idle/1.png";
import bubbleIdle2 from "@/companion/bubble/animations/idle/2.png";
import bubbleIdle3 from "@/companion/bubble/animations/idle/3.png";
import bubbleHappy1 from "@/companion/bubble/animations/happy/1.png";
import bubbleHappy2 from "@/companion/bubble/animations/happy/2.png";
import bubbleSleep1 from "@/companion/bubble/animations/sleep/1.png";
import bubbleSleep2 from "@/companion/bubble/animations/sleep/2.png";
import bubbleFall1 from "@/companion/bubble/animations/fall/1.png";
import bubbleFall2 from "@/companion/bubble/animations/fall/2.png";
import bubblePuff1 from "@/companion/bubble/animations/puff/1.png";
import bubblePuff2 from "@/companion/bubble/animations/puff/2.png";
import bubblePuff3 from "@/companion/bubble/animations/puff/3.png";

import rimeMeta from "@/companion/rime/companion.json";
import rimeIdle from "@/companion/rime/assets/idle.png";
import rimeIdle1 from "@/companion/rime/animations/idle/1.png";
import rimeIdle2 from "@/companion/rime/animations/idle/2.png";
import rimeIdle3 from "@/companion/rime/animations/idle/3.png";
import rimeHappy1 from "@/companion/rime/animations/happy/1.png";
import rimeHappy2 from "@/companion/rime/animations/happy/2.png";
import rimeSleep1 from "@/companion/rime/animations/sleep/1.png";
import rimeSleep2 from "@/companion/rime/animations/sleep/2.png";
import rimeFall1 from "@/companion/rime/animations/fall/1.png";
import rimeFall2 from "@/companion/rime/animations/fall/2.png";
import rimePuff1 from "@/companion/rime/animations/puff/1.png";
import rimePuff2 from "@/companion/rime/animations/puff/2.png";
import rimePuff3 from "@/companion/rime/animations/puff/3.png";

import jabMeta from "@/companion/jab/companion.json";
import jabIdle from "@/companion/jab/assets/idle.png";
import jabIdle1 from "@/companion/jab/animations/idle/1.png";
import jabIdle2 from "@/companion/jab/animations/idle/2.png";
import jabIdle3 from "@/companion/jab/animations/idle/3.png";
import jabHappy1 from "@/companion/jab/animations/happy/1.png";
import jabHappy2 from "@/companion/jab/animations/happy/2.png";
import jabSleep1 from "@/companion/jab/animations/sleep/1.png";
import jabSleep2 from "@/companion/jab/animations/sleep/2.png";
import jabFall1 from "@/companion/jab/animations/fall/1.png";
import jabFall2 from "@/companion/jab/animations/fall/2.png";
import jabPuff1 from "@/companion/jab/animations/puff/1.png";
import jabPuff2 from "@/companion/jab/animations/puff/2.png";
import jabPuff3 from "@/companion/jab/animations/puff/3.png";

import voltMeta from "@/companion/volt/companion.json";
import voltIdle from "@/companion/volt/assets/idle.png";
import voltIdle1 from "@/companion/volt/animations/idle/1.png";
import voltIdle2 from "@/companion/volt/animations/idle/2.png";
import voltIdle3 from "@/companion/volt/animations/idle/3.png";
import voltHappy1 from "@/companion/volt/animations/happy/1.png";
import voltHappy2 from "@/companion/volt/animations/happy/2.png";
import voltSleep1 from "@/companion/volt/animations/sleep/1.png";
import voltSleep2 from "@/companion/volt/animations/sleep/2.png";
import voltFall1 from "@/companion/volt/animations/fall/1.png";
import voltFall2 from "@/companion/volt/animations/fall/2.png";
import voltPuff1 from "@/companion/volt/animations/puff/1.png";
import voltPuff2 from "@/companion/volt/animations/puff/2.png";
import voltPuff3 from "@/companion/volt/animations/puff/3.png";

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
      idle: clip([emberIdle1, emberIdle2, emberIdle3, emberIdle4, emberIdle5], 6, true),
      happy: clip([emberHappy1, emberHappy2, emberHappy3, emberHappy4], 10, false),
      sleep: clip([emberSleep1, emberSleep2, emberSleep3], 3, true),
      fall: clip([emberFall1, emberFall2, emberFall3], 10, true),
      puff: clip([emberPuff1, emberPuff2, emberPuff3, emberPuff4], 12, false),
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
    meta: assertCompanionConfig(flintMeta),
    idle: flintIdle,
    clips: {
      idle: clip([flintIdle1, flintIdle2, flintIdle3], 5, true),
      happy: clip([flintHappy1, flintHappy2], 6, false),
      sleep: clip([flintSleep1, flintSleep2], 3, true),
      fall: clip([flintFall1, flintFall2], 8, true),
      puff: clip([flintPuff1, flintPuff2, flintPuff3], 10, false),
    },
  },
  {
    meta: assertCompanionConfig(bubbleMeta),
    idle: bubbleIdle,
    clips: {
      idle: clip([bubbleIdle1, bubbleIdle2, bubbleIdle3], 5, true),
      happy: clip([bubbleHappy1, bubbleHappy2], 6, false),
      sleep: clip([bubbleSleep1, bubbleSleep2], 3, true),
      fall: clip([bubbleFall1, bubbleFall2], 8, true),
      puff: clip([bubblePuff1, bubblePuff2, bubblePuff3], 10, false),
    },
  },
  {
    meta: assertCompanionConfig(rimeMeta),
    idle: rimeIdle,
    clips: {
      idle: clip([rimeIdle1, rimeIdle2, rimeIdle3], 5, true),
      happy: clip([rimeHappy1, rimeHappy2], 6, false),
      sleep: clip([rimeSleep1, rimeSleep2], 3, true),
      fall: clip([rimeFall1, rimeFall2], 8, true),
      puff: clip([rimePuff1, rimePuff2, rimePuff3], 10, false),
    },
  },
  {
    meta: assertCompanionConfig(jabMeta),
    idle: jabIdle,
    clips: {
      idle: clip([jabIdle1, jabIdle2, jabIdle3], 5, true),
      happy: clip([jabHappy1, jabHappy2], 6, false),
      sleep: clip([jabSleep1, jabSleep2], 3, true),
      fall: clip([jabFall1, jabFall2], 8, true),
      puff: clip([jabPuff1, jabPuff2, jabPuff3], 10, false),
    },
  },
  {
    meta: assertCompanionConfig(voltMeta),
    idle: voltIdle,
    clips: {
      idle: clip([voltIdle1, voltIdle2, voltIdle3], 5, true),
      happy: clip([voltHappy1, voltHappy2], 6, false),
      sleep: clip([voltSleep1, voltSleep2], 3, true),
      fall: clip([voltFall1, voltFall2], 8, true),
      puff: clip([voltPuff1, voltPuff2, voltPuff3], 10, false),
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

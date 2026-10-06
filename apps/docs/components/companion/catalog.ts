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
import emberCry1 from "@/companion/ember/animations/cry/1.png";
import emberCry2 from "@/companion/ember/animations/cry/2.png";
import emberCry3 from "@/companion/ember/animations/cry/3.png";
import emberCry4 from "@/companion/ember/animations/cry/4.png";
import emberBlink1 from "@/companion/ember/animations/blink/1.png";
import emberBlink2 from "@/companion/ember/animations/blink/2.png";
import emberBlink3 from "@/companion/ember/animations/blink/3.png";
import emberCelebrate1 from "@/companion/ember/animations/celebrate/1.png";
import emberCelebrate2 from "@/companion/ember/animations/celebrate/2.png";
import emberCelebrate3 from "@/companion/ember/animations/celebrate/3.png";
import emberCelebrate4 from "@/companion/ember/animations/celebrate/4.png";
import emberCelebrate5 from "@/companion/ember/animations/celebrate/5.png";
import emberDance1 from "@/companion/ember/animations/dance/1.png";
import emberDance2 from "@/companion/ember/animations/dance/2.png";
import emberDance3 from "@/companion/ember/animations/dance/3.png";
import emberDance4 from "@/companion/ember/animations/dance/4.png";
import emberDance5 from "@/companion/ember/animations/dance/5.png";
import emberDance6 from "@/companion/ember/animations/dance/6.png";
import emberSurprise1 from "@/companion/ember/animations/surprise/1.png";
import emberSurprise2 from "@/companion/ember/animations/surprise/2.png";
import emberSurprise3 from "@/companion/ember/animations/surprise/3.png";
import emberGlow1 from "@/companion/ember/animations/glow/1.png";
import emberGlow2 from "@/companion/ember/animations/glow/2.png";
import emberGlow3 from "@/companion/ember/animations/glow/3.png";
import emberGlow4 from "@/companion/ember/animations/glow/4.png";
import emberGlow5 from "@/companion/ember/animations/glow/5.png";
import emberWiggle1 from "@/companion/ember/animations/wiggle/1.png";
import emberWiggle2 from "@/companion/ember/animations/wiggle/2.png";
import emberWiggle3 from "@/companion/ember/animations/wiggle/3.png";
import emberWiggle4 from "@/companion/ember/animations/wiggle/4.png";
import emberWiggle5 from "@/companion/ember/animations/wiggle/5.png";
import emberWiggle6 from "@/companion/ember/animations/wiggle/6.png";
import emberSpin1 from "@/companion/ember/animations/spin/1.png";
import emberSpin2 from "@/companion/ember/animations/spin/2.png";
import emberSpin3 from "@/companion/ember/animations/spin/3.png";
import emberSpin4 from "@/companion/ember/animations/spin/4.png";
import emberSpin5 from "@/companion/ember/animations/spin/5.png";
import emberSpin6 from "@/companion/ember/animations/spin/6.png";
import emberSpin7 from "@/companion/ember/animations/spin/7.png";
import emberSpin8 from "@/companion/ember/animations/spin/8.png";

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
import soulCry1 from "@/companion/soul/animations/cry/1.png";
import soulCry2 from "@/companion/soul/animations/cry/2.png";
import soulCry3 from "@/companion/soul/animations/cry/3.png";
import soulCry4 from "@/companion/soul/animations/cry/4.png";
import soulBlink1 from "@/companion/soul/animations/blink/1.png";
import soulBlink2 from "@/companion/soul/animations/blink/2.png";
import soulBlink3 from "@/companion/soul/animations/blink/3.png";
import soulCelebrate1 from "@/companion/soul/animations/celebrate/1.png";
import soulCelebrate2 from "@/companion/soul/animations/celebrate/2.png";
import soulCelebrate3 from "@/companion/soul/animations/celebrate/3.png";
import soulCelebrate4 from "@/companion/soul/animations/celebrate/4.png";
import soulCelebrate5 from "@/companion/soul/animations/celebrate/5.png";
import soulDance1 from "@/companion/soul/animations/dance/1.png";
import soulDance2 from "@/companion/soul/animations/dance/2.png";
import soulDance3 from "@/companion/soul/animations/dance/3.png";
import soulDance4 from "@/companion/soul/animations/dance/4.png";
import soulDance5 from "@/companion/soul/animations/dance/5.png";
import soulDance6 from "@/companion/soul/animations/dance/6.png";
import soulSurprise1 from "@/companion/soul/animations/surprise/1.png";
import soulSurprise2 from "@/companion/soul/animations/surprise/2.png";
import soulSurprise3 from "@/companion/soul/animations/surprise/3.png";
import soulGlow1 from "@/companion/soul/animations/glow/1.png";
import soulGlow2 from "@/companion/soul/animations/glow/2.png";
import soulGlow3 from "@/companion/soul/animations/glow/3.png";
import soulGlow4 from "@/companion/soul/animations/glow/4.png";
import soulGlow5 from "@/companion/soul/animations/glow/5.png";
import soulWiggle1 from "@/companion/soul/animations/wiggle/1.png";
import soulWiggle2 from "@/companion/soul/animations/wiggle/2.png";
import soulWiggle3 from "@/companion/soul/animations/wiggle/3.png";
import soulWiggle4 from "@/companion/soul/animations/wiggle/4.png";
import soulWiggle5 from "@/companion/soul/animations/wiggle/5.png";
import soulWiggle6 from "@/companion/soul/animations/wiggle/6.png";
import soulSpin1 from "@/companion/soul/animations/spin/1.png";
import soulSpin2 from "@/companion/soul/animations/spin/2.png";
import soulSpin3 from "@/companion/soul/animations/spin/3.png";
import soulSpin4 from "@/companion/soul/animations/spin/4.png";
import soulSpin5 from "@/companion/soul/animations/spin/5.png";
import soulSpin6 from "@/companion/soul/animations/spin/6.png";
import soulSpin7 from "@/companion/soul/animations/spin/7.png";
import soulSpin8 from "@/companion/soul/animations/spin/8.png";

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
import mossCry1 from "@/companion/moss/animations/cry/1.png";
import mossCry2 from "@/companion/moss/animations/cry/2.png";
import mossCry3 from "@/companion/moss/animations/cry/3.png";
import mossCry4 from "@/companion/moss/animations/cry/4.png";
import mossBlink1 from "@/companion/moss/animations/blink/1.png";
import mossBlink2 from "@/companion/moss/animations/blink/2.png";
import mossBlink3 from "@/companion/moss/animations/blink/3.png";
import mossCelebrate1 from "@/companion/moss/animations/celebrate/1.png";
import mossCelebrate2 from "@/companion/moss/animations/celebrate/2.png";
import mossCelebrate3 from "@/companion/moss/animations/celebrate/3.png";
import mossCelebrate4 from "@/companion/moss/animations/celebrate/4.png";
import mossCelebrate5 from "@/companion/moss/animations/celebrate/5.png";
import mossDance1 from "@/companion/moss/animations/dance/1.png";
import mossDance2 from "@/companion/moss/animations/dance/2.png";
import mossDance3 from "@/companion/moss/animations/dance/3.png";
import mossDance4 from "@/companion/moss/animations/dance/4.png";
import mossDance5 from "@/companion/moss/animations/dance/5.png";
import mossDance6 from "@/companion/moss/animations/dance/6.png";
import mossSurprise1 from "@/companion/moss/animations/surprise/1.png";
import mossSurprise2 from "@/companion/moss/animations/surprise/2.png";
import mossSurprise3 from "@/companion/moss/animations/surprise/3.png";
import mossGlow1 from "@/companion/moss/animations/glow/1.png";
import mossGlow2 from "@/companion/moss/animations/glow/2.png";
import mossGlow3 from "@/companion/moss/animations/glow/3.png";
import mossGlow4 from "@/companion/moss/animations/glow/4.png";
import mossGlow5 from "@/companion/moss/animations/glow/5.png";
import mossWiggle1 from "@/companion/moss/animations/wiggle/1.png";
import mossWiggle2 from "@/companion/moss/animations/wiggle/2.png";
import mossWiggle3 from "@/companion/moss/animations/wiggle/3.png";
import mossWiggle4 from "@/companion/moss/animations/wiggle/4.png";
import mossWiggle5 from "@/companion/moss/animations/wiggle/5.png";
import mossWiggle6 from "@/companion/moss/animations/wiggle/6.png";
import mossSpin1 from "@/companion/moss/animations/spin/1.png";
import mossSpin2 from "@/companion/moss/animations/spin/2.png";
import mossSpin3 from "@/companion/moss/animations/spin/3.png";
import mossSpin4 from "@/companion/moss/animations/spin/4.png";
import mossSpin5 from "@/companion/moss/animations/spin/5.png";
import mossSpin6 from "@/companion/moss/animations/spin/6.png";
import mossSpin7 from "@/companion/moss/animations/spin/7.png";
import mossSpin8 from "@/companion/moss/animations/spin/8.png";

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
import flintCry1 from "@/companion/flint/animations/cry/1.png";
import flintCry2 from "@/companion/flint/animations/cry/2.png";
import flintCry3 from "@/companion/flint/animations/cry/3.png";
import flintCry4 from "@/companion/flint/animations/cry/4.png";

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
import bubbleCry1 from "@/companion/bubble/animations/cry/1.png";
import bubbleCry2 from "@/companion/bubble/animations/cry/2.png";
import bubbleCry3 from "@/companion/bubble/animations/cry/3.png";
import bubbleCry4 from "@/companion/bubble/animations/cry/4.png";

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
import rimeCry1 from "@/companion/rime/animations/cry/1.png";
import rimeCry2 from "@/companion/rime/animations/cry/2.png";
import rimeCry3 from "@/companion/rime/animations/cry/3.png";
import rimeCry4 from "@/companion/rime/animations/cry/4.png";

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
import jabCry1 from "@/companion/jab/animations/cry/1.png";
import jabCry2 from "@/companion/jab/animations/cry/2.png";
import jabCry3 from "@/companion/jab/animations/cry/3.png";
import jabCry4 from "@/companion/jab/animations/cry/4.png";

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
import voltCry1 from "@/companion/volt/animations/cry/1.png";
import voltCry2 from "@/companion/volt/animations/cry/2.png";
import voltCry3 from "@/companion/volt/animations/cry/3.png";
import voltCry4 from "@/companion/volt/animations/cry/4.png";

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
export type CompanionCoreAnimationRole =
  "idle" | "happy" | "sleep" | "fall" | "puff" | "cry";

export type CompanionExtraAnimationRole =
  "blink" | "celebrate" | "dance" | "surprise" | "glow" | "wiggle" | "spin";

export type CompanionAnimationRole =
  CompanionCoreAnimationRole | CompanionExtraAnimationRole;

export const COMPANION_CORE_ANIMATION_ROLES: CompanionCoreAnimationRole[] = [
  "idle",
  "happy",
  "sleep",
  "fall",
  "puff",
  "cry",
];

export const COMPANION_EXTRA_ANIMATION_ROLES: CompanionExtraAnimationRole[] = [
  "blink",
  "celebrate",
  "dance",
  "surprise",
  "glow",
  "wiggle",
  "spin",
];

export type CompanionCatalogEntry = {
  meta: CompanionConfig;
  idle: StaticImageData;
  clips: Record<CompanionCoreAnimationRole, CompanionClipFrames> &
    Partial<Record<CompanionExtraAnimationRole, CompanionClipFrames>>;
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
      idle: clip(
        [emberIdle1, emberIdle2, emberIdle3, emberIdle4, emberIdle5],
        6,
        true,
      ),
      happy: clip(
        [emberHappy1, emberHappy2, emberHappy3, emberHappy4],
        10,
        false,
      ),
      sleep: clip([emberSleep1, emberSleep2, emberSleep3], 3, true),
      fall: clip([emberFall1, emberFall2, emberFall3], 10, true),
      puff: clip([emberPuff1, emberPuff2, emberPuff3, emberPuff4], 12, false),
      cry: clip([emberCry1, emberCry2, emberCry3, emberCry4], 8, true),
      blink: clip([emberBlink1, emberBlink2, emberBlink3], 8, false),
      celebrate: clip(
        [
          emberCelebrate1,
          emberCelebrate2,
          emberCelebrate3,
          emberCelebrate4,
          emberCelebrate5,
        ],
        12,
        false,
      ),
      dance: clip(
        [
          emberDance1,
          emberDance2,
          emberDance3,
          emberDance4,
          emberDance5,
          emberDance6,
        ],
        12,
        true,
      ),
      surprise: clip(
        [emberSurprise1, emberSurprise2, emberSurprise3],
        10,
        false,
      ),
      glow: clip(
        [emberGlow1, emberGlow2, emberGlow3, emberGlow4, emberGlow5],
        10,
        true,
      ),
      wiggle: clip(
        [
          emberWiggle1,
          emberWiggle2,
          emberWiggle3,
          emberWiggle4,
          emberWiggle5,
          emberWiggle6,
        ],
        12,
        true,
      ),
      spin: clip(
        [
          emberSpin1,
          emberSpin2,
          emberSpin3,
          emberSpin4,
          emberSpin5,
          emberSpin6,
          emberSpin7,
          emberSpin8,
        ],
        14,
        true,
      ),
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
      cry: clip([soulCry1, soulCry2, soulCry3, soulCry4], 8, true),
      blink: clip([soulBlink1, soulBlink2, soulBlink3], 8, false),
      celebrate: clip(
        [
          soulCelebrate1,
          soulCelebrate2,
          soulCelebrate3,
          soulCelebrate4,
          soulCelebrate5,
        ],
        12,
        false,
      ),
      dance: clip(
        [
          soulDance1,
          soulDance2,
          soulDance3,
          soulDance4,
          soulDance5,
          soulDance6,
        ],
        12,
        true,
      ),
      surprise: clip([soulSurprise1, soulSurprise2, soulSurprise3], 10, false),
      glow: clip(
        [soulGlow1, soulGlow2, soulGlow3, soulGlow4, soulGlow5],
        10,
        true,
      ),
      wiggle: clip(
        [
          soulWiggle1,
          soulWiggle2,
          soulWiggle3,
          soulWiggle4,
          soulWiggle5,
          soulWiggle6,
        ],
        12,
        true,
      ),
      spin: clip(
        [
          soulSpin1,
          soulSpin2,
          soulSpin3,
          soulSpin4,
          soulSpin5,
          soulSpin6,
          soulSpin7,
          soulSpin8,
        ],
        14,
        true,
      ),
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
      cry: clip([mossCry1, mossCry2, mossCry3, mossCry4], 8, true),
      blink: clip([mossBlink1, mossBlink2, mossBlink3], 8, false),
      celebrate: clip(
        [
          mossCelebrate1,
          mossCelebrate2,
          mossCelebrate3,
          mossCelebrate4,
          mossCelebrate5,
        ],
        12,
        false,
      ),
      dance: clip(
        [
          mossDance1,
          mossDance2,
          mossDance3,
          mossDance4,
          mossDance5,
          mossDance6,
        ],
        12,
        true,
      ),
      surprise: clip([mossSurprise1, mossSurprise2, mossSurprise3], 10, false),
      glow: clip(
        [mossGlow1, mossGlow2, mossGlow3, mossGlow4, mossGlow5],
        10,
        true,
      ),
      wiggle: clip(
        [
          mossWiggle1,
          mossWiggle2,
          mossWiggle3,
          mossWiggle4,
          mossWiggle5,
          mossWiggle6,
        ],
        12,
        true,
      ),
      spin: clip(
        [
          mossSpin1,
          mossSpin2,
          mossSpin3,
          mossSpin4,
          mossSpin5,
          mossSpin6,
          mossSpin7,
          mossSpin8,
        ],
        14,
        true,
      ),
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
      cry: clip([flintCry1, flintCry2, flintCry3, flintCry4], 8, true),
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
      cry: clip([bubbleCry1, bubbleCry2, bubbleCry3, bubbleCry4], 8, true),
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
      cry: clip([rimeCry1, rimeCry2, rimeCry3, rimeCry4], 8, true),
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
      cry: clip([jabCry1, jabCry2, jabCry3, jabCry4], 8, true),
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
      cry: clip([voltCry1, voltCry2, voltCry3, voltCry4], 8, true),
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

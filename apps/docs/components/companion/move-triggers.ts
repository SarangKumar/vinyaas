/**
 * Human-readable how-to-trigger copy for companion moves and motion clips.
 */

import type { CompanionInteractionDefinition } from "@/components/companion/runtime/schema";

const MOVE_HOW_TO: Record<string, string> = {
  "react-click": "Click the companion",
  jump: "Double-click the companion",
  sleep: "Leave it alone for ~30 seconds (Bond 3+)",
  wake: "Click while it is sleeping (Bond 3+)",
  idle: "Soft ambient loop while waiting",
  fall: "Drop from a safe height (under 70vh)",
  cry: "Hold or drop more than 70vh above a surface",
  puff: "Plays on impact after a fatal fall",
  "drag-start": "Pick the companion up",
  nearby: "Move the cursor close",
  "page-hello": "Navigate to another docs page",
  "scroll-glance": "Scroll the page (starter glance)",
  celebrate: "Click the companion (Bond 2+)",
  blink: "Occasional idle blink (Bond 3+)",
  wiggle: "Click the surface it is perched on (Bond 4+)",
  dance: "Scroll the page (Bond 4+)",
  glow: "Move the cursor close (Bond 4+)",
  spin: "Navigate to another docs page (Bond 5+)",
  surprise: "Double-click (Bond 5+; plays instead of jump when ready)",
  "follow-cursor": "Keep the cursor nearby (Bond 5+)",
  happy: "Click, jump, or nearby greetings",
};

const TRIGGER_FALLBACK: Record<string, string> = {
  click: "Click the companion",
  double_click: "Double-click the companion",
  idle_timeout: "After ~30 seconds idle",
  drag_start: "Pick it up",
  drag_end: "Release after dragging",
  drop: "Drop onto a surface or the floor",
  cursor_nearby: "Move the cursor close",
  page_navigation: "Change docs pages",
  surface_action: "Click its perched surface",
  scroll: "Scroll the page",
  manual: "Reserved — no host trigger yet",
};

/** Plain-language how to fire a move or clip. */
export function describeMoveHowTo(
  moveId: string,
  interaction?: CompanionInteractionDefinition,
): string {
  if (MOVE_HOW_TO[moveId]) {
    return MOVE_HOW_TO[moveId];
  }
  if (interaction?.trigger) {
    return (
      TRIGGER_FALLBACK[interaction.trigger] ?? `Trigger: ${interaction.trigger}`
    );
  }
  return "See companion detail";
}

/** Compact trigger lines for the species card. */
export const CARD_TRIGGER_HINTS = [
  { id: "cry", text: "Cry — hold or drop from >70vh above a surface" },
  { id: "sleep", text: "Sleep — ~30s idle once Bond 3 unlocks it" },
  { id: "blink", text: "Blink — occasional idle flicker (Bond 3+)" },
  { id: "celebrate", text: "Celebrate — click (Bond 2+)" },
  { id: "dance", text: "Dance — scroll the page (Bond 4+)" },
  { id: "wiggle", text: "Wiggle — click its perch (Bond 4+)" },
  { id: "glow", text: "Glow — cursor nearby (Bond 4+)" },
  { id: "spin", text: "Spin — change pages (Bond 5+)" },
  { id: "surprise", text: "Surprise — double-click (Bond 5+)" },
] as const;

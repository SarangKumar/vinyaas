import type { ApiRow } from "@/components/api-table";

/** Documented Beam props. Source of truth for both the API table and the
 *  playground controls, so the two can never drift apart. */
export const api: ApiRow[] = [
  {
    prop: "containerRef",
    type: "RefObject<HTMLElement | null>",
    description:
      "Positioned element the beam is drawn in. Both ends must be inside it.",
  },
  {
    prop: "fromRef",
    type: "RefObject<HTMLElement | null>",
    description: "Element the beam starts at.",
  },
  {
    prop: "toRef",
    type: "RefObject<HTMLElement | null>",
    description: "Element the beam ends at.",
  },
  {
    prop: "curvature",
    type: "number",
    defaultValue: "0",
    description:
      "Bend in px, perpendicular to the line from start to end. Positive bends left of the direction of travel.",
  },
  {
    prop: "reverse",
    type: "boolean",
    defaultValue: "false",
    description: "Run the pulse from `to` back to `from`.",
  },
  {
    prop: "duration",
    type: "number",
    defaultValue: "3",
    description: "Seconds for one pulse to cross the path.",
  },
  {
    prop: "delay",
    type: "number",
    defaultValue: "0",
    description:
      "Seconds before the first pulse. Use to stagger beams along a flow.",
  },
  {
    prop: "pulseLength",
    type: "number",
    defaultValue: "0.2",
    description: 'Ray length as a share of the path, 0–1 (`pulse="ray"` only).',
  },
  {
    prop: "pathColor",
    type: "string",
    defaultValue: '"color-mix(in oklch, var(--foreground) 22%, transparent)"',
    description: "Track and arrowhead color. Any CSS color.",
  },
  {
    prop: "pulseColor",
    type: "string",
    defaultValue: '"var(--primary)"',
    description: "Pulse color. Any CSS color.",
  },
  {
    prop: "width",
    type: "number",
    defaultValue: "1",
    description: "Track stroke width in px.",
  },
  {
    prop: "track",
    type: '"dotted" | "dashed" | "solid"',
    defaultValue: '"dotted"',
    description: "Track style.",
  },
  {
    prop: "arrow",
    type: "boolean",
    defaultValue: "false",
    description: "Arrowhead at the end of the track.",
  },
  {
    prop: "gap",
    type: "number",
    defaultValue: "6",
    description: "Gap in px between each node's edge and the beam end.",
  },
  {
    prop: "shape",
    type: '"arc" | "curve"',
    defaultValue: '"arc"',
    description:
      "arc: bent by curvature. curve: an S-curve that leaves and enters along the main direction.",
  },
  {
    prop: "pulse",
    type: '"ray" | "dot"',
    defaultValue: '"ray"',
    description: "What travels along the path.",
  },
];

import type { ApiRow } from "@/components/api-table";

/** Documented UserCursor props. Source of truth for both the API table and the
 *  playground controls, so the two can never drift apart. */
export const api: ApiRow[] = [
  {
    prop: "name",
    type: "string",
    description: "Display name shown in the label next to the cursor pointer.",
  },
  {
    prop: "color",
    type: "string",
    defaultValue: '"var(--primary)"',
    description:
      "Accent color for both the cursor fill and label background. Accepts any CSS color value.",
  },
  {
    prop: "cursorVariant",
    type: '"default" | "minimal"',
    defaultValue: '"default"',
    description:
      'Arrow shape. "default" has a diagonal stem (cursor.chat style); "minimal" is a clean triangular arrow without the stem (Figma style).',
  },
  {
    prop: "labelVariant",
    type: '"rounded" | "pill" | "bubble" | "chat" | "square"',
    defaultValue: '"rounded"',
    description:
      'Visual shape of the name label. "rounded" is compact with rounded corners; "pill" is fully capsule-shaped; "bubble" adds a pointed tail; "chat" has one flat corner like a message bubble; "square" removes all rounding.',
  },
  {
    prop: "labelHidden",
    type: "boolean",
    defaultValue: "false",
    description: "Hide the name label. Useful when only the pointer is needed.",
  },
  {
    prop: "className",
    type: "string",
    description: "Extra classes applied to the wrapper element.",
  },
];

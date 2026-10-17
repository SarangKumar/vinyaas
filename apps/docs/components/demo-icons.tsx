"use client";

import type { ControlSelect } from "@/components/component-demo";

/**
 * The icon set the Customize panels offer, shared by Button, Badge, and Fuse
 * Button so all three expose the same choices and generate the same names.
 *
 * Icons carry `width`/`height` attributes rather than a size class, so a host
 * that sizes its own slot — Badge's `[&>svg]:size-3` — still wins.
 */
const paths: Record<string, React.ReactNode> = {
  plus: (
    <>
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </>
  ),
  check: <path d="M20 6 9 17l-5-5" />,
  download: (
    <>
      <path d="M12 3v12" />
      <path d="m7 10 5 5 5-5" />
      <path d="M5 21h14" />
    </>
  ),
  trash: (
    <>
      <path d="M4 7h16" />
      <path d="M10 11v6M14 11v6" />
      <path d="M6 7l1 13h10l1-13" />
      <path d="M9 7V4h6v3" />
    </>
  ),
  "arrow-right": (
    <>
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </>
  ),
};

/** `plus` → `PlusIcon`, for the import line in generated snippets. */
export function demoIconTag(name: string): string | null {
  if (!(name in paths)) {
    return null;
  }

  return `${name
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("")}Icon`;
}

export function DemoIcon({ name }: { name: string }) {
  const children = paths[name];

  if (!children) {
    return null;
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

/** Options for an icon `select` control, with "None" first. */
export const demoIconOptions: ControlSelect["options"] = [
  { value: "none", label: "None" },
  { value: "plus", label: "Plus" },
  { value: "check", label: "Check" },
  { value: "download", label: "Download" },
  { value: "trash", label: "Trash" },
  { value: "arrow-right", label: "Arrow Right" },
];

/** The icon an icon-only size falls back to when the panel says "None". */
export const DEFAULT_DEMO_ICON = "plus";

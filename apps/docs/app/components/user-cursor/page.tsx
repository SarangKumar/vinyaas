import { readFile } from "node:fs/promises";
import path from "node:path";
import type { ApiRow } from "@/components/api-table";
import type {
  ComponentExample,
  ComponentInPractice,
} from "@/components/component-reference";
import { ComponentReference } from "@/components/component-reference";
import type { Metadata } from "next";
import { componentPageMetadata } from "@/lib/page-metadata";
import {
  DefaultDemo,
  HoverDemo,
  LabelHiddenDemo,
  CanvasDemo,
} from "./user-cursor-demos";

export const metadata: Metadata = componentPageMetadata("user-cursor");

const usage = `import { UserCursor } from "@/components/ui/user-cursor";

export function Demo() {
  return <UserCursor name="Alice" color="#7c3aed" />;
}
`;

const api: ApiRow[] = [
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

const examples: ComponentExample[] = [
  {
    id: "hover",
    title: "Hover to try",
    description:
      "Move your cursor into the box — your native cursor is hidden and replaced with a UserCursor.",
    preview: <HoverDemo />,
    code: `"use client";
import { useState } from "react";
import { UserCursor } from "@/components/ui/user-cursor";

export function Demo() {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);

  return (
    <div
      className="relative h-52 w-full overflow-hidden rounded-lg border"
      style={{ cursor: pos ? "none" : "default" }}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      }}
      onMouseLeave={() => setPos(null)}
    >
      {pos && (
        <div className="pointer-events-none absolute" style={{ left: pos.x, top: pos.y }}>
          <UserCursor name="You" color="#7c3aed" />
        </div>
      )}
    </div>
  );
}`,
  },
  {
    id: "default",
    title: "Colors",
    description:
      "Each cursor gets its own color. The arrow and label share the same accent.",
    preview: <DefaultDemo />,
    code: `import { UserCursor } from "@/components/ui/user-cursor";

export function Demo() {
  return (
    <div className="flex gap-6">
      <UserCursor name="Alice" color="#7c3aed" />
      <UserCursor name="Bob" color="#db2777" />
      <UserCursor name="Charlie" color="#0891b2" />
    </div>
  );
}`,
  },
  {
    id: "label-hidden",
    title: "Label hidden",
    description:
      "Set labelHidden to show only the arrow — useful in dense UIs.",
    preview: <LabelHiddenDemo />,
    code: `import { UserCursor } from "@/components/ui/user-cursor";

export function Demo() {
  return (
    <div className="flex gap-6">
      <UserCursor name="Alice" color="#7c3aed" labelHidden />
      <UserCursor name="Bob" color="#db2777" labelHidden />
    </div>
  );
}`,
  },
  {
    id: "canvas",
    title: "On a canvas",
    description:
      "Positioned absolutely inside a relative container to simulate a shared canvas.",
    preview: <CanvasDemo />,
    code: `import { UserCursor } from "@/components/ui/user-cursor";

const cursors = [
  { name: "Alice", color: "#7c3aed", x: 15, y: 20 },
  { name: "Bob",   color: "#db2777", x: 55, y: 45 },
];

export function Demo() {
  return (
    <div className="relative h-52 w-full overflow-hidden rounded-lg border">
      {cursors.map((c) => (
        <div key={c.name} className="absolute" style={{ left: \`\${c.x}%\`, top: \`\${c.y}%\` }}>
          <UserCursor name={c.name} color={c.color} />
        </div>
      ))}
    </div>
  );
}`,
  },
];

const inPracticeSource = `import { UserCursor } from "@/components/ui/user-cursor";

const COLORS = ["#7c3aed", "#db2777", "#0891b2", "#16a34a"];

export function CollabCanvas({ users }: { users: { id: string; name: string; x: number; y: number }[] }) {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-lg border">
      {users.map((user, i) => (
        <div
          key={user.id}
          className="pointer-events-none absolute transition-all duration-100"
          style={{ left: user.x, top: user.y }}
        >
          <UserCursor name={user.name} color={COLORS[i % COLORS.length]!} />
        </div>
      ))}
    </div>
  );
}
`;

const inPractice: ComponentInPractice = {
  description:
    "A collaborative canvas that renders remote users' cursors at their reported positions. Each user gets a color from a fixed palette.",
  preview: <CanvasDemo />,
  code: inPracticeSource,
};

export default async function UserCursorPage() {
  const source = await readFile(
    path.join(process.cwd(), "registry/new-york/ui/user-cursor/index.tsx"),
    "utf8",
  );

  return (
    <ComponentReference
      title="User Cursor"
      description="A Figma-style collaborative cursor with an arrow pointer and a rounded name label."
      overview={
        <>
          <p>
            UserCursor renders the classic Figma-style presence indicator: an
            arrow cursor with a pill label showing the user&apos;s name. Both
            elements share a single <code>color</code> prop so each participant
            gets a distinct identity at a glance.
          </p>
          <p>
            The component is purely presentational — it has no motion or
            positioning logic. Place it inside a <code>position: relative</code>{" "}
            container and position it with <code>style</code> or CSS to match
            your multiplayer or canvas setup.
          </p>
        </>
      }
      install="vinyaas add user-cursor"
      manual={
        <p>
          After <code>vinyaas init</code>, place the source at{" "}
          <code>components/ui/user-cursor/index.tsx</code>. It imports only{" "}
          <code>cn</code> from <code>@/lib/utils</code>.
        </p>
      }
      usage={usage}
      examples={examples}
      inPractice={inPractice}
      api={api}
      accessibility={
        <>
          <p>
            The SVG pointer is <code>aria-hidden</code> — it is a decorative
            presence indicator and carries no actionable information. The name
            label is visible text.
          </p>
          <ul className="list-disc pl-5">
            <li>
              Do not rely on color alone to distinguish users. Consider pairing
              color with initials or a full name label.
            </li>
            <li>
              When cursors are keyboard-inaccessible overlays, wrap the canvas
              with an ARIA live region that announces when remote users join or
              leave.
            </li>
          </ul>
        </>
      }
      source={source}
    >
      <HoverDemo />
    </ComponentReference>
  );
}

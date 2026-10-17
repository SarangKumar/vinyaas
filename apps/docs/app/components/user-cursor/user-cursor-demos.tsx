"use client";

import { useState } from "react";
import {
  UserCursor,
  type CursorVariant,
  type LabelVariant,
} from "@/registry/new-york/ui/user-cursor";
import type { ControlValues } from "@/components/component-demo";

const DEMO_USERS = [
  { name: "Alice", color: "#7c3aed" },
  { name: "Bob", color: "#db2777" },
  { name: "Charlie", color: "#0891b2" },
];

export function DefaultDemo() {
  return (
    <div className="flex flex-wrap items-start gap-6">
      {DEMO_USERS.map((user) => (
        <UserCursor key={user.name} name={user.name} color={user.color} />
      ))}
    </div>
  );
}

export function LabelHiddenDemo() {
  return (
    <div className="flex flex-wrap items-start gap-6">
      {DEMO_USERS.map((user) => (
        <UserCursor
          key={user.name}
          name={user.name}
          color={user.color}
          labelHidden
        />
      ))}
    </div>
  );
}

export function HoverDemo() {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);

  return (
    <div
      className="border-border bg-muted/30 relative h-52 w-full overflow-hidden rounded-lg border select-none"
      style={{ cursor: pos ? "none" : "default" }}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      }}
      onMouseLeave={() => setPos(null)}
      aria-label="Hover to see the cursor"
    >
      <div className="text-muted-foreground pointer-events-none absolute inset-0 flex items-center justify-center text-sm">
        {pos ? "" : "Hover here"}
      </div>
      {pos && (
        <div
          className="pointer-events-none absolute"
          style={{ left: pos.x, top: pos.y }}
        >
          <UserCursor name="You" color="#7c3aed" />
        </div>
      )}
    </div>
  );
}

const LABEL_VARIANTS: { variant: LabelVariant; label: string }[] = [
  { variant: "rounded", label: "Rounded" },
  { variant: "pill", label: "Pill" },
  { variant: "bubble", label: "Bubble" },
  { variant: "chat", label: "Chat" },
  { variant: "square", label: "Square" },
];

export function VariantsDemo() {
  return (
    <div className="flex flex-wrap items-start gap-8">
      {LABEL_VARIANTS.map(({ variant, label }) => (
        <div key={variant} className="flex flex-col items-start gap-3">
          <UserCursor name="Alice" color="#7c3aed" labelVariant={variant} />
          <span className="text-muted-foreground text-xs">{label}</span>
        </div>
      ))}
    </div>
  );
}

const CURSOR_VARIANTS: { variant: CursorVariant; label: string }[] = [
  { variant: "default", label: "Default" },
  { variant: "minimal", label: "Minimal" },
];

export function CursorVariantsDemo() {
  return (
    <div className="flex flex-wrap items-start gap-8">
      {CURSOR_VARIANTS.map(({ variant, label }) => (
        <div key={variant} className="flex flex-col items-start gap-3">
          <UserCursor name="Alice" color="#7c3aed" cursorVariant={variant} />
          <span className="text-muted-foreground text-xs">{label}</span>
        </div>
      ))}
    </div>
  );
}

/** Live preview component for the main Preview Customize panel. */
export function UserCursorPreview({ values }: { values: ControlValues }) {
  return (
    <div className="flex h-32 w-full items-center justify-center">
      <UserCursor
        name={(values.name as string) || "Alice"}
        color={(values.color as string) || "#7c3aed"}
        labelVariant={values.labelVariant as LabelVariant}
        cursorVariant={values.cursorVariant as CursorVariant}
        labelHidden={values.labelHidden as boolean}
      />
    </div>
  );
}

export function CanvasDemo() {
  const cursors = [
    { name: "Alice", color: "#7c3aed", x: 15, y: 20 },
    { name: "Bob", color: "#db2777", x: 55, y: 45 },
    { name: "Charlie", color: "#0891b2", x: 30, y: 70 },
  ];

  return (
    <div
      className="border-border bg-muted/30 relative h-52 w-full overflow-hidden rounded-lg border"
      aria-label="Collaborative canvas"
    >
      <div className="text-muted-foreground absolute inset-0 flex items-center justify-center text-sm select-none">
        Canvas area
      </div>
      {cursors.map((cursor) => (
        <div
          key={cursor.name}
          className="absolute"
          style={{ left: `${cursor.x}%`, top: `${cursor.y}%` }}
        >
          <UserCursor name={cursor.name} color={cursor.color} />
        </div>
      ))}
    </div>
  );
}

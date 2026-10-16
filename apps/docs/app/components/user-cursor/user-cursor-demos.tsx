"use client";

import { useState } from "react";
import { UserCursor } from "@/registry/new-york/ui/user-cursor";

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

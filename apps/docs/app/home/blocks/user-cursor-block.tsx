"use client";

import { PlayBlock } from "@/app/home/play-block";
import { UserCursor } from "@/registry/new-york/ui/user-cursor";

const CURSORS = [
  {
    name: "Alice",
    color: "#7c3aed",
    x: 20,
    y: 28,
    labelVariant: "rounded" as const,
  },
  {
    name: "Bob",
    color: "#db2777",
    x: 58,
    y: 48,
    labelVariant: "pill" as const,
  },
  {
    name: "Charlie",
    color: "#0891b2",
    x: 36,
    y: 70,
    labelVariant: "chat" as const,
  },
];

export function UserCursorBlock() {
  return (
    <PlayBlock
      title="Multiplayer cursors"
      description="Presence indicators showing each user's position on a shared canvas."
    >
      <div className="border-border bg-muted/30 relative h-40 w-full overflow-hidden rounded-lg border">
        <span className="text-muted-foreground pointer-events-none absolute inset-0 flex items-center justify-center text-sm select-none">
          Canvas
        </span>
        {CURSORS.map((cursor) => (
          <div
            key={cursor.name}
            className="pointer-events-none absolute"
            style={{ left: `${cursor.x}%`, top: `${cursor.y}%` }}
          >
            <UserCursor
              name={cursor.name}
              color={cursor.color}
              labelVariant={cursor.labelVariant}
            />
          </div>
        ))}
      </div>
    </PlayBlock>
  );
}

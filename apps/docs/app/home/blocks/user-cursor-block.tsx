"use client";

import { PlayBlock } from "@/app/home/play-block";
import { Avatar, AvatarFallback } from "@/registry/new-york/ui/avatar";
import { UserCursor } from "@/registry/new-york/ui/user-cursor";

/**
 * A shared design frame mid-review. Cursors sit on the elements their owners
 * are working on — the selected button is ringed in that person's color — so
 * the card reads as presence on real content rather than three loose cursors.
 */
const COLLABORATORS = [
  {
    name: "Mira",
    initials: "MK",
    color: "#7c3aed",
    labelVariant: "pill" as const,
    x: 44,
    y: 56,
  },
  {
    name: "Jonas",
    initials: "JA",
    color: "#0891b2",
    labelVariant: "rounded" as const,
    x: 12,
    y: 24,
  },
  {
    name: "Tess",
    initials: "TO",
    color: "#db2777",
    labelVariant: "chat" as const,
    x: 66,
    y: 14,
  },
];

const selectedBy = COLLABORATORS[0];

export function UserCursorBlock() {
  return (
    <PlayBlock
      title="Design review"
      description="Three teammates in the same frame. Each cursor carries its owner's name."
    >
      <div className="flex min-w-0 items-center justify-between gap-3">
        <p className="text-muted-foreground truncate text-sm">
          Checkout · Payment step
        </p>
        {/*
          Overlapping presence stack. `isolate` keeps the z-indices to this
          group, and each avatar outranks the one after it so the stack falls
          left over right instead of every circle being clipped by its
          neighbour. The card-colored ring keeps the edges apart.
        */}
        <div className="isolate flex items-center -space-x-2.5">
          {COLLABORATORS.map((person, index) => (
            <Avatar
              key={person.name}
              className="ring-card size-7 ring-2"
              style={{ zIndex: COLLABORATORS.length - index }}
            >
              <AvatarFallback
                className="text-[0.625rem] font-medium"
                style={{
                  backgroundColor: `${person.color}24`,
                  color: person.color,
                }}
              >
                {person.initials}
              </AvatarFallback>
            </Avatar>
          ))}
        </div>
      </div>
      <div className="border-border bg-muted/30 relative h-40 w-full overflow-hidden rounded-lg border p-3">
        {/* The artboard under review. */}
        <div className="bg-card border-border flex flex-col gap-2 rounded-md border p-3">
          <p className="text-muted-foreground text-[0.6875rem]">Order total</p>
          <p className="text-base font-semibold tracking-tight">$128.00</p>
          <div className="flex items-center gap-2">
            <span
              className="bg-primary text-primary-foreground rounded px-2 py-1 text-[0.6875rem] font-medium"
              style={{ boxShadow: `0 0 0 2px ${selectedBy.color}` }}
            >
              Pay now
            </span>
            <span className="border-border text-muted-foreground rounded border px-2 py-1 text-[0.6875rem]">
              Cancel
            </span>
          </div>
        </div>
        {COLLABORATORS.map((person) => (
          <div
            key={person.name}
            className="pointer-events-none absolute"
            style={{ left: `${person.x}%`, top: `${person.y}%` }}
          >
            <UserCursor
              name={person.name}
              color={person.color}
              labelVariant={person.labelVariant}
            />
          </div>
        ))}
      </div>
    </PlayBlock>
  );
}

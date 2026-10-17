"use client";

import { useState } from "react";

import { PlayBlock } from "@/app/home/play-block";
import { Badge } from "@/registry/new-york/ui/badge";
import {
  DragDrop,
  DragDropHandle,
  DragDropItem,
  DragDropList,
} from "@/registry/new-york/ui/drag-and-drop";

/**
 * Sprint backlog prioritisation — reordering is the point, so the rows carry
 * the information a team actually ranks on and the order drives the footer.
 */
const TASKS: Record<
  string,
  { title: string; meta: string; priority: string; urgent?: boolean }
> = {
  auth: {
    title: "Passwordless sign-in",
    meta: "Platform · 5 pts",
    priority: "P0",
    urgent: true,
  },
  billing: {
    title: "Proration on plan change",
    meta: "Billing · 8 pts",
    priority: "P1",
  },
  search: {
    title: "Typeahead for the command palette",
    meta: "Web · 3 pts",
    priority: "P1",
  },
  audit: {
    title: "Export audit log as CSV",
    meta: "Platform · 2 pts",
    priority: "P2",
  },
};

export function DragAndDropBlock() {
  const [order, setOrder] = useState(["auth", "billing", "search", "audit"]);

  return (
    <PlayBlock
      title="Sprint backlog"
      description="Drag to reprioritise. The top row is what the team picks up next."
    >
      <DragDrop items={order} onReorder={(next) => setOrder(next as string[])}>
        <DragDropList className="gap-1.5">
          {order.map((id, index) => {
            const task = TASKS[id];

            return (
              <DragDropItem
                key={id}
                id={id}
                className="flex items-center gap-2 px-1 py-1"
              >
                <DragDropHandle
                  aria-label={`Reorder ${task.title}`}
                  className="size-8 shrink-0"
                />
                <span className="text-muted-foreground w-4 shrink-0 text-xs tabular-nums">
                  {index + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{task.title}</p>
                  <p className="text-muted-foreground truncate text-xs">
                    {task.meta}
                  </p>
                </div>
                <Badge
                  variant={task.urgent ? "destructive" : "outline"}
                  className="shrink-0"
                >
                  {task.priority}
                </Badge>
              </DragDropItem>
            );
          })}
        </DragDropList>
      </DragDrop>
      <p className="text-muted-foreground truncate text-xs">
        Up next: {TASKS[order[0]].title}
      </p>
    </PlayBlock>
  );
}

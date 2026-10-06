import type {
  ComponentExample,
  ComponentInPractice,
} from "@/components/component-reference";

import {
  AttachmentOrder,
  BasicSortable,
  HandleAndDisabled,
  HorizontalChips,
  KanbanBoard,
  PlaylistQueue,
  Preview,
  PriorityQueue,
  TwoColumnBoard,
  WholeItemDrag,
} from "./demos";

export { Preview };

export const usage = `import { useState } from "react";
import {
  DragDrop,
  DragDropHandle,
  DragDropItem,
  DragDropList,
} from "@/components/ui/drag-and-drop";

export function TaskList() {
  const [items, setItems] = useState(["Task A", "Task B", "Task C", "Task D"]);

  return (
    <DragDrop items={items} onReorder={setItems}>
      <DragDropList>
        {items.map((item) => (
          <DragDropItem key={item} id={item} className="flex items-center gap-2 p-2">
            <DragDropHandle aria-label={\`Reorder \${item}\`} />
            <span>{item}</span>
          </DragDropItem>
        ))}
      </DragDropList>
    </DragDrop>
  );
}
`;

export const examples: ComponentExample[] = [
  {
    id: "basic",
    title: "Basic sortable list",
    description:
      "Reorder items with a drag handle. Not a file-upload drop zone.",
    preview: <BasicSortable />,
    code: usage,
  },
  {
    id: "handle-disabled",
    title: "Drag handle and disabled items",
    description:
      "Handles stay keyboard-focusable. Disabled items cannot start a drag.",
    preview: <HandleAndDisabled />,
    code: `import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  DragDrop,
  DragDropHandle,
  DragDropItem,
  DragDropList,
} from "@/components/ui/drag-and-drop";

export function HandleAndDisabled() {
  const [items, setItems] = useState([
    "Task A",
    "Task B",
    "System Task",
    "Task D",
  ]);

  return (
    <DragDrop
      items={items}
      disabledIds={["System Task"]}
      onReorder={(next) => setItems(next as string[])}
      className="w-full max-w-md"
    >
      <DragDropList>
        {items.map((item) => (
          <DragDropItem
            key={item}
            id={item}
            className="flex items-center gap-2 p-2"
          >
            <DragDropHandle aria-label={\`Reorder \${item}\`} />
            <span className="text-sm">{item}</span>
            {item === "System Task" ? (
              <Badge variant="secondary" className="ml-auto">
                Locked
              </Badge>
            ) : null}
          </DragDropItem>
        ))}
      </DragDropList>
    </DragDrop>
  );
}
`,
  },
  {
    id: "whole-item",
    title: "Whole-item drag",
    description:
      "Omit DragDropHandle to make the entire row the drag activator.",
    preview: <WholeItemDrag />,
    code: `import { useState } from "react";
import {
  DragDrop,
  DragDropItem,
  DragDropList,
} from "@/components/ui/drag-and-drop";

export function WholeItemDrag() {
  const [items, setItems] = useState([
    "Inbox triage",
    "Design review",
    "Ship checklist",
  ]);

  return (
    <DragDrop
      items={items}
      onReorder={(next) => setItems(next as string[])}
      className="w-full max-w-md"
    >
      <DragDropList>
        {items.map((item) => (
          <DragDropItem
            key={item}
            id={item}
            className="cursor-grab px-3 py-2.5 active:cursor-grabbing"
          >
            <p className="text-sm font-medium">{item}</p>
            <p className="text-muted-foreground text-xs">
              Drag anywhere on the row — no separate handle.
            </p>
          </DragDropItem>
        ))}
      </DragDropList>
    </DragDrop>
  );
}
`,
  },
  {
    id: "horizontal",
    title: "Horizontal chips",
    description: 'Use orientation="horizontal" for pill or chip reorder rows.',
    preview: <HorizontalChips />,
    code: `import { useState } from "react";
import {
  DragDrop,
  DragDropHandle,
  DragDropItem,
  DragDropList,
} from "@/components/ui/drag-and-drop";

export function HorizontalChips() {
  const [items, setItems] = useState([
    "Design",
    "Build",
    "Review",
    "Ship",
    "Iterate",
  ]);

  return (
    <DragDrop
      items={items}
      orientation="horizontal"
      onReorder={(next) => setItems(next as string[])}
      className="w-full max-w-2xl"
    >
      <DragDropList className="flex-wrap">
        {items.map((item) => (
          <DragDropItem
            key={item}
            id={item}
            className="inline-flex items-center gap-2 px-2.5 py-1.5"
          >
            <DragDropHandle aria-label={\`Reorder \${item}\`} />
            <span className="text-sm">{item}</span>
          </DragDropItem>
        ))}
      </DragDropList>
    </DragDrop>
  );
}
`,
  },
  {
    id: "priority",
    title: "Priority queue",
    description:
      "Numbered ranks update as items move — useful for triage and backlogs.",
    preview: <PriorityQueue />,
    code: `import { useState } from "react";
import {
  DragDrop,
  DragDropHandle,
  DragDropItem,
  DragDropList,
} from "@/components/ui/drag-and-drop";

export function PriorityQueue() {
  const [items, setItems] = useState([
    "P0 — Production incident",
    "P1 — Payment retries",
    "P2 — Empty-state copy",
    "P3 — Favicon refresh",
  ]);

  return (
    <DragDrop
      items={items}
      onReorder={(next) => setItems(next as string[])}
      className="w-full max-w-md"
    >
      <DragDropList className="gap-2">
        {items.map((item, index) => (
          <DragDropItem
            key={item}
            id={item}
            className="flex items-center gap-3 p-2"
          >
            <DragDropHandle aria-label={\`Reorder \${item}\`} />
            <span className="text-muted-foreground w-5 text-center text-xs tabular-nums">
              {index + 1}
            </span>
            <span className="text-sm">{item}</span>
          </DragDropItem>
        ))}
      </DragDropList>
    </DragDrop>
  );
}
`,
  },
  {
    id: "attachments",
    title: "Attachment order",
    description:
      "Reorder files before upload or submit. Pair with file-upload for picking files.",
    preview: <AttachmentOrder />,
    code: `import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  DragDrop,
  DragDropHandle,
  DragDropItem,
  DragDropList,
} from "@/components/ui/drag-and-drop";

export function AttachmentOrder() {
  const [items, setItems] = useState([
    "brief.pdf",
    "moodboard.png",
    "spec.docx",
    "recording.mp4",
  ]);

  return (
    <DragDrop
      items={items}
      onReorder={(next) => setItems(next as string[])}
      className="w-full max-w-md"
    >
      <DragDropList className="gap-2">
        {items.map((item) => (
          <DragDropItem
            key={item}
            id={item}
            className="flex items-center gap-2 px-2 py-2"
          >
            <DragDropHandle aria-label={\`Reorder \${item}\`} />
            <div className="bg-muted size-8 shrink-0 rounded-md" aria-hidden />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{item}</p>
              <p className="text-muted-foreground text-xs">Attachment order</p>
            </div>
            <Badge variant="outline">File</Badge>
          </DragDropItem>
        ))}
      </DragDropList>
    </DragDrop>
  );
}
`,
  },
  {
    id: "playlist",
    title: "Playlist / queue",
    description:
      "Compose a bordered shell around DragDropList for media queues.",
    preview: <PlaylistQueue />,
    code: `import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  DragDrop,
  DragDropHandle,
  DragDropItem,
  DragDropList,
} from "@/components/ui/drag-and-drop";

export function PlaylistQueue() {
  const [items, setItems] = useState([
    "Intro sting",
    "Chapter 1",
    "Interview A",
    "Break bumper",
    "Outro",
  ]);

  return (
    <DragDrop
      items={items}
      onReorder={(next) => setItems(next as string[])}
      className="w-full max-w-md"
    >
      <div className="border-border w-full rounded-md border">
        <div className="flex items-center justify-between gap-3 p-3">
          <div>
            <p className="text-sm font-medium">Episode queue</p>
            <p className="text-muted-foreground text-xs">
              Drag to change playback order.
            </p>
          </div>
          <Badge variant="secondary">{items.length} clips</Badge>
        </div>
        <Separator />
        <div className="p-2">
          <DragDropList className="gap-1">
            {items.map((item, index) => (
              <DragDropItem
                key={item}
                id={item}
                className="flex items-center gap-2 px-2 py-1.5"
              >
                <DragDropHandle aria-label={\`Reorder \${item}\`} />
                <span className="text-muted-foreground w-4 text-xs tabular-nums">
                  {index + 1}
                </span>
                <span className="text-sm">{item}</span>
              </DragDropItem>
            ))}
          </DragDropList>
        </div>
      </div>
    </DragDrop>
  );
}
`,
  },
  {
    id: "board",
    title: "Multiple containers",
    description: "Move items between Todo and Done lists with a shared root.",
    preview: <TwoColumnBoard />,
    code: `import { useState } from "react";
import {
  DragDrop,
  DragDropHandle,
  DragDropItem,
  DragDropList,
} from "@/components/ui/drag-and-drop";

export function TwoColumnBoard() {
  const [items, setItems] = useState({
    todo: ["Task A", "Task B"],
    done: ["Task C", "Task D"],
  });

  return (
    <DragDrop
      items={items}
      onReorder={(next) =>
        setItems(next as { todo: string[]; done: string[] })
      }
      className="w-full max-w-2xl"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {(
          [
            ["todo", "Todo"],
            ["done", "Done"],
          ] as const
        ).map(([id, label]) => (
          <div key={id} className="border-border rounded-md border p-3">
            <p className="mb-2 text-sm font-medium">{label}</p>
            <DragDropList id={id} items={items[id]} className="min-h-24">
              {items[id].map((item) => (
                <DragDropItem
                  key={item}
                  id={item}
                  className="flex items-center gap-2 p-2"
                >
                  <DragDropHandle aria-label={\`Reorder \${item}\`} />
                  <span className="text-sm">{item}</span>
                </DragDropItem>
              ))}
            </DragDropList>
          </div>
        ))}
      </div>
    </DragDrop>
  );
}
`,
  },
];

export const inPractice: ComponentInPractice = {
  description:
    "A Kanban-style sprint board: three columns, card composition with Badge and Button, and size-stable drag overlays across containers.",
  preview: <KanbanBoard />,
  code: `import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DragDrop,
  DragDropHandle,
  DragDropItem,
  DragDropList,
} from "@/components/ui/drag-and-drop";
import { Separator } from "@/components/ui/separator";

type KanbanColumns = {
  backlog: string[];
  progress: string[];
  done: string[];
};

const kanbanMeta: Record<
  string,
  { title: string; tag: string; note: string; assignee: string; points: string }
> = {
  "card-1": {
    title: "Onboard billing",
    tag: "Finance",
    note: "Wire Stripe webhooks and receipt emails.",
    assignee: "SK",
    points: "5",
  },
  "card-2": {
    title: "Sidebar polish",
    tag: "UI",
    note: "Collapsed labels + rounded demo shells.",
    assignee: "AR",
    points: "3",
  },
  "card-3": {
    title: "CLI dry-run",
    tag: "Tooling",
    note: "Verify catalog installs before write.",
    assignee: "MK",
    points: "2",
  },
  "card-4": {
    title: "A11y checklist",
    tag: "Docs",
    note: "Keyboard, focus, and reduced motion.",
    assignee: "JL",
    points: "3",
  },
  "card-5": {
    title: "Theme tokens",
    tag: "Design",
    note: "Align chart colors with primary.",
    assignee: "SK",
    points: "2",
  },
  "card-6": {
    title: "Release notes",
    tag: "Docs",
    note: "Ship v1.3.0 changelog bullets.",
    assignee: "AR",
    points: "1",
  },
};

const laneAccent: Record<keyof KanbanColumns, string> = {
  backlog: "bg-muted-foreground/50",
  progress: "bg-primary",
  done: "bg-foreground/40",
};

export function KanbanBoard() {
  const [columns, setColumns] = useState<KanbanColumns>({
    backlog: ["card-1", "card-2", "card-5"],
    progress: ["card-3", "card-4"],
    done: ["card-6"],
  });

  const lanes = [
    ["backlog", "Backlog"],
    ["progress", "In progress"],
    ["done", "Done"],
  ] as const;

  return (
    <div className="border-border bg-card w-full min-w-0 overflow-hidden rounded-xl border shadow-sm">
      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold tracking-tight">Sprint board</p>
          <p className="text-muted-foreground text-xs leading-5">
            Multi-container DragDrop — cards keep their size while dragging.
          </p>
        </div>
        <Badge variant="secondary">Kanban</Badge>
      </div>
      <Separator />
      <div className="bg-muted/30 p-3 sm:p-4">
        <DragDrop
          items={columns}
          onReorder={(next) => setColumns(next as KanbanColumns)}
        >
          <div className="grid gap-3 md:grid-cols-3">
            {lanes.map(([id, label]) => (
              <div
                key={id}
                className="bg-muted/60 flex min-h-80 flex-col rounded-lg border border-border/60 p-2.5"
              >
                <div className="mb-2.5 flex items-center justify-between gap-2 px-1">
                  <div className="flex min-w-0 items-center gap-2">
                    <span
                      className={\`size-1.5 shrink-0 rounded-full \${laneAccent[id]}\`}
                      aria-hidden
                    />
                    <p className="truncate text-sm font-medium">{label}</p>
                  </div>
                  <Badge
                    variant="outline"
                    className="text-muted-foreground h-5 min-w-5 justify-center px-1.5 text-[11px] tabular-nums"
                  >
                    {columns[id].length}
                  </Badge>
                </div>
                <DragDropList
                  id={id}
                  items={columns[id]}
                  className="min-h-44 flex-1 gap-2.5"
                >
                  {columns[id].map((cardId) => {
                    const card = kanbanMeta[cardId];
                    return (
                      <DragDropItem
                        key={cardId}
                        id={cardId}
                        className="hover:bg-card overflow-hidden border-border/80 p-0 shadow-sm"
                      >
                        <Card
                          size="sm"
                          className="gap-0 border-0 bg-transparent p-0 shadow-none"
                        >
                          <CardHeader className="gap-1.5 p-3 pb-2">
                            <CardTitle className="pr-8 text-[13px] leading-snug font-semibold">
                              {card?.title}
                            </CardTitle>
                            <CardDescription className="text-xs leading-5">
                              {card?.note}
                            </CardDescription>
                            <CardAction>
                              <DragDropHandle
                                aria-label={\`Reorder \${card?.title}\`}
                                className="text-muted-foreground"
                              />
                            </CardAction>
                          </CardHeader>
                          <CardFooter className="flex-wrap justify-between gap-x-2 gap-y-1.5 border-t border-border/60 px-3 py-2">
                            <div className="flex items-center gap-1.5">
                              <Badge
                                variant="secondary"
                                className="h-5 px-1.5 text-[11px] font-medium"
                              >
                                {card?.tag}
                              </Badge>
                              <Badge
                                variant="outline"
                                className="text-muted-foreground h-5 px-1.5 text-[11px] tabular-nums"
                              >
                                {card?.points}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-1">
                              <Avatar className="size-5">
                                <AvatarFallback className="text-[9px]">
                                  {card?.assignee}
                                </AvatarFallback>
                              </Avatar>
                              <Button
                                type="button"
                                size="sm"
                                variant="ghost"
                                className="text-muted-foreground h-6 px-1.5 text-xs"
                              >
                                Open
                              </Button>
                            </div>
                          </CardFooter>
                        </Card>
                      </DragDropItem>
                    );
                  })}
                </DragDropList>
              </div>
            ))}
          </div>
        </DragDrop>
      </div>
    </div>
  );
}
`,
};

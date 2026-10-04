"use client";

import { useState } from "react";

import type {
  ComponentExample,
  ComponentInPractice,
} from "@/components/component-reference";
import { Badge } from "@/registry/new-york/ui/badge";
import { Button } from "@/registry/new-york/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/registry/new-york/ui/card";
import {
  DragDrop,
  DragDropHandle,
  DragDropItem,
  DragDropList,
} from "@/registry/new-york/ui/drag-and-drop";
import { ScrollArea } from "@/registry/new-york/ui/scroll-area";
import { Separator } from "@/registry/new-york/ui/separator";

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

function BasicSortable() {
  const [items, setItems] = useState(["Task A", "Task B", "Task C", "Task D"]);

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
            className="flex items-center gap-2 p-2"
          >
            <DragDropHandle aria-label={`Reorder ${item}`} />
            <span className="text-sm">{item}</span>
          </DragDropItem>
        ))}
      </DragDropList>
    </DragDrop>
  );
}

function HandleAndDisabled() {
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
            <DragDropHandle aria-label={`Reorder ${item}`} />
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

function DashboardCards() {
  const [items, setItems] = useState(["revenue", "users", "activity"]);

  const copy: Record<string, { title: string; body: string }> = {
    revenue: { title: "Revenue", body: "$24.5k this week" },
    users: { title: "Users", body: "1,284 active" },
    activity: { title: "Recent Activity", body: "12 events in the last hour" },
  };

  return (
    <DragDrop
      items={items}
      onReorder={(next) => setItems(next as string[])}
      className="w-full max-w-xl"
    >
      <DragDropList className="gap-3">
        {items.map((id) => (
          <DragDropItem key={id} id={id} className="overflow-hidden p-0">
            <Card className="border-0 shadow-none">
              <CardHeader className="flex-row items-start gap-2 space-y-0 p-4">
                <DragDropHandle
                  aria-label={`Reorder ${copy[id]?.title}`}
                  className="-ml-1"
                />
                <div className="min-w-0 flex-1">
                  <CardTitle className="text-base">{copy[id]?.title}</CardTitle>
                  <CardDescription>{copy[id]?.body}</CardDescription>
                </div>
              </CardHeader>
            </Card>
          </DragDropItem>
        ))}
      </DragDropList>
    </DragDrop>
  );
}

function TwoColumnBoard() {
  const [items, setItems] = useState({
    todo: ["Task A", "Task B"],
    done: ["Task C", "Task D"],
  });

  return (
    <DragDrop
      items={items}
      onReorder={(next) => setItems(next as { todo: string[]; done: string[] })}
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
                  <DragDropHandle aria-label={`Reorder ${item}`} />
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

function InPracticeDashboard() {
  const [widgets, setWidgets] = useState(["traffic", "conversion", "queue"]);

  return (
    <div className="border-border w-full max-w-2xl rounded-md border">
      <div className="flex items-center justify-between gap-3 p-3">
        <div>
          <p className="text-sm font-medium">Workspace widgets</p>
          <p className="text-muted-foreground text-xs">
            Drag handles reorder; actions stay clickable.
          </p>
        </div>
        <Badge variant="secondary">Live</Badge>
      </div>
      <Separator />
      <ScrollArea className="h-64">
        <div className="p-3">
          <DragDrop
            items={widgets}
            onReorder={(next) => setWidgets(next as string[])}
          >
            <DragDropList className="gap-3">
              {widgets.map((id) => (
                <DragDropItem key={id} id={id} className="p-0">
                  <Card className="border-0 shadow-none">
                    <CardHeader className="flex-row items-center gap-2 space-y-0 p-4 pb-2">
                      <DragDropHandle aria-label={`Reorder ${id}`} />
                      <CardTitle className="text-sm capitalize">{id}</CardTitle>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        className="ml-auto"
                      >
                        Open
                      </Button>
                    </CardHeader>
                    <CardContent className="text-muted-foreground px-4 pb-4 text-xs">
                      Sample dashboard tile — nested controls remain usable.
                    </CardContent>
                  </Card>
                </DragDropItem>
              ))}
            </DragDropList>
          </DragDrop>
        </div>
      </ScrollArea>
    </div>
  );
}

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
    code: `<DragDrop items={items} disabledIds={["System Task"]} onReorder={setItems}>
  <DragDropList>
    {items.map((item) => (
      <DragDropItem key={item} id={item}>
        <DragDropHandle aria-label={\`Reorder \${item}\`} />
        {item}
      </DragDropItem>
    ))}
  </DragDropList>
</DragDrop>`,
  },
  {
    id: "dashboard",
    title: "Dashboard cards",
    description: "Reorder compact dashboard cards with handle-based dragging.",
    preview: <DashboardCards />,
    code: `// DragDrop + Card composition — see preview.`,
  },
  {
    id: "board",
    title: "Multiple containers",
    description:
      "Move items between Todo and Done lists. Not a full Kanban product.",
    preview: <TwoColumnBoard />,
    code: `<DragDrop items={columns} onReorder={setColumns}>
  <DragDropList id="todo" items={columns.todo}>...</DragDropList>
  <DragDropList id="done" items={columns.done}>...</DragDropList>
</DragDrop>`,
  },
];

export const inPractice: ComponentInPractice = {
  description:
    "A small widget strip: Card, Badge, Button, Separator, and Scroll Area with accessible reorder handles.",
  preview: <InPracticeDashboard />,
  code: usage,
};

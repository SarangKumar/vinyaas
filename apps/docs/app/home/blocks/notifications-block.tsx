"use client";

import { useState } from "react";

import { PlayBlock } from "@/app/home/play-block";
import { Avatar, AvatarFallback } from "@/registry/new-york/ui/avatar/avatar";
import { Badge } from "@/registry/new-york/ui/badge/badge";
import { Button } from "@/registry/new-york/ui/button/button";
import { ScrollArea } from "@/registry/new-york/ui/scroll-area/scroll-area";

const initial = [
  {
    id: "review",
    name: "Priya Shah",
    initials: "PS",
    text: "Approved the March invoice.",
    time: "2m",
    unread: true,
  },
  {
    id: "deploy",
    name: "Rahul Mehta",
    initials: "RM",
    text: "Production deploy finished.",
    time: "18m",
    unread: true,
  },
  {
    id: "note",
    name: "Ada Lovelace",
    initials: "AL",
    text: "Left a note on the billing draft.",
    time: "1h",
    unread: false,
  },
];

export function NotificationsBlock() {
  const [items, setItems] = useState(initial);

  return (
    <PlayBlock title="Notifications">
      <p className="text-muted-foreground text-xs">Today</p>
      <ScrollArea className="max-h-56">
        <ul className="grid gap-4 pr-2">
          {items.map((item) => (
            <li key={item.id} className="flex min-w-0 items-start gap-3">
              <Avatar className="size-8">
                <AvatarFallback>{item.initials}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-medium">{item.name}</p>
                  {item.unread ? <Badge>Unread</Badge> : null}
                  <span className="text-muted-foreground ml-auto text-xs">
                    {item.time}
                  </span>
                </div>
                <p className="text-muted-foreground text-sm">{item.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </ScrollArea>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() =>
          setItems((current) =>
            current.map((item) => ({ ...item, unread: false })),
          )
        }
      >
        Mark all read
      </Button>
    </PlayBlock>
  );
}

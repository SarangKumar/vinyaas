"use client";

import { useState } from "react";

import { PlayBlock } from "@/app/home/play-block";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/registry/new-york/ui/resizable";

/**
 * Inbox list + reading pane — the split people actually resize. Light enough
 * for the masonry: no sidebar or app nav chrome, just the two panes.
 */
const THREADS = [
  {
    id: "contract",
    from: "Priya Raman",
    subject: "Re: contract redlines",
    time: "09:24",
    body: "Legal cleared sections 4 and 7. The indemnity cap is the last open item — can you confirm the number before we send it back?",
  },
  {
    id: "build",
    from: "Deploy bot",
    subject: "acme-web · build passed",
    time: "08:57",
    body: "Build #4820 passed in 1m 42s and is live in production. No failing checks.",
  },
  {
    id: "pricing",
    from: "Sam Okafor",
    subject: "Q3 pricing deck",
    time: "Yesterday",
    body: "Draft is in the shared drive. I left comments on the enterprise tier slide.",
  },
];

export function ResizableBlock() {
  const [activeId, setActiveId] = useState("contract");
  const active = THREADS.find((thread) => thread.id === activeId) ?? THREADS[0];

  return (
    <PlayBlock
      title="Inbox"
      description="Drag the divider to give the reading pane more room."
    >
      <ResizablePanelGroup
        orientation="horizontal"
        className="border-border bg-background h-44 w-full overflow-hidden rounded-md border"
      >
        <ResizablePanel defaultSize="42%" minSize="28%" maxSize="60%">
          <ul className="flex h-full flex-col overflow-y-auto">
            {THREADS.map((thread) => (
              <li key={thread.id}>
                <button
                  type="button"
                  onClick={() => setActiveId(thread.id)}
                  aria-current={thread.id === activeId}
                  className="hover:bg-accent/50 aria-current:bg-accent border-border/60 w-full border-b px-3 py-2 text-left"
                >
                  <div className="flex min-w-0 items-baseline justify-between gap-2">
                    <span className="truncate text-xs font-medium">
                      {thread.from}
                    </span>
                    <span className="text-muted-foreground shrink-0 text-[0.6875rem]">
                      {thread.time}
                    </span>
                  </div>
                  <p className="text-muted-foreground mt-0.5 truncate text-xs">
                    {thread.subject}
                  </p>
                </button>
              </li>
            ))}
          </ul>
        </ResizablePanel>
        <ResizableHandle withHandle aria-label="Resize panels" />
        <ResizablePanel defaultSize="58%" minSize="30%">
          <article className="flex h-full flex-col gap-2 overflow-y-auto p-3">
            <p className="text-sm font-medium">{active.subject}</p>
            <p className="text-muted-foreground text-xs">
              {active.from} · {active.time}
            </p>
            <p className="text-muted-foreground text-xs leading-5">
              {active.body}
            </p>
          </article>
        </ResizablePanel>
      </ResizablePanelGroup>
    </PlayBlock>
  );
}

"use client";

import { PlayBlock } from "@/app/home/play-block";
import { Badge } from "@/registry/new-york/ui/badge";
import { Button } from "@/registry/new-york/ui/button";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/registry/new-york/ui/resizable";
import { ScrollArea } from "@/registry/new-york/ui/scroll-area";
import { Separator } from "@/registry/new-york/ui/separator";

/**
 * Homepage showcase for Resizable — nested horizontal + vertical groups in a
 * compact workspace shell. Kept short for masonry card height.
 */
export function ResizableBlock() {
  return (
    <PlayBlock
      title="Workspace"
      description="Drag or focus handles to resize nested panes."
    >
      <ResizablePanelGroup
        orientation="horizontal"
        className="border-border bg-background min-h-[220px] w-full overflow-hidden rounded-md border"
      >
        <ResizablePanel defaultSize="30%" minSize="20%" maxSize="42%">
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between gap-2 px-3 py-2">
              <p className="text-sm font-medium">Explorer</p>
              <Badge variant="outline">Live</Badge>
            </div>
            <Separator />
            <ScrollArea className="min-h-0 flex-1 px-2 py-2">
              <ul className="flex flex-col gap-0.5 text-sm">
                {["Overview", "Projects", "Billing", "Settings"].map((item) => (
                  <li key={item}>
                    <button
                      type="button"
                      className="hover:bg-muted w-full rounded-md px-2 py-1.5 text-left"
                    >
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </ScrollArea>
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle aria-label="Resize explorer" />
        <ResizablePanel defaultSize="70%" minSize="40%">
          <ResizablePanelGroup orientation="vertical">
            <ResizablePanel defaultSize="58%" minSize="30%">
              <div className="flex h-full flex-col">
                <div className="flex items-center justify-between gap-2 px-3 py-2">
                  <p className="text-sm font-medium">Editor</p>
                  <Button size="sm" variant="outline">
                    Share
                  </Button>
                </div>
                <Separator />
                <div className="text-muted-foreground flex flex-1 items-center justify-center p-3 text-sm">
                  Main canvas
                </div>
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle aria-label="Resize terminal" />
            <ResizablePanel defaultSize="42%" minSize="20%">
              <div className="bg-muted/40 flex h-full flex-col">
                <p className="text-muted-foreground px-3 py-1.5 text-xs tracking-wide uppercase">
                  Terminal
                </p>
                <Separator />
                <ScrollArea className="text-muted-foreground min-h-0 flex-1 p-3 font-mono text-xs">
                  <p>$ vinyaas add resizable</p>
                  <p className="text-foreground">✓ Installed</p>
                </ScrollArea>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </PlayBlock>
  );
}

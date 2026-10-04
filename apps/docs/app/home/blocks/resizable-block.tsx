"use client";

import { PlayBlock } from "@/app/home/play-block";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/registry/new-york/ui/resizable";

/**
 * Compact homepage Resizable example — sidebar | main only.
 * Nested IDE layouts live on the Resizable docs page.
 */
export function ResizableBlock() {
  return (
    <PlayBlock
      title="Resizable"
      description="Drag the handle to resize the sidebar."
    >
      <ResizablePanelGroup
        orientation="horizontal"
        className="border-border bg-background min-h-[160px] w-full overflow-hidden rounded-md border"
      >
        <ResizablePanel defaultSize="34%" minSize="22%" maxSize="48%">
          <div className="text-muted-foreground flex h-full items-center justify-center p-3 text-sm">
            Sidebar
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle aria-label="Resize sidebar" />
        <ResizablePanel defaultSize="66%" minSize="40%">
          <div className="text-muted-foreground flex h-full items-center justify-center p-3 text-sm">
            Main content
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </PlayBlock>
  );
}

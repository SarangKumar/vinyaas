"use client";

import { PlayBlock } from "@/app/home/play-block";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/registry/new-york/ui/resizable";

/**
 * Light two-pane split — no sidebar/nav chrome.
 */
export function ResizableBlock() {
  return (
    <PlayBlock
      title="Resizable"
      description="Drag the handle to adjust the split."
    >
      <ResizablePanelGroup
        orientation="horizontal"
        className="border-border bg-background h-36 w-full overflow-hidden rounded-md border"
      >
        <ResizablePanel defaultSize="40%" minSize="25%" maxSize="60%">
          <div className="text-muted-foreground flex h-full items-center justify-center p-3 text-sm">
            Outline
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle aria-label="Resize panels" />
        <ResizablePanel defaultSize="60%" minSize="30%">
          <div className="text-muted-foreground flex h-full items-center justify-center p-3 text-sm">
            Preview
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </PlayBlock>
  );
}

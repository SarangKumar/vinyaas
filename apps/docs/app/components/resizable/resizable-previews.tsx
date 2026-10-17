"use client";

import type { ControlValues } from "@/components/component-demo";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
  type ResizableVariant,
} from "@/registry/new-york/ui/resizable";

export function ResizablePreview({ values }: { values: ControlValues }) {
  const isVertical = values.orientation === "vertical";
  return (
    <ResizablePanelGroup
      key={`${values.orientation}-${values.variant}`}
      orientation={values.orientation as "horizontal" | "vertical"}
      variant={values.variant as ResizableVariant}
      className={`border-border rounded-md border ${isVertical ? "max-h-[220px] min-h-[220px]" : "min-h-[160px]"} w-full max-w-2xl`}
    >
      <ResizablePanel defaultSize="40" minSize="20">
        <div className="text-muted-foreground flex h-full items-center justify-center p-4 text-sm">
          {isVertical ? "Top" : "Sidebar"}
        </div>
      </ResizablePanel>
      <ResizableHandle
        withHandle={values.withHandle as boolean}
        aria-label="Resize"
      />
      <ResizablePanel defaultSize="60">
        <div className="text-muted-foreground flex h-full items-center justify-center p-4 text-sm">
          {isVertical ? "Bottom" : "Main"}
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}

"use client";

import {
  Group,
  Panel,
  Separator as PanelSeparator,
  type GroupProps,
  type PanelProps,
  type SeparatorProps as PanelSeparatorProps,
} from "react-resizable-panels";

import { cn } from "@/lib/utils";

export type ResizablePanelGroupProps = GroupProps;

/**
 * Resizable panel group backed by `react-resizable-panels`.
 * Orientation comes from the library; vertical groups stack via ARIA.
 *
 * Cursor feedback (including corner/crossing 2D cursors when horizontal and
 * vertical handles intersect) is owned by the library — do not set
 * `disableCursor` unless you replace that behavior.
 */
export function ResizablePanelGroup({
  className,
  ...props
}: ResizablePanelGroupProps) {
  return (
    <Group
      data-slot="resizable-panel-group"
      className={cn(
        "flex h-full w-full aria-[orientation=vertical]:flex-col",
        className,
      )}
      {...props}
    />
  );
}

export type ResizablePanelProps = PanelProps;

export function ResizablePanel({ className, ...props }: ResizablePanelProps) {
  return (
    <Panel
      data-slot="resizable-panel"
      className={cn("min-h-0 min-w-0", className)}
      {...props}
    />
  );
}

export type ResizableHandleProps = PanelSeparatorProps & {
  /** Renders a centered grip affordance inside the handle. */
  withHandle?: boolean;
};

/**
 * Keyboard-accessible resize handle (`role="separator"` from the library).
 *
 * Visual bar stays thin (`w-px` / `h-px`). A wider centered `::after` hit
 * target improves pointer and touch use. Orientation drives dimensions,
 * cursor fallback, hit-area axis, and withHandle rotation.
 *
 * Default styles size a vertical bar (horizontal group → `col-resize`).
 * When the separator reports `aria-orientation="horizontal"` (vertical group),
 * classes flip to a horizontal bar (`row-resize`). Height of the vertical bar
 * comes from flex stretch — do not force `h-full`.
 */
export function ResizableHandle({
  className,
  withHandle = false,
  disabled,
  ...props
}: ResizableHandleProps) {
  return (
    <PanelSeparator
      data-slot="resizable-handle"
      data-hit-area="expanded"
      disabled={disabled}
      className={cn(
        "bg-border focus-visible:ring-ring relative flex w-px items-center justify-center",
        // Fallback when the library hover stylesheet is inactive. Crossing
        // handles override via the library's 2D cursor (move / grab / nwse*).
        "cursor-col-resize",
        "after:absolute after:inset-y-0 after:left-1/2 after:w-3 after:-translate-x-1/2",
        "focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:outline-none",
        "aria-[orientation=horizontal]:h-px aria-[orientation=horizontal]:w-full",
        "aria-[orientation=horizontal]:cursor-row-resize",
        "aria-[orientation=horizontal]:after:inset-x-0 aria-[orientation=horizontal]:after:top-1/2",
        "aria-[orientation=horizontal]:after:left-0 aria-[orientation=horizontal]:after:h-3",
        "aria-[orientation=horizontal]:after:w-full aria-[orientation=horizontal]:after:translate-x-0",
        "aria-[orientation=horizontal]:after:-translate-y-1/2",
        "data-[separator=active]:bg-ring",
        "motion-reduce:transition-none",
        "[&[aria-orientation=horizontal]>div]:rotate-90",
        disabled && "pointer-events-none opacity-50",
        className,
      )}
      {...props}
    >
      {withHandle ? (
        <div
          aria-hidden="true"
          data-slot="resizable-handle-grip"
          className="bg-border z-10 flex h-4 w-3 items-center justify-center rounded-sm border"
        >
          <div className="bg-muted-foreground/70 h-2.5 w-px" />
          <div className="bg-muted-foreground/70 ml-0.5 h-2.5 w-px" />
        </div>
      ) : null}
    </PanelSeparator>
  );
}

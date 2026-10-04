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
 * Default styles size a vertical bar (horizontal group). When the separator
 * reports `aria-orientation="horizontal"` (vertical group), width/height and
 * the hit-target `::after` flip. Height comes from the flex group stretch —
 * do not force `h-full` on the vertical bar.
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
      disabled={disabled}
      className={cn(
        "bg-border focus-visible:ring-ring relative flex w-px items-center justify-center",
        "after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2",
        "focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:outline-none",
        "aria-[orientation=horizontal]:h-px aria-[orientation=horizontal]:w-full",
        "aria-[orientation=horizontal]:after:left-0 aria-[orientation=horizontal]:after:h-1",
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
          className="bg-border z-10 flex h-4 w-3 items-center justify-center rounded-sm border"
        >
          <div className="bg-muted-foreground/70 h-2.5 w-px" />
          <div className="bg-muted-foreground/70 ml-0.5 h-2.5 w-px" />
        </div>
      ) : null}
    </PanelSeparator>
  );
}

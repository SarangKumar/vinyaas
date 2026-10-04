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
 * Use `orientation` to match ARIA/`Separator` conventions in Vinyaas.
 */
export function ResizablePanelGroup({
  className,
  orientation = "horizontal",
  ...props
}: ResizablePanelGroupProps) {
  return (
    <Group
      data-slot="resizable-panel-group"
      orientation={orientation}
      className={cn(
        "flex h-full w-full",
        orientation === "vertical" && "flex-col",
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
 * Provide an `aria-label` when neighboring panels are not otherwise named.
 *
 * In a horizontal group the handle reports `aria-orientation="vertical"`.
 * In a vertical group the handle reports `aria-orientation="horizontal"`.
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
        "bg-border focus-visible:ring-ring relative flex items-center justify-center",
        "focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:outline-none",
        // Horizontal group → vertical separator bar
        "aria-[orientation=vertical]:h-full aria-[orientation=vertical]:w-px",
        "aria-[orientation=vertical]:after:absolute aria-[orientation=vertical]:after:inset-y-0",
        "aria-[orientation=vertical]:after:left-1/2 aria-[orientation=vertical]:after:w-4",
        "aria-[orientation=vertical]:after:-translate-x-1/2",
        // Vertical group → horizontal separator bar
        "aria-[orientation=horizontal]:h-px aria-[orientation=horizontal]:w-full",
        "aria-[orientation=horizontal]:after:absolute aria-[orientation=horizontal]:after:inset-x-0",
        "aria-[orientation=horizontal]:after:top-1/2 aria-[orientation=horizontal]:after:h-4",
        "aria-[orientation=horizontal]:after:-translate-y-1/2",
        "data-[separator=active]:bg-ring",
        "motion-reduce:transition-none",
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

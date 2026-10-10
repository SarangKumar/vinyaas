"use client";

import { createContext, useContext } from "react";
import {
  Group,
  Panel,
  Separator as PanelSeparator,
  type GroupProps,
  type PanelProps,
  type SeparatorProps as PanelSeparatorProps,
} from "react-resizable-panels";

import { cn } from "@/lib/utils";

export type ResizableVariant = "default" | "blocks";

const ResizableVariantContext = createContext<ResizableVariant>("default");

export type ResizablePanelGroupProps = GroupProps & {
  /**
   * `default` is one surface split by a thin line. `blocks` renders each
   * panel as its own bordered block with a small gutter between them; the
   * gutter shows a three-dot grip.
   */
  variant?: ResizableVariant;
};

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
  variant = "default",
  ...props
}: ResizablePanelGroupProps) {
  return (
    <ResizableVariantContext.Provider value={variant}>
      <Group
        data-slot="resizable-panel-group"
        data-variant={variant}
        className={cn(
          "flex h-full w-full aria-[orientation=vertical]:flex-col",
          className,
        )}
        {...props}
      />
    </ResizableVariantContext.Provider>
  );
}

export type ResizablePanelProps = PanelProps;

export function ResizablePanel({ className, ...props }: ResizablePanelProps) {
  const variant = useContext(ResizableVariantContext);

  return (
    <Panel
      data-slot="resizable-panel"
      className={cn(
        "min-h-0 min-w-0",
        variant === "blocks" &&
          "border-border bg-card overflow-hidden rounded-lg border",
        className,
      )}
      {...props}
    />
  );
}

export type ResizableHandleProps = PanelSeparatorProps & {
  /**
   * Renders a centered orientation-aware grip affordance on the separator.
   * Defaults to `false`, or `true` inside a `blocks` group.
   */
  withHandle?: boolean;
};

/**
 * Grip is always a 2×3 dot grid (horizontal-resize / vertical bar).
 * On a horizontal separator (vertical resize), rotate 90° so it reads as 3×2.
 *
 * Secondary surface, rounded, padded, no border. Dots use foreground.
 */
function ResizableHandleGrip() {
  return (
    <div
      aria-hidden="true"
      data-slot="resizable-handle-grip"
      className={cn(
        "bg-secondary z-10 flex shrink-0 items-center justify-center rounded-sm p-1",
        // Vertical-resize bar: tip the same 2×3 grip onto its side.
        "group-aria-[orientation=horizontal]/resizable-handle:rotate-90",
      )}
    >
      <div
        data-slot="resizable-handle-grip-dots"
        className="grid grid-cols-2 gap-0.5"
      >
        {Array.from({ length: 6 }, (_, index) => (
          <span
            key={index}
            className="bg-foreground size-0.5 shrink-0 rounded-full"
          />
        ))}
      </div>
    </div>
  );
}

/**
 * Three-dot grip for the `blocks` variant. The gutter is the whole gap
 * between blocks, so the dots sit on the page background with no box.
 * Rotated on horizontal separators (vertical resize).
 */
function ResizableHandleDots() {
  return (
    <svg
      viewBox="0 0 4 16"
      aria-hidden="true"
      data-slot="resizable-handle-dots"
      className={cn(
        "text-muted-foreground/60 group-hover/resizable-handle:text-foreground group-data-[separator=active]/resizable-handle:text-foreground h-4 w-1 shrink-0 transition-colors",
        "group-aria-[orientation=horizontal]/resizable-handle:rotate-90",
      )}
      fill="currentColor"
    >
      <circle cx="2" cy="2.5" r="1.4" />
      <circle cx="2" cy="8" r="1.4" />
      <circle cx="2" cy="13.5" r="1.4" />
    </svg>
  );
}

/**
 * Keyboard-accessible resize handle (`role="separator"` from the library).
 *
 * Visual bar stays thin (`w-px` / `h-px`). A wider centered `::after` hit
 * target improves pointer and touch use. Orientation drives dimensions,
 * cursor fallback, hit-area axis, and grip dot arrangement.
 *
 * Default styles size a vertical bar (horizontal group → `col-resize`).
 * When the separator reports `aria-orientation="horizontal"` (vertical group),
 * classes flip to a horizontal bar (`row-resize`). Height of the vertical bar
 * comes from flex stretch — do not force `h-full`.
 */
export function ResizableHandle({
  className,
  withHandle,
  disabled,
  ...props
}: ResizableHandleProps) {
  const blocks = useContext(ResizableVariantContext) === "blocks";
  // Blocks have no divider line, so the grip is on unless explicitly disabled.
  const showHandle = withHandle ?? blocks;

  return (
    <PanelSeparator
      data-slot="resizable-handle"
      data-hit-area="expanded"
      disabled={disabled}
      className={cn(
        "group/resizable-handle",
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
        blocks &&
          "w-2 bg-transparent aria-[orientation=horizontal]:h-2 data-[separator=active]:bg-transparent",
        "motion-reduce:transition-none",
        disabled && "pointer-events-none opacity-50",
        className,
      )}
      {...props}
    >
      {showHandle ? (
        blocks ? (
          <ResizableHandleDots />
        ) : (
          <ResizableHandleGrip />
        )
      ) : null}
    </PanelSeparator>
  );
}

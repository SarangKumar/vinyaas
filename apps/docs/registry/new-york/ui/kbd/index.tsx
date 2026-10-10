import React from "react";

import { cn } from "@/lib/utils";

export type KbdProps = React.ComponentProps<"kbd">;

// Modifier and navigation glyphs (⌘ ⌥ ⇧ ⌃ ⏎ ⌫ ⇥ ← ↑ → ↓ …) draw much smaller than
// capital letters at the same font size, so they get a larger size to match.
const symbolKey = /^[←-⇿⌀-⏿⌘⌥⌃⇧⌦]+$/u;

export function Kbd({ className, children, ref, ...props }: KbdProps) {
  const symbol = typeof children === "string" && symbolKey.test(children);

  return (
    <kbd
      ref={ref}
      data-symbol={symbol ? "" : undefined}
      className={cn(
        "border-border bg-muted text-foreground box-border inline-flex h-5 min-w-5 items-center justify-center rounded-sm border px-1 font-mono text-xs leading-none",
        symbol && "font-sans text-[0.9375rem]",
        className,
      )}
      {...props}
    >
      {children}
    </kbd>
  );
}

export type KbdGroupProps = React.ComponentProps<"kbd">;

/**
 * Groups keys of one shortcut, e.g. <KbdGroup><Kbd>⌘</Kbd><Kbd>K</Kbd></KbdGroup>.
 * Use one Kbd per key so symbol keys get their size adjustment.
 */
export function KbdGroup({ className, ref, ...props }: KbdGroupProps) {
  return (
    <kbd
      ref={ref}
      data-slot="kbd-group"
      className={cn("inline-flex items-center gap-1", className)}
      {...props}
    />
  );
}

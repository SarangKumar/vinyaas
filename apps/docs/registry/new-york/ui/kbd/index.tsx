import React from "react";

import { cn } from "@/lib/utils";

export type KbdProps = React.ComponentProps<"kbd">;

// Modifier and navigation glyphs (arrows U+2190–21FF, ⌘ ⌥ ⌃ ⏎ ⌫ … in
// U+2300–23FF) draw much smaller than capital letters at the same font size,
// so they get a larger size to match.
const symbolChar = /[\u2190-\u21ff\u2300-\u23ff]/u;
const symbolKey = /^[\u2190-\u21ff\u2300-\u23ff]+$/u;

/**
 * A mixed label such as "⌘K" stays one key; only its symbol glyphs are
 * enlarged so every character reads at the same height.
 */
function renderLabel(children: React.ReactNode) {
  if (
    typeof children !== "string" ||
    symbolKey.test(children) ||
    !symbolChar.test(children)
  ) {
    return children;
  }

  return Array.from(children).map((char, index) =>
    symbolChar.test(char) ? (
      <span
        key={index}
        data-symbol-glyph=""
        className="font-sans text-[0.9375rem] leading-none"
      >
        {char}
      </span>
    ) : (
      char
    ),
  );
}

export function Kbd({ className, children, ref, ...props }: KbdProps) {
  const symbol = typeof children === "string" && symbolKey.test(children);

  return (
    <kbd
      ref={ref}
      data-symbol={symbol ? "" : undefined}
      className={cn(
        "border-border bg-muted text-foreground box-border inline-flex h-5 min-w-5 items-center justify-center gap-px rounded-sm border px-1 font-mono text-xs leading-none",
        symbol && "font-sans text-[0.9375rem]",
        className,
      )}
      {...props}
    >
      {renderLabel(children)}
    </kbd>
  );
}

export type KbdGroupProps = React.ComponentProps<"kbd">;

/**
 * Groups separate keys of one shortcut, e.g. Ctrl + K as two keys. For a
 * compact single key such as "⌘K", use one Kbd.
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

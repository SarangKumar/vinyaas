"use client";

import React, { useState } from "react";

import { cn } from "@/lib/utils";

export function Table({
  className,
  ref,
  ...props
}: React.ComponentProps<"table">) {
  return (
    <div className="border-border bg-background w-full min-w-0 overflow-x-auto rounded-3xl border">
      <table
        ref={ref}
        className={cn("w-full caption-bottom text-sm", className)}
        {...props}
      />
    </div>
  );
}

export function TableHeader({
  className,
  ...props
}: React.ComponentProps<"thead">) {
  return (
    <thead
      className={cn("border-border/50 bg-card border-b", className)}
      {...props}
    />
  );
}

export function TableBody({
  className,
  ...props
}: React.ComponentProps<"tbody">) {
  return <tbody className={cn(className)} {...props} />;
}

export function TableFooter({
  className,
  ...props
}: React.ComponentProps<"tfoot">) {
  return (
    <tfoot
      className={cn("border-border bg-muted border-t font-medium", className)}
      {...props}
    />
  );
}

export function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr
      className={cn(
        "border-border/40 hover:bg-accent/30 border-b last:border-b-0",
        className,
      )}
      {...props}
    />
  );
}

export function TableHead({
  className,
  resizable,
  style,
  children,
  ...props
}: React.ComponentProps<"th"> & {
  /** Adds a drag handle on the right edge so the column can be resized. */
  resizable?: boolean;
}) {
  const [width, setWidth] = useState<number | null>(null);

  function onResizeStart(e: React.MouseEvent) {
    e.preventDefault();
    const th = (e.currentTarget as HTMLElement).closest("th");
    const startX = e.clientX;
    const startW = th?.getBoundingClientRect().width ?? 80;

    function onMove(ev: MouseEvent) {
      setWidth(Math.max(40, startW + (ev.clientX - startX)));
    }
    function onUp() {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    }
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  }

  return (
    <th
      className={cn(
        "text-muted-foreground h-11 px-4 text-left align-middle text-xs font-medium tracking-widest uppercase",
        resizable && "relative select-none",
        className,
      )}
      style={width != null ? { width, ...style } : style}
      {...props}
    >
      {children}
      {resizable && (
        <span
          aria-hidden="true"
          onMouseDown={onResizeStart}
          className="group/handle absolute top-0 right-0 bottom-0 z-10 flex w-3 cursor-col-resize items-stretch justify-end"
        >
          <span className="bg-border/50 group-hover/handle:bg-primary/60 w-px transition-colors" />
        </span>
      )}
    </th>
  );
}

export function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  return (
    <td className={cn("px-4 py-3.5 align-middle", className)} {...props} />
  );
}

export function TableCaption({
  className,
  ...props
}: React.ComponentProps<"caption">) {
  return (
    <caption
      className={cn("text-muted-foreground mt-3 text-sm", className)}
      {...props}
    />
  );
}

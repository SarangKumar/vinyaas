import React from "react";

import { cn } from "@/lib/utils";

export type AspectRatioProps = React.ComponentProps<"div"> & {
  ratio: number;
};

export function AspectRatio({
  ratio,
  className,
  style,
  children,
  ...props
}: AspectRatioProps) {
  return (
    <div
      data-slot="aspect-ratio"
      className={cn("relative w-full", className)}
      style={{ aspectRatio: String(ratio), ...style }}
      {...props}
    >
      <div className="absolute inset-0 size-full [&>img]:size-full [&>img]:object-cover">
        {children}
      </div>
    </div>
  );
}

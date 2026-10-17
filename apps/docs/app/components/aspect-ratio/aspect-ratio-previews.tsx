"use client";

import type { ControlValues } from "@/components/component-demo";
import { AspectRatio } from "@/registry/new-york/ui/aspect-ratio";

export function AspectRatioPreview({ values }: { values: ControlValues }) {
  return (
    <AspectRatio
      ratio={values.ratio as number}
      className="bg-muted max-w-sm overflow-hidden rounded-md"
    >
      <div className="text-muted-foreground flex size-full items-center justify-center text-sm">
        {(values.ratio as number).toFixed(2)}:1
      </div>
    </AspectRatio>
  );
}

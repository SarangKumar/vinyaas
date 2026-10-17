"use client";
import type { ControlValues } from "@/components/component-demo";
import { Button } from "@/registry/new-york/ui/button";
import { Tooltip, type TooltipSide } from "@/registry/new-york/ui/tooltip";

export function TooltipPreview({ values }: { values: ControlValues }) {
  return (
    <Tooltip
      content="Add to library"
      side={values.side as TooltipSide}
      delayDuration={values.delayDuration as number}
    >
      <Button type="button" variant="outline">
        Hover me
      </Button>
    </Tooltip>
  );
}

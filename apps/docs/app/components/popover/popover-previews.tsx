"use client";
import type { ControlValues } from "@/components/component-demo";
import { Button } from "@/registry/new-york/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  type PopoverSide,
  type PopoverAlign,
} from "@/registry/new-york/ui/popover";

export function PopoverPreview({ values }: { values: ControlValues }) {
  return (
    <Popover defaultOpen>
      <PopoverTrigger>
        <Button type="button">Details</Button>
      </PopoverTrigger>
      <PopoverContent
        side={values.side as PopoverSide}
        align={values.align as PopoverAlign}
      >
        <p className="text-sm">Installed as source into your project.</p>
      </PopoverContent>
    </Popover>
  );
}

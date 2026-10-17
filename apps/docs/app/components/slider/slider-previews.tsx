"use client";

import { useState } from "react";
import type { ControlValues } from "@/components/component-demo";
import { Label } from "@/registry/new-york/ui/label";
import { Slider } from "@/registry/new-york/ui/slider";

export function SliderPreview({ values }: { values: ControlValues }) {
  const init = (values.defaultValue as number) ?? 40;
  const [current, setCurrent] = useState(init);
  return (
    <div className="grid w-full max-w-sm gap-3">
      <div className="flex items-center justify-between">
        <Label>Volume</Label>
        <span className="text-foreground text-sm font-medium tabular-nums">
          {current}
        </span>
      </div>
      {/* key remounts the slider whenever the range bounds or initial value changes */}
      <Slider
        key={`${values.min}-${values.max}-${values.step}-${init}`}
        defaultValue={init}
        min={values.min as number}
        max={values.max as number}
        step={values.step as number}
        onValueChange={setCurrent}
        aria-label="Volume"
      />
    </div>
  );
}

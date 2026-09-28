"use client";

import React from "react";

import { cn } from "@/lib/utils";

export type SliderProps = Omit<React.ComponentProps<"input">, "type"> & {
  onValueChange?: (value: number) => void;
};

export function Slider({
  className,
  min = 0,
  max = 100,
  step = 1,
  onChange,
  onValueChange,
  ref,
  ...props
}: SliderProps) {
  return (
    <input
      ref={ref}
      type="range"
      min={min}
      max={max}
      step={step}
      className={cn(
        "bg-muted accent-foreground h-2 w-full cursor-pointer appearance-none rounded-full",
        "focus-visible:ring-ring focus-visible:ring-offset-background focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "[&::-webkit-slider-thumb]:bg-foreground [&::-webkit-slider-thumb]:size-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full",
        "[&::-moz-range-thumb]:bg-foreground [&::-moz-range-thumb]:size-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0",
        className,
      )}
      {...props}
      onChange={(event) => {
        onChange?.(event);
        onValueChange?.(event.currentTarget.valueAsNumber);
      }}
    />
  );
}

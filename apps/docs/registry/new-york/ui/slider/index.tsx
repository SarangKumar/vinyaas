"use client";

import React, { useState } from "react";

import { cn } from "@/lib/utils";

export type SliderProps = Omit<
  React.ComponentProps<"input">,
  "type" | "value" | "defaultValue"
> & {
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
};

const thumbClass =
  "[&::-webkit-slider-thumb]:border-secondary [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:size-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-moz-range-thumb]:border-secondary [&::-moz-range-thumb]:bg-primary [&::-moz-range-thumb]:size-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-solid";

function percent(value: number, min: number, max: number) {
  const span = max - min;

  if (span <= 0) {
    return 0;
  }

  return Math.min(100, Math.max(0, ((value - min) / span) * 100));
}

function fill(start: number, end: number) {
  return `linear-gradient(to right, var(--muted) ${start}%, var(--primary) ${start}%, var(--primary) ${end}%, var(--muted) ${end}%)`;
}

export function Slider({
  className,
  min = 0,
  max = 100,
  step = 1,
  value,
  defaultValue,
  onChange,
  onValueChange,
  ref,
  ...props
}: SliderProps) {
  const minimum = Number(min);
  const maximum = Number(max);
  const [uncontrolled, setUncontrolled] = useState(
    Number(defaultValue ?? minimum),
  );
  const current = value ?? uncontrolled;
  const filled = percent(current, minimum, maximum);

  return (
    <input
      ref={ref}
      type="range"
      min={min}
      max={max}
      step={step}
      value={current}
      style={{ background: fill(0, filled) }}
      className={cn(
        "h-2 w-full cursor-pointer appearance-none rounded-full",
        "focus-visible:ring-ring focus-visible:ring-offset-background focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
        "disabled:cursor-not-allowed disabled:opacity-50",
        thumbClass,
        className,
      )}
      {...props}
      onChange={(event) => {
        const next = event.currentTarget.valueAsNumber;

        if (value === undefined) {
          setUncontrolled(next);
        }

        onChange?.(event);
        onValueChange?.(next);
      }}
    />
  );
}

export type RangeSliderProps = Omit<
  React.ComponentProps<"div">,
  "defaultValue" | "onChange"
> & {
  min?: number;
  max?: number;
  step?: number;
  value?: [number, number];
  defaultValue?: [number, number];
  disabled?: boolean;
  onValueChange?: (value: [number, number]) => void;
  "aria-label"?: string;
};

export function RangeSlider({
  className,
  min = 0,
  max = 100,
  step = 1,
  value,
  defaultValue = [20, 80],
  disabled,
  onValueChange,
  "aria-label": ariaLabel = "Range",
  ...props
}: RangeSliderProps) {
  const [uncontrolled, setUncontrolled] =
    useState<[number, number]>(defaultValue);
  const current = value ?? uncontrolled;
  const low = Math.min(current[0], current[1]);
  const high = Math.max(current[0], current[1]);

  function update(next: [number, number]) {
    if (value === undefined) {
      setUncontrolled(next);
    }

    onValueChange?.(next);
  }

  return (
    <div className={cn("relative flex h-4 items-center", className)} {...props}>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute h-2 w-full rounded-full"
        style={{
          background: fill(percent(low, min, max), percent(high, min, max)),
        }}
      />
      {[0, 1].map((index) => (
        <input
          key={index}
          type="range"
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          value={current[index]}
          aria-label={index === 0 ? `${ariaLabel} start` : `${ariaLabel} end`}
          className={cn(
            "pointer-events-none absolute h-2 w-full appearance-none bg-transparent",
            "focus-visible:ring-ring focus-visible:ring-offset-background focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "[&::-moz-range-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:pointer-events-auto",
            thumbClass,
          )}
          onChange={(event) => {
            const next: [number, number] = [...current];

            next[index] = event.currentTarget.valueAsNumber;
            update(next);
          }}
        />
      ))}
    </div>
  );
}

"use client";
import type { ControlValues } from "@/components/component-demo";
import {
  ToggleGroup,
  ToggleGroupItem,
  type ToggleGroupProps,
} from "@/registry/new-york/ui/toggle-group";
export function ToggleGroupPreview({ values }: { values: ControlValues }) {
  return (
    <ToggleGroup
      variant={values.variant as ToggleGroupProps["variant"]}
      size={values.size as ToggleGroupProps["size"]}
      orientation={values.orientation as ToggleGroupProps["orientation"]}
      disabled={values.disabled as boolean}
      spacing={values.spacing as number}
      defaultValue={["week"]}
      aria-label="View"
    >
      <ToggleGroupItem value="day">Day</ToggleGroupItem>
      <ToggleGroupItem value="week">Week</ToggleGroupItem>
      <ToggleGroupItem value="month">Month</ToggleGroupItem>
    </ToggleGroup>
  );
}

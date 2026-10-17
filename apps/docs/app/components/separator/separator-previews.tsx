"use client";
import type { ControlValues } from "@/components/component-demo";
import {
  Separator,
  type SeparatorProps,
} from "@/registry/new-york/ui/separator";
export function SeparatorPreview({ values }: { values: ControlValues }) {
  return (
    <div
      className={
        values.orientation === "vertical" ? "flex h-8 items-center" : "w-32"
      }
    >
      <Separator
        orientation={values.orientation as SeparatorProps["orientation"]}
        className={values.orientation === "vertical" ? "h-full" : ""}
      />
    </div>
  );
}

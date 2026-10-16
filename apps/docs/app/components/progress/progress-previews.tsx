"use client";
import type { ControlValues } from "@/components/component-demo";
import { Progress } from "@/registry/new-york/ui/progress";
export function ProgressPreview({ values }: { values: ControlValues }) {
  return (
    <Progress
      value={values.value as number}
      max={100}
      aria-label="Progress"
      className="w-full max-w-sm"
    />
  );
}

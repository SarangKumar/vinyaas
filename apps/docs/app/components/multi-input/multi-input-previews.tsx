"use client";

import type { ControlValues } from "@/components/component-demo";
import { MultiInput } from "@/registry/new-york/ui/multi-input";

export function MultiInputPreview({ values }: { values: ControlValues }) {
  const max = Number(values.max);

  return (
    <MultiInput
      aria-label="Recipients"
      className="max-w-sm"
      defaultValue={["design", "engineering"]}
      placeholder={(values.placeholder as string) || "Add a team…"}
      max={Number.isFinite(max) && max > 0 ? max : undefined}
      disabled={values.disabled as boolean}
      invalid={values.invalid as boolean}
      allowDuplicates={values.allowDuplicates as boolean}
    />
  );
}

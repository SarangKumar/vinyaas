"use client";

import type { ControlValues } from "@/components/component-demo";
import { Textarea } from "@/registry/new-york/ui/textarea";

export function TextareaPreview({ values }: { values: ControlValues }) {
  return (
    <Textarea
      placeholder={(values.placeholder as string) || "Write something…"}
      disabled={values.disabled as boolean}
      required={values.required as boolean}
      showCount={values.showCount as boolean}
      rows={(values.rows as number) || 4}
      maxRows={values.maxRows as number}
      className="w-full max-w-sm"
    />
  );
}

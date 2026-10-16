"use client";
import type { ControlValues } from "@/components/component-demo";
import { Input } from "@/registry/new-york/ui/input";
export function InputPreview({ values }: { values: ControlValues }) {
  return (
    <Input
      type={values.type as string}
      placeholder={values.placeholder as string}
      disabled={values.disabled as boolean}
      required={values.required as boolean}
      className="w-full max-w-sm"
    />
  );
}

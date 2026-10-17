"use client";

import type { ControlValues } from "@/components/component-demo";
import { Kbd } from "@/registry/new-york/ui/kbd";

export function KbdPreview({ values }: { values: ControlValues }) {
  const label = (values.label as string) || "⌘";
  return (
    <div className="flex items-center gap-2">
      <Kbd>{label}</Kbd>
    </div>
  );
}

"use client";

import type { ControlValues } from "@/components/component-demo";
import { Toggle, type ToggleProps } from "@/registry/new-york/ui/toggle";

export function TogglePreview({ values }: { values: ControlValues }) {
  return (
    /* key remounts so defaultPressed resets the toggle on each control change */
    <Toggle
      key={String(values.defaultPressed)}
      variant={values.variant as ToggleProps["variant"]}
      size={values.size as ToggleProps["size"]}
      disabled={values.disabled as boolean}
      defaultPressed={values.defaultPressed as boolean}
      aria-label="Toggle bold"
    >
      Bold
    </Toggle>
  );
}

"use client";

import type { ControlValues } from "@/components/component-demo";
import { Label } from "@/registry/new-york/ui/label";
import { RadioGroup, RadioGroupItem } from "@/registry/new-york/ui/radio-group";

export function RadioGroupPreview({ values }: { values: ControlValues }) {
  return (
    <RadioGroup
      defaultValue="comfortable"
      disabled={values.disabled as boolean}
      required={values.required as boolean}
      name="spacing-live"
    >
      <div className="flex items-center gap-2">
        <RadioGroupItem value="default" id="rg-live-1" />
        <Label htmlFor="rg-live-1">Default</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="comfortable" id="rg-live-2" />
        <Label htmlFor="rg-live-2">Comfortable</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="compact" id="rg-live-3" />
        <Label htmlFor="rg-live-3">Compact</Label>
      </div>
    </RadioGroup>
  );
}

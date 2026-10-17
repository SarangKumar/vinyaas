"use client";
import type { ControlValues } from "@/components/component-demo";
import { Checkbox } from "@/registry/new-york/ui/checkbox";
import { Label } from "@/registry/new-york/ui/label";
export function CheckboxPreview({ values }: { values: ControlValues }) {
  return (
    <div className="flex items-center gap-2">
      <Checkbox
        checked={values.checked as boolean}
        indeterminate={values.indeterminate as boolean}
        disabled={values.disabled as boolean}
        id="checkbox-live"
      />
      <Label htmlFor="checkbox-live">Accept terms and conditions</Label>
    </div>
  );
}

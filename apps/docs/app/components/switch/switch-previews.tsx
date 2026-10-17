"use client";

import type { ControlValues } from "@/components/component-demo";
import { Label } from "@/registry/new-york/ui/label";
import { Switch } from "@/registry/new-york/ui/switch";

export function SwitchPreview({ values }: { values: ControlValues }) {
  return (
    <div className="flex items-center gap-3">
      {/* key remounts so defaultChecked resets the switch on each control change */}
      <Switch
        key={String(values.defaultChecked)}
        defaultChecked={values.defaultChecked as boolean}
        disabled={values.disabled as boolean}
        id="switch-live"
      />
      <Label htmlFor="switch-live">Enable notifications</Label>
    </div>
  );
}

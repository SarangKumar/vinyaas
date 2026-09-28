"use client";

import { useState } from "react";

import { Label } from "@/registry/new-york/ui/label/label";
import { Switch } from "@/registry/new-york/ui/switch/switch";

export function ControlledSwitch() {
  const [checked, setChecked] = useState(true);

  return (
    <div className="flex items-center gap-3">
      <Switch
        id="controlled-alerts"
        checked={checked}
        onCheckedChange={setChecked}
      />
      <Label htmlFor="controlled-alerts">{checked ? "On" : "Off"}</Label>
    </div>
  );
}

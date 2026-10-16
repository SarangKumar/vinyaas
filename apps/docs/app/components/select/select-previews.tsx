"use client";

import type { ControlValues } from "@/components/component-demo";
import { Label } from "@/registry/new-york/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/new-york/ui/select";

export function SelectPreview({ values }: { values: ControlValues }) {
  return (
    <div className="grid w-full max-w-xs gap-2">
      <Label htmlFor="select-live">Theme</Label>
      <Select
        defaultOpen={values.defaultOpen as boolean}
        disabled={values.disabled as boolean}
      >
        <SelectTrigger id="select-live">
          <SelectValue placeholder="Select a theme" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="light">Light</SelectItem>
          <SelectItem value="dark">Dark</SelectItem>
          <SelectItem value="system">System</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

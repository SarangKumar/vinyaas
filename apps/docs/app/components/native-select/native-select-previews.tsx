"use client";

import type { ControlValues } from "@/components/component-demo";
import { Label } from "@/registry/new-york/ui/label";
import {
  NativeSelect,
  NativeSelectOptGroup,
  NativeSelectOption,
} from "@/registry/new-york/ui/native-select";

export function NativeSelectPreview({ values }: { values: ControlValues }) {
  const isMultiple = values.multiple as boolean;

  return (
    <div className="grid w-full max-w-xs gap-2">
      <Label htmlFor="native-live">Framework</Label>
      <NativeSelect
        key={String(isMultiple)}
        id="native-live"
        disabled={values.disabled as boolean}
        required={values.required as boolean}
        multiple={isMultiple}
        defaultValue={isMultiple ? ["next"] : "next"}
      >
        <NativeSelectOptGroup label="Front-end">
          <NativeSelectOption value="next">Next.js</NativeSelectOption>
          <NativeSelectOption value="remix">Remix</NativeSelectOption>
          <NativeSelectOption value="vue">Vue</NativeSelectOption>
        </NativeSelectOptGroup>
        <NativeSelectOptGroup label="Back-end">
          <NativeSelectOption value="express">Express</NativeSelectOption>
          <NativeSelectOption value="hono">Hono</NativeSelectOption>
        </NativeSelectOptGroup>
      </NativeSelect>
      {isMultiple && (
        <p className="text-muted-foreground text-xs">
          Hold ⌘ / Ctrl to select multiple options.
        </p>
      )}
    </div>
  );
}

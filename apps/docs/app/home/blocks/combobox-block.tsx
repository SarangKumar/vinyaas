"use client";

import { useState } from "react";

import { PlayBlock } from "@/app/home/play-block";
import {
  Combobox,
  ComboboxContent,
  ComboboxItem,
  ComboboxTrigger,
} from "@/registry/new-york/ui/combobox";
import { Label } from "@/registry/new-york/ui/label";

export function ComboboxBlock() {
  const [assignee, setAssignee] = useState<string | undefined>("maya");

  return (
    <PlayBlock
      title="Assignee"
      description="Search and assign an owner for the issue."
    >
      <div className="grid gap-2">
        <Label htmlFor="home-assignee">Assignee</Label>
        <Combobox value={assignee} onValueChange={setAssignee}>
          <ComboboxTrigger id="home-assignee" placeholder="Select assignee" />
          <ComboboxContent searchPlaceholder="Search people…">
            <ComboboxItem value="maya">Maya Chen</ComboboxItem>
            <ComboboxItem value="jordan">Jordan Lee</ComboboxItem>
            <ComboboxItem value="sam">Sam Rivera</ComboboxItem>
            <ComboboxItem value="alex">Alex Kim</ComboboxItem>
          </ComboboxContent>
        </Combobox>
      </div>
    </PlayBlock>
  );
}

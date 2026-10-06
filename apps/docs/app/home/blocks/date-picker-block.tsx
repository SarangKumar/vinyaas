"use client";

import { useState } from "react";

import { PlayBlock } from "@/app/home/play-block";
import { DatePicker } from "@/registry/new-york/ui/date-picker";
import { Label } from "@/registry/new-york/ui/label";

export function DatePickerBlock() {
  const [date, setDate] = useState<Date | undefined>();

  return (
    <PlayBlock
      title="Deadline"
      description="Set a project deadline from the calendar."
    >
      <div className="grid gap-2">
        <Label htmlFor="home-deadline">Project deadline</Label>
        <DatePicker
          id="home-deadline"
          value={date}
          onValueChange={setDate}
          placeholder="Pick a deadline"
        />
      </div>
    </PlayBlock>
  );
}

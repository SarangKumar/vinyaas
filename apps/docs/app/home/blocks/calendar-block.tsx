"use client";

import { useState } from "react";

import { PlayBlock } from "@/app/home/play-block";
import { Calendar } from "@/registry/new-york/ui/calendar";

export function CalendarBlock() {
  const [date, setDate] = useState<Date | undefined>(new Date(2026, 2, 12));

  return (
    <PlayBlock
      title="Schedule"
      description="Pick a meeting day on the calendar."
    >
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className="rounded-md border"
      />
    </PlayBlock>
  );
}

"use client";

import { useState } from "react";

import { Badge } from "@/registry/new-york/ui/badge";
import { Label } from "@/registry/new-york/ui/label";
import { Calendar } from "@/registry/new-york/ui/calendar";

export function BasicCalendarDemo() {
  const [date, setDate] = useState<Date | undefined>();

  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      className="rounded-md border"
    />
  );
}

export function SelectedDateDemo() {
  const [date, setDate] = useState<Date | undefined>(new Date(2026, 9, 15));

  return (
    <div className="grid w-full max-w-sm gap-2">
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        defaultMonth={date}
        className="rounded-md border"
      />
      {date ? (
        <p className="text-muted-foreground text-xs">
          Selected{" "}
          <span className="text-foreground font-medium">
            {date.toLocaleDateString(undefined, {
              weekday: "short",
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </p>
      ) : null}
    </div>
  );
}

export function DisabledDatesDemo() {
  const [date, setDate] = useState<Date | undefined>();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      disabled={{ before: today }}
      className="rounded-md border"
    />
  );
}

export function MonthNavigationDemo() {
  const [date, setDate] = useState<Date | undefined>(new Date(2026, 2, 12));

  return (
    <div className="grid w-full max-w-sm gap-2">
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        defaultMonth={new Date(2026, 2, 1)}
        className="rounded-md border"
      />
      <p className="text-muted-foreground text-xs">
        Use the previous and next controls in the caption to move between
        months. Pass <code className="text-foreground">defaultMonth</code> to
        open on a specific month.
      </p>
    </div>
  );
}

export function MeetingScheduleInPracticeDemo() {
  const [date, setDate] = useState<Date | undefined>();

  return (
    <form
      className="grid w-full max-w-md gap-4"
      onSubmit={(event) => event.preventDefault()}
    >
      <div className="grid gap-2">
        <Label>Meeting date</Label>
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          disabled={{ dayOfWeek: [0, 6] }}
          className="rounded-md border"
        />
        <p className="text-muted-foreground text-xs">
          Weekends are unavailable for this room.
        </p>
      </div>
      {date ? (
        <Badge variant="secondary" className="w-fit">
          {date.toLocaleDateString(undefined, {
            weekday: "long",
            month: "short",
            day: "numeric",
          })}
        </Badge>
      ) : null}
    </form>
  );
}

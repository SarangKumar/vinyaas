"use client";

import { useState } from "react";

import { Button } from "@/registry/new-york/ui/button";
import { DatePicker } from "@/registry/new-york/ui/date-picker";
import { Label } from "@/registry/new-york/ui/label";

export function BasicDatePickerDemo() {
  return <DatePicker className="w-full max-w-sm" aria-label="Pick a date" />;
}

export function ControlledDatePickerDemo() {
  const [date, setDate] = useState<Date | undefined>(new Date(2026, 9, 20));

  return (
    <div className="grid w-full max-w-sm gap-3">
      <DatePicker
        value={date}
        onValueChange={setDate}
        aria-label="Release date"
        className="w-full"
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="w-fit"
        onClick={() => setDate(undefined)}
      >
        Clear
      </Button>
    </div>
  );
}

export function DisabledDatePickerDemo() {
  return (
    <DatePicker
      disabled
      defaultValue={new Date(2026, 9, 1)}
      className="w-full max-w-sm"
      aria-label="Locked date"
    />
  );
}

export function DeadlineLabelDemo() {
  return (
    <div className="grid w-full max-w-sm gap-2">
      <Label htmlFor="project-deadline">Project deadline</Label>
      <DatePicker
        id="project-deadline"
        placeholder="Select deadline"
        disabledDates={{ before: new Date() }}
        className="w-full"
      />
    </div>
  );
}

export function DeploymentDateInPracticeDemo() {
  const [date, setDate] = useState<Date | undefined>();

  return (
    <form
      className="grid w-full max-w-md gap-4"
      onSubmit={(event) => event.preventDefault()}
    >
      <div className="grid gap-2">
        <Label htmlFor="deploy-date">Deployment date</Label>
        <DatePicker
          id="deploy-date"
          value={date}
          onValueChange={setDate}
          placeholder="Choose go-live date"
          formatString="EEEE, MMM d, yyyy"
          disabledDates={{ dayOfWeek: [0, 6] }}
          className="w-full"
        />
        <p className="text-muted-foreground text-sm leading-6">
          Production deploys run on weekdays only.
        </p>
      </div>
      <Button type="submit" disabled={!date}>
        Schedule deploy
      </Button>
    </form>
  );
}

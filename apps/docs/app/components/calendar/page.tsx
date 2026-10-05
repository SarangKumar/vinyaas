import { readFile } from "node:fs/promises";
import path from "node:path";
import type { ApiRow } from "@/components/api-table";
import type {
  ComponentExample,
  ComponentInPractice,
} from "@/components/component-reference";
import { ComponentReference } from "@/components/component-reference";
import { Calendar } from "@/registry/new-york/ui/calendar";
import type { Metadata } from "next";
import { componentPageMetadata } from "@/lib/page-metadata";

import {
  BasicCalendarDemo,
  DisabledDatesDemo,
  MeetingScheduleInPracticeDemo,
  MonthNavigationDemo,
  SelectedDateDemo,
} from "./calendar-demos";

export const metadata: Metadata = componentPageMetadata("calendar");

const usage = `import { useState } from "react";

import { Calendar } from "@/components/ui/calendar";

export function PickDate() {
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
`;

const inPracticeSource = `import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";

export function ScheduleMeeting() {
  const [date, setDate] = useState<Date | undefined>();

  return (
    <form className="grid max-w-md gap-4">
      <div className="grid gap-2">
        <Label>Meeting date</Label>
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          disabled={{ dayOfWeek: [0, 6] }}
          className="rounded-md border"
        />
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
`;

const api: ApiRow[] = [
  {
    prop: "mode",
    type: '"single" | "multiple" | "range"',
    description:
      "Selection mode forwarded to DayPicker. Use single for one date.",
  },
  {
    prop: "selected",
    type: "Date | Date[] | DateRange",
    description: "The selected date or dates for the active mode.",
  },
  {
    prop: "onSelect",
    type: "(date) => void",
    description: "Called when the user selects or clears a date.",
  },
  {
    prop: "disabled",
    type: "Matcher | Matcher[]",
    description:
      "Dates or rules that cannot be selected (for example before today).",
  },
  {
    prop: "defaultMonth",
    type: "Date",
    description: "Month shown on first render when no month is selected.",
  },
  {
    prop: "showOutsideDays",
    type: "boolean",
    defaultValue: "true",
    description: "Whether days from adjacent months appear in the grid.",
  },
  {
    prop: "className / classNames",
    type: "string / object",
    description: "Extra classes on the root or individual DayPicker parts.",
  },
];

const examples: ComponentExample[] = [
  {
    id: "basic",
    title: "Basic",
    description: "Single-date selection with controlled state.",
    preview: <BasicCalendarDemo />,
    code: `const [date, setDate] = useState<Date | undefined>();

<Calendar
  mode="single"
  selected={date}
  onSelect={setDate}
  className="rounded-md border"
/>`,
  },
  {
    id: "selected",
    title: "Selected date",
    description: "Open the grid on a month that includes the current value.",
    preview: <SelectedDateDemo />,
    code: `const [date, setDate] = useState<Date | undefined>(
  new Date(2026, 9, 15),
);

<Calendar
  mode="single"
  selected={date}
  onSelect={setDate}
  defaultMonth={date}
  className="rounded-md border"
/>`,
  },
  {
    id: "disabled",
    title: "Disabled dates",
    description: "Matchers prevent choosing past days.",
    preview: <DisabledDatesDemo />,
    code: `<Calendar
  mode="single"
  selected={date}
  onSelect={setDate}
  disabled={{ before: today }}
  className="rounded-md border"
/>`,
  },
  {
    id: "month-navigation",
    title: "Month navigation",
    description:
      "Caption buttons move between months. Set defaultMonth for a fixed starting view.",
    preview: <MonthNavigationDemo />,
    code: `<Calendar
  mode="single"
  selected={date}
  onSelect={setDate}
  defaultMonth={new Date(2026, 2, 1)}
  className="rounded-md border"
/>`,
  },
];

const inPractice: ComponentInPractice = {
  description:
    "Embed Calendar in a scheduling form. Disable weekends or blackout dates with matchers.",
  preview: <MeetingScheduleInPracticeDemo />,
  code: inPracticeSource,
};

export default async function CalendarPage() {
  const source = await readFile(
    path.join(process.cwd(), "registry/new-york/ui/calendar/index.tsx"),
    "utf8",
  );

  return (
    <ComponentReference
      title="Calendar"
      description="An accessible month calendar for selecting dates."
      overview={
        <>
          <p>
            Calendar wraps react-day-picker with Vinyaas styling. It owns the
            month grid, keyboard navigation, and caption controls. Pair it with{" "}
            <a href="/components/date-picker" className="underline">
              Date Picker
            </a>{" "}
            when you need a compact trigger and popover.
          </p>
          <p>
            Install adds <code>react-day-picker</code> and <code>date-fns</code>{" "}
            as dependencies.
          </p>
        </>
      }
      install="vinyaas add calendar"
      usage={usage}
      examples={examples}
      inPractice={inPractice}
      api={api}
      accessibility={
        <>
          <p>
            DayPicker renders a semantic grid with labeled navigation buttons.
            Arrow keys move focus between days; Enter and Space select the
            focused day.
          </p>
          <p>
            Disabled days are omitted from selection and exposed as unavailable
            in the grid. When Calendar sits inside a form, associate it with{" "}
            <code>Label</code> via <code>id</code> on the root or describe the
            chosen date in nearby helper text.
          </p>
        </>
      }
      source={source}
    >
      <Calendar mode="single" className="rounded-md border" />
    </ComponentReference>
  );
}

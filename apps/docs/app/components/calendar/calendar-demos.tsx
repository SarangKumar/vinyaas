"use client";

import { useState } from "react";
import type { DateRange } from "react-day-picker";

import {
  ComponentDemo,
  type ControlDef,
  type ControlValues,
} from "@/components/component-demo";
import { Badge } from "@/registry/new-york/ui/badge";
import { Label } from "@/registry/new-york/ui/label";
import { Calendar, type CalendarProps } from "@/registry/new-york/ui/calendar";

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
    <div className="flex w-full max-w-sm flex-col items-center gap-3">
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        defaultMonth={date}
        className="rounded-md border"
      />
      {date ? (
        <p className="text-muted-foreground text-center text-sm leading-6">
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
    <div className="flex w-full max-w-sm flex-col items-center gap-3">
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        defaultMonth={new Date(2026, 2, 1)}
        className="rounded-md border"
      />
      <p className="text-muted-foreground text-sm leading-6">
        Use the previous/next buttons or the month and year selects to move
        between months. Pass{" "}
        <code className="text-foreground">defaultMonth</code> to open on a
        specific month.
      </p>
    </div>
  );
}

export function MultipleCalendarDemo() {
  const [dates, setDates] = useState<Date[] | undefined>();

  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-3">
      <Calendar
        mode="multiple"
        selected={dates}
        onSelect={setDates}
        className="rounded-md border"
      />
      <p className="text-muted-foreground text-sm leading-6">
        {dates && dates.length > 0
          ? `${dates.length} date${dates.length === 1 ? "" : "s"} selected`
          : "No dates selected"}
      </p>
    </div>
  );
}

export function RangeCalendarDemo() {
  const [range, setRange] = useState<DateRange | undefined>({
    from: new Date(2026, 2, 10),
    to: new Date(2026, 2, 16),
  });

  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-3">
      <Calendar
        mode="range"
        selected={range}
        onSelect={setRange}
        defaultMonth={new Date(2026, 2, 1)}
        numberOfMonths={1}
        className="rounded-md border"
      />
      {range?.from ? (
        <p className="text-muted-foreground text-sm leading-6">
          {range.to
            ? `${range.from.toLocaleDateString()} – ${range.to.toLocaleDateString()}`
            : `Starting ${range.from.toLocaleDateString()}`}
        </p>
      ) : null}
    </div>
  );
}

export function MeetingScheduleInPracticeDemo() {
  const [date, setDate] = useState<Date | undefined>();

  return (
    <form
      className="flex w-full max-w-md flex-col items-center gap-4"
      onSubmit={(event) => event.preventDefault()}
    >
      <div className="flex w-full flex-col items-center gap-2">
        <Label className="self-start">Meeting date</Label>
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          disabled={{ dayOfWeek: [0, 6] }}
          className="rounded-md border"
        />
        <p className="text-muted-foreground text-sm leading-6">
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

/* ── Interactive demo (used with the Customize panel) ─────────────────────── */

const calendarControls: ControlDef[] = [
  {
    key: "mode",
    label: "Mode",
    type: "select",
    default: "single",
    options: [
      { value: "single", label: "Single" },
      { value: "multiple", label: "Multiple" },
      { value: "range", label: "Range" },
    ],
  },
  {
    key: "captionLayout",
    label: "Caption Layout",
    type: "select",
    default: "dropdown",
    options: [
      { value: "dropdown", label: "Dropdown" },
      { value: "label", label: "Label" },
      { value: "dropdown-months", label: "Dropdown Months" },
      { value: "dropdown-years", label: "Dropdown Years" },
    ],
  },
  {
    key: "numberOfMonths",
    label: "Months",
    type: "range",
    default: 1,
    min: 1,
    max: 2,
  },
  {
    key: "showOutsideDays",
    label: "Show Outside Days",
    type: "toggle",
    default: true,
  },
  {
    key: "showWeekNumber",
    label: "Show Week Number",
    type: "toggle",
    default: false,
  },
  { key: "fixedWeeks", label: "Fixed Weeks", type: "toggle", default: false },
  {
    key: "disablePast",
    label: "Disable Past Dates",
    type: "toggle",
    default: false,
  },
];

/** Shared by the preview and the snippet so both describe the same calendar. */
function calendarShared(values: ControlValues) {
  return {
    captionLayout: values.captionLayout as CalendarProps["captionLayout"],
    numberOfMonths: values.numberOfMonths as number,
    showOutsideDays: values.showOutsideDays as boolean,
    showWeekNumber: values.showWeekNumber as boolean,
    fixedWeeks: values.fixedWeeks as boolean,
  };
}

function CalendarInteractivePreview(values: ControlValues) {
  // One state slot per mode: DayPicker types the selection per mode, and
  // switching modes should not carry a stale shape across.
  const [single, setSingle] = useState<Date | undefined>();
  const [multiple, setMultiple] = useState<Date[] | undefined>();
  const [range, setRange] = useState<DateRange | undefined>();
  const shared = calendarShared(values);
  const disabled = values.disablePast ? { before: new Date() } : undefined;

  if (values.mode === "multiple") {
    return (
      <Calendar
        {...shared}
        mode="multiple"
        selected={multiple}
        onSelect={setMultiple}
        disabled={disabled}
        className="rounded-md border"
      />
    );
  }

  if (values.mode === "range") {
    return (
      <Calendar
        {...shared}
        mode="range"
        selected={range}
        onSelect={setRange}
        disabled={disabled}
        className="rounded-md border"
      />
    );
  }

  return (
    <Calendar
      {...shared}
      mode="single"
      selected={single}
      onSelect={setSingle}
      disabled={disabled}
      className="rounded-md border"
    />
  );
}

const selectionTypes: Record<string, string> = {
  single: "Date | undefined",
  multiple: "Date[] | undefined",
  range: "DateRange | undefined",
};

function calendarCode(values: ControlValues): string {
  const mode = values.mode as string;
  const props = [
    `  mode="${mode}"`,
    values.captionLayout === "dropdown"
      ? null
      : `  captionLayout="${values.captionLayout}"`,
    values.numberOfMonths === 1
      ? null
      : `  numberOfMonths={${values.numberOfMonths}}`,
    values.showOutsideDays ? null : `  showOutsideDays={false}`,
    values.showWeekNumber ? `  showWeekNumber` : null,
    values.fixedWeeks ? `  fixedWeeks` : null,
    `  selected={selected}`,
    `  onSelect={setSelected}`,
    values.disablePast ? `  disabled={{ before: new Date() }}` : null,
    `  className="rounded-md border"`,
  ].filter(Boolean);

  const rangeImport =
    mode === "range"
      ? `import type { DateRange } from "react-day-picker";\n`
      : "";

  return `"use client";
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
${rangeImport}
export function Demo() {
  const [selected, setSelected] = useState<${selectionTypes[mode]}>();

  return (
    <Calendar
${props.map((line) => `  ${line}`).join("\n")}
    />
  );
}`;
}

/** Keeps the controls and the snippet generator on the client. */
export function CalendarInteractiveSection() {
  return (
    <ComponentDemo
      preview={CalendarInteractivePreview}
      code={calendarCode}
      controls={calendarControls}
    />
  );
}

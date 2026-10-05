import { readFile } from "node:fs/promises";
import path from "node:path";
import type { ApiRow } from "@/components/api-table";
import type {
  ComponentExample,
  ComponentInPractice,
} from "@/components/component-reference";
import { ComponentReference } from "@/components/component-reference";
import { DatePicker } from "@/registry/new-york/ui/date-picker";
import type { Metadata } from "next";
import { componentPageMetadata } from "@/lib/page-metadata";

import {
  BasicDatePickerDemo,
  ControlledDatePickerDemo,
  DeadlineLabelDemo,
  DeploymentDateInPracticeDemo,
  DisabledDatePickerDemo,
} from "./date-picker-demos";

export const metadata: Metadata = componentPageMetadata("date-picker");

const usage = `import { DatePicker } from "@/components/ui/date-picker";

export function DueDateField() {
  return (
    <DatePicker
      className="w-full max-w-sm"
      placeholder="Pick a date"
      aria-label="Due date"
    />
  );
}
`;

const inPracticeSource = `import { useState } from "react";

import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { Label } from "@/components/ui/label";

export function ScheduleDeploy() {
  const [date, setDate] = useState<Date | undefined>();

  return (
    <form className="grid max-w-md gap-4">
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
      </div>
      <Button type="submit" disabled={!date}>
        Schedule deploy
      </Button>
    </form>
  );
}
`;

const api: ApiRow[] = [
  {
    prop: "value",
    type: "Date",
    description: "Controlled selected date. Use with onValueChange.",
  },
  {
    prop: "defaultValue",
    type: "Date",
    description: "Initial date for an uncontrolled DatePicker.",
  },
  {
    prop: "onValueChange",
    type: "(date: Date | undefined) => void",
    description: "Called when the user selects or clears a date.",
  },
  {
    prop: "placeholder",
    type: "string",
    defaultValue: '"Pick a date"',
    description: "Trigger label when no date is selected.",
  },
  {
    prop: "formatString",
    type: "string",
    defaultValue: '"PPP"',
    description: "date-fns format for the trigger when a date is selected.",
  },
  {
    prop: "disabled",
    type: "boolean",
    description: "Disables the trigger and prevents opening the popover.",
  },
  {
    prop: "disabledDates",
    type: "Matcher | Matcher[]",
    description:
      "Forwarded to Calendar disabled — unavailable days in the grid.",
  },
  {
    prop: "open / defaultOpen / onOpenChange",
    type: "boolean",
    description: "Control when the calendar popover is open.",
  },
  {
    prop: "id / className / aria-label",
    type: "string",
    description: "Passed to the trigger button for forms and accessibility.",
  },
];

const examples: ComponentExample[] = [
  {
    id: "basic",
    title: "Basic",
    description: "Outline button opens a single-date calendar popover.",
    preview: <BasicDatePickerDemo />,
    code: `<DatePicker
  className="w-full max-w-sm"
  aria-label="Pick a date"
/>`,
  },
  {
    id: "controlled",
    title: "Controlled",
    description: "Drive the value from React state for forms and resets.",
    preview: <ControlledDatePickerDemo />,
    code: `const [date, setDate] = useState<Date | undefined>();

<DatePicker
  value={date}
  onValueChange={setDate}
  aria-label="Release date"
  className="w-full max-w-sm"
/>`,
  },
  {
    id: "disabled",
    title: "Disabled",
    description: "A fixed date with interaction turned off.",
    preview: <DisabledDatePickerDemo />,
    code: `<DatePicker
  disabled
  defaultValue={new Date(2026, 9, 1)}
  className="w-full max-w-sm"
  aria-label="Locked date"
/>`,
  },
  {
    id: "with-label",
    title: "With label",
    description:
      "Pair Label and id for deadline fields with future-only dates.",
    preview: <DeadlineLabelDemo />,
    code: `<Label htmlFor="project-deadline">Project deadline</Label>
<DatePicker
  id="project-deadline"
  placeholder="Select deadline"
  disabledDates={{ before: new Date() }}
  className="w-full max-w-sm"
/>`,
  },
];

const inPractice: ComponentInPractice = {
  description:
    "Choose a deployment date with weekday-only matchers and a long formatted label.",
  preview: <DeploymentDateInPracticeDemo />,
  code: inPracticeSource,
};

export default async function DatePickerPage() {
  const source = await readFile(
    path.join(process.cwd(), "registry/new-york/ui/date-picker/index.tsx"),
    "utf8",
  );

  return (
    <ComponentReference
      title="Date Picker"
      description="A calendar popover for choosing a single date."
      overview={
        <>
          <p>
            Date Picker composes Button, Popover, and Calendar into one field.
            Selecting a day closes the popover and updates the trigger label.
          </p>
          <p>
            Run <code>vinyaas add date-picker</code> to install Calendar and
            Popover dependencies together.
          </p>
        </>
      }
      install="vinyaas add date-picker"
      usage={usage}
      examples={examples}
      inPractice={inPractice}
      api={api}
      accessibility={
        <>
          <p>
            The trigger is a button with an accessible name from{" "}
            <code>aria-label</code> or the formatted selection. When empty, the
            placeholder becomes the name unless you override it.
          </p>
          <p>
            Focus moves into the calendar when the popover opens. Escape closes
            the popover and returns focus to the trigger. Link visible labels
            with <code>htmlFor</code> and <code>id</code>.
          </p>
        </>
      }
      source={source}
    >
      <DatePicker aria-label="Pick a date" className="w-full max-w-xs" />
    </ComponentReference>
  );
}

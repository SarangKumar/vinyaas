"use client";

import { useState } from "react";

import { Badge } from "@/registry/new-york/ui/badge";
import {
  Combobox,
  ComboboxContent,
  ComboboxItem,
  ComboboxTrigger,
} from "@/registry/new-york/ui/combobox";

export function BasicComboboxDemo() {
  return (
    <Combobox defaultValue="docs">
      <ComboboxTrigger
        className="w-full max-w-sm"
        aria-label="Page"
        placeholder="Select a page"
      />
      <ComboboxContent>
        <ComboboxItem value="docs">Documentation</ComboboxItem>
        <ComboboxItem value="components">Components</ComboboxItem>
        <ComboboxItem value="themes">Themes</ComboboxItem>
      </ComboboxContent>
    </Combobox>
  );
}

export function FrameworkSearchDemo() {
  return (
    <Combobox>
      <ComboboxTrigger
        className="w-full max-w-sm"
        aria-label="Framework"
        placeholder="Select framework"
      />
      <ComboboxContent searchPlaceholder="Search frameworks…">
        <ComboboxItem value="next" keywords={["nextjs"]}>
          Next.js
        </ComboboxItem>
        <ComboboxItem value="react">React</ComboboxItem>
        <ComboboxItem value="vite">Vite</ComboboxItem>
        <ComboboxItem value="remix">Remix</ComboboxItem>
      </ComboboxContent>
    </Combobox>
  );
}

export function DisabledOptionsDemo() {
  return (
    <Combobox defaultValue="ada">
      <ComboboxTrigger
        className="w-full max-w-sm"
        aria-label="Assignee"
        placeholder="Select assignee"
      />
      <ComboboxContent searchPlaceholder="Search teammates…">
        <ComboboxItem value="ada">Ada Lovelace</ComboboxItem>
        <ComboboxItem value="grace" disabled>
          Grace Hopper (away)
        </ComboboxItem>
        <ComboboxItem value="alan">Alan Turing</ComboboxItem>
      </ComboboxContent>
    </Combobox>
  );
}

export function AssigneeDashboardDemo() {
  const [assignee, setAssignee] = useState<string | undefined>("ada");

  return (
    <div className="border-border flex w-full max-w-md flex-wrap items-center justify-between gap-3 rounded-xl border p-3">
      <div className="min-w-0">
        <p className="text-sm font-medium">Open tasks</p>
        <p className="text-muted-foreground text-xs">
          {assignee ? `Filtered by assignee` : "All teammates"}
        </p>
      </div>
      <Combobox value={assignee} onValueChange={setAssignee}>
        <ComboboxTrigger
          className="w-40"
          aria-label="Assignee"
          placeholder="Assignee"
        />
        <ComboboxContent
          searchPlaceholder="Search…"
          emptyMessage="No teammates match your search."
        >
          <ComboboxItem value="ada">Ada</ComboboxItem>
          <ComboboxItem value="grace">Grace</ComboboxItem>
          <ComboboxItem value="alan">Alan</ComboboxItem>
        </ComboboxContent>
      </Combobox>
      {assignee ? (
        <Badge variant="secondary" className="w-full sm:w-auto">
          {assignee}
        </Badge>
      ) : null}
    </div>
  );
}

export function AssigneeInPracticeDemo() {
  return (
    <Combobox defaultValue="ada">
      <ComboboxTrigger
        className="w-full max-w-md"
        aria-label="Assignee"
        placeholder="Assignee"
      />
      <ComboboxContent searchPlaceholder="Search teammates…">
        <ComboboxItem value="ada">Ada Lovelace</ComboboxItem>
        <ComboboxItem value="grace">Grace Hopper</ComboboxItem>
        <ComboboxItem value="alan">Alan Turing</ComboboxItem>
      </ComboboxContent>
    </Combobox>
  );
}

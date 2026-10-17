"use client";

import { useState } from "react";

import {
  ComponentDemo,
  type ControlDef,
  type ControlValues,
} from "@/components/component-demo";
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

/* ── Interactive demo (used with the Customize panel) ─────────────────────── */

const frameworks = [
  { value: "next", label: "Next.js" },
  { value: "remix", label: "Remix" },
  { value: "astro", label: "Astro" },
  { value: "vite", label: "Vite" },
  { value: "nuxt", label: "Nuxt" },
];

const comboboxControls: ControlDef[] = [
  {
    key: "align",
    label: "Align",
    type: "select",
    default: "start",
    options: [
      { value: "start", label: "Start" },
      { value: "center", label: "Center" },
      { value: "end", label: "End" },
    ],
  },
  {
    key: "placeholder",
    label: "Placeholder",
    type: "text",
    default: "Select a framework…",
  },
  {
    key: "searchPlaceholder",
    label: "Search Placeholder",
    type: "text",
    default: "Search frameworks…",
  },
  {
    key: "emptyMessage",
    label: "Empty Message",
    type: "text",
    default: "No framework found.",
  },
  {
    key: "preselected",
    label: "Preselected",
    type: "select",
    default: "none",
    options: [
      { value: "none", label: "None" },
      ...frameworks.map((framework) => ({
        value: framework.value,
        label: framework.label,
      })),
    ],
  },
  {
    key: "disableOption",
    label: "Disable Astro",
    type: "toggle",
    default: false,
  },
  { key: "disabled", label: "Disabled", type: "toggle", default: false },
];

function ComboboxInteractivePreview(values: ControlValues) {
  const preselected = values.preselected as string;

  return (
    <Combobox
      // Remount when the starting value changes so the uncontrolled default
      // is picked up instead of being frozen at first render.
      key={preselected}
      defaultValue={preselected === "none" ? undefined : preselected}
      disabled={values.disabled as boolean}
    >
      <ComboboxTrigger
        className="w-full max-w-sm"
        aria-label="Framework"
        placeholder={values.placeholder as string}
      />
      <ComboboxContent
        align={values.align as "start" | "center" | "end"}
        searchPlaceholder={values.searchPlaceholder as string}
        emptyMessage={values.emptyMessage as string}
      >
        {frameworks.map((framework) => (
          <ComboboxItem
            key={framework.value}
            value={framework.value}
            disabled={
              (values.disableOption as boolean) && framework.value === "astro"
            }
          >
            {framework.label}
          </ComboboxItem>
        ))}
      </ComboboxContent>
    </Combobox>
  );
}

function comboboxCode(values: ControlValues): string {
  const preselected = values.preselected as string;
  const rootProps = [
    preselected === "none" ? null : ` defaultValue="${preselected}"`,
    values.disabled ? " disabled" : null,
  ]
    .filter(Boolean)
    .join("");

  const contentProps = [
    values.align === "start" ? null : `\n    align="${values.align}"`,
    `\n    searchPlaceholder="${values.searchPlaceholder}"`,
    `\n    emptyMessage="${values.emptyMessage}"`,
  ]
    .filter(Boolean)
    .join("");

  const items = frameworks
    .map((framework) => {
      const disabled =
        (values.disableOption as boolean) && framework.value === "astro"
          ? " disabled"
          : "";

      return `    <ComboboxItem value="${framework.value}"${disabled}>${framework.label}</ComboboxItem>`;
    })
    .join("\n");

  return `import {
  Combobox,
  ComboboxContent,
  ComboboxItem,
  ComboboxTrigger,
} from "@/components/ui/combobox";

<Combobox${rootProps}>
  <ComboboxTrigger
    className="w-full max-w-sm"
    aria-label="Framework"
    placeholder="${values.placeholder}"
  />
  <ComboboxContent${contentProps}
  >
${items}
  </ComboboxContent>
</Combobox>`;
}

/** Keeps the controls and the snippet generator on the client. */
export function ComboboxInteractiveSection() {
  return (
    <ComponentDemo
      preview={ComboboxInteractivePreview}
      code={comboboxCode}
      controls={comboboxControls}
    />
  );
}

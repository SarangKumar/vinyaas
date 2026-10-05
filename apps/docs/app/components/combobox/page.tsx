import { readFile } from "node:fs/promises";
import path from "node:path";
import type { ApiRow } from "@/components/api-table";
import type {
  ComponentExample,
  ComponentInPractice,
} from "@/components/component-reference";
import { ComponentReference } from "@/components/component-reference";
import {
  Combobox,
  ComboboxContent,
  ComboboxItem,
  ComboboxTrigger,
} from "@/registry/new-york/ui/combobox";
import type { Metadata } from "next";
import { componentPageMetadata } from "@/lib/page-metadata";

import {
  AssigneeDashboardDemo,
  AssigneeInPracticeDemo,
  BasicComboboxDemo,
  DisabledOptionsDemo,
  FrameworkSearchDemo,
} from "./combobox-demos";

export const metadata: Metadata = componentPageMetadata("combobox");

const usage = `import {
  Combobox,
  ComboboxContent,
  ComboboxItem,
  ComboboxTrigger,
} from "@/components/ui/combobox";

export function FrameworkField() {
  return (
    <Combobox>
      <ComboboxTrigger aria-label="Framework" placeholder="Select framework" />
      <ComboboxContent searchPlaceholder="Search frameworks…">
        <ComboboxItem value="next">Next.js</ComboboxItem>
        <ComboboxItem value="react">React</ComboboxItem>
      </ComboboxContent>
    </Combobox>
  );
}
`;

const inPracticeSource = `import {
  Combobox,
  ComboboxContent,
  ComboboxItem,
  ComboboxTrigger,
} from "@/components/ui/combobox";

export function AssigneeFilter() {
  return (
    <Combobox defaultValue="ada">
      <ComboboxTrigger
        className="w-44"
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
`;

const api: ApiRow[] = [
  {
    prop: "value / defaultValue",
    type: "string",
    description: "Selected option value for controlled or uncontrolled use.",
  },
  {
    prop: "onValueChange",
    type: "(value: string | undefined) => void",
    description:
      "Called when the user selects an option. Selecting again clears the value.",
  },
  {
    prop: "open / defaultOpen / onOpenChange",
    type: "boolean",
    description: "Control the popover open state.",
  },
  {
    prop: "disabled",
    type: "boolean",
    description: "Disables the Combobox trigger.",
  },
  {
    prop: "ComboboxTrigger placeholder",
    type: "string",
    description: "Shown when no value is selected.",
  },
  {
    prop: "ComboboxContent searchPlaceholder / emptyMessage",
    type: "string",
    description: "Copy for the filter field and the no-results row.",
  },
  {
    prop: "ComboboxItem keywords",
    type: "string[]",
    description: "Extra terms included when filtering options.",
  },
  {
    prop: "ComboboxItem disabled",
    type: "boolean",
    description: "Prevents selecting that option.",
  },
];

const examples: ComponentExample[] = [
  {
    id: "basic",
    title: "Basic",
    description: "Composable trigger and list with a default selection.",
    preview: <BasicComboboxDemo />,
    code: `<Combobox defaultValue="docs">
  <ComboboxTrigger aria-label="Page" placeholder="Select a page" />
  <ComboboxContent>
    <ComboboxItem value="docs">Documentation</ComboboxItem>
    <ComboboxItem value="components">Components</ComboboxItem>
  </ComboboxContent>
</Combobox>`,
  },
  {
    id: "search",
    title: "Search",
    description: "Typing filters options while the popover is open.",
    preview: <FrameworkSearchDemo />,
    code: `<Combobox>
  <ComboboxTrigger aria-label="Framework" placeholder="Select framework" />
  <ComboboxContent searchPlaceholder="Search frameworks…">
    <ComboboxItem value="next" keywords={["nextjs"]}>
      Next.js
    </ComboboxItem>
    <ComboboxItem value="react">React</ComboboxItem>
  </ComboboxContent>
</Combobox>`,
  },
  {
    id: "disabled-options",
    title: "Disabled options",
    description:
      "Individual items can be unavailable without disabling the field.",
    preview: <DisabledOptionsDemo />,
    code: `<ComboboxItem value="grace" disabled>
  Grace Hopper (away)
</ComboboxItem>`,
  },
  {
    id: "assignee-filter",
    title: "Empty results / dashboard filter",
    description:
      "Compact assignee control for boards. Customize emptyMessage when search finds no matches.",
    preview: <AssigneeDashboardDemo />,
    code: `<Combobox value={assignee} onValueChange={setAssignee}>
  <ComboboxTrigger className="w-40" aria-label="Assignee" />
  <ComboboxContent
    searchPlaceholder="Search…"
    emptyMessage="No teammates match your search."
  >
    <ComboboxItem value="ada">Ada</ComboboxItem>
  </ComboboxContent>
</Combobox>`,
  },
];

const inPractice: ComponentInPractice = {
  description:
    "Filter a task board by assignee or search a long framework list without leaving the page.",
  preview: <AssigneeInPracticeDemo />,
  code: inPracticeSource,
};

export default async function ComboboxPage() {
  const source = await readFile(
    path.join(process.cwd(), "registry/new-york/ui/combobox/index.tsx"),
    "utf8",
  );

  return (
    <ComponentReference
      title="Combobox"
      description="A searchable control for filtering and choosing options."
      overview={
        <>
          <p>
            Combobox combines Popover and Command so users can type to filter
            while the list is open. Use{" "}
            <a href="/components/select" className="underline">
              Select
            </a>{" "}
            for conventional dropdowns; reach for Combobox when search is the
            primary interaction.
          </p>
        </>
      }
      install="vinyaas add combobox"
      usage={usage}
      examples={examples}
      inPractice={inPractice}
      api={api}
      accessibility={
        <>
          <p>
            The trigger exposes <code>role=&quot;combobox&quot;</code> with{" "}
            <code>aria-expanded</code> and{" "}
            <code>aria-haspopup=&quot;listbox&quot;</code>. Options render as
            list items with <code>aria-selected</code> when active.
          </p>
          <p>
            The search field receives focus when the popover opens. Arrow keys
            move between options; Enter selects. Escape closes the popover and
            returns focus to the trigger.
          </p>
        </>
      }
      source={source}
    >
      <Combobox defaultValue="react">
        <ComboboxTrigger
          className="w-full max-w-xs"
          aria-label="Framework"
          placeholder="Framework"
        />
        <ComboboxContent>
          <ComboboxItem value="react">React</ComboboxItem>
          <ComboboxItem value="next">Next.js</ComboboxItem>
        </ComboboxContent>
      </Combobox>
    </ComponentReference>
  );
}

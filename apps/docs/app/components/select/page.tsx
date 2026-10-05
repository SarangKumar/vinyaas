import { readFile } from "node:fs/promises";
import path from "node:path";
import type { ApiRow } from "@/components/api-table";
import type {
  ComponentExample,
  ComponentInPractice,
} from "@/components/component-reference";
import { ComponentReference } from "@/components/component-reference";
import type { Metadata } from "next";
import { componentPageMetadata } from "@/lib/page-metadata";

import {
  BasicSelectDemo,
  ChangelogStyleSelectDemo,
  DashboardFilterDemo,
  DisabledSelectDemo,
  FormSelectDemo,
  GroupedTimezoneDemo,
  LongListSelectDemo,
  SearchableSelectDemo,
} from "./select-demos";

export const metadata: Metadata = componentPageMetadata("select");

const usage = `import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function PageField() {
  return (
    <Select defaultValue="docs">
      <SelectTrigger aria-label="Page">
        <SelectValue placeholder="Select a page" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="docs">Documentation</SelectItem>
        <SelectItem value="components">Components</SelectItem>
      </SelectContent>
    </Select>
  );
}
`;

const inPracticeSource = `import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function WorkspacePreferences() {
  return (
    <form className="grid w-full max-w-md gap-4">
      <div className="grid gap-2">
        <Label htmlFor="locale">Language</Label>
        <Select name="locale" defaultValue="en-US">
          <SelectTrigger id="locale">
            <SelectValue placeholder="Choose a language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en-US">English (United States)</SelectItem>
            <SelectItem value="hi-IN">Hindi (India)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="timezone">Timezone</Label>
        <Select searchable name="timezone" defaultValue="America/Los_Angeles">
          <SelectTrigger id="timezone">
            <SelectValue placeholder="Select a timezone" />
          </SelectTrigger>
          <SelectContent searchPlaceholder="Search timezones">
            <SelectGroup>
              <SelectLabel>Americas</SelectLabel>
              <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
              <SelectItem value="America/New_York">Eastern Time</SelectItem>
            </SelectGroup>
            <SelectGroup>
              <SelectLabel>Asia</SelectLabel>
              <SelectItem value="Asia/Kolkata">India Standard Time</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </form>
  );
}
`;

const api: ApiRow[] = [
  {
    prop: "value",
    type: "string",
    description: "Controlled selected value. Use with onValueChange.",
  },
  {
    prop: "defaultValue",
    type: "string",
    description: "Initial value for an uncontrolled Select.",
  },
  {
    prop: "onValueChange",
    type: "(value: string) => void",
    description: "Called when the user selects an option.",
  },
  {
    prop: "searchable",
    type: "boolean",
    description:
      "When true, shows a built-in search field and filters options. Off by default.",
  },
  {
    prop: "open / onOpenChange",
    type: "boolean",
    description: "Control the dropdown open state.",
  },
  {
    prop: "disabled",
    type: "boolean",
    description: "Prevents opening and selection.",
  },
  {
    prop: "name",
    type: "string",
    description: "Optional hidden input name for form submission.",
  },
  {
    prop: "SelectContent searchPlaceholder",
    type: "string",
    description: "Placeholder for the search field when searchable is set.",
  },
];

const examples: ComponentExample[] = [
  {
    id: "basic",
    title: "Basic",
    description:
      "Default Select without search — behaves like a conventional picker.",
    preview: <BasicSelectDemo />,
    code: `<Select defaultValue="docs">
  <SelectTrigger className="w-full max-w-sm" aria-label="Page">
    <SelectValue placeholder="Select a page" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="docs">Documentation</SelectItem>
    <SelectItem value="components">Components</SelectItem>
  </SelectContent>
</Select>`,
  },
  {
    id: "searchable",
    title: "Searchable",
    description: "Pass searchable to enable built-in filtering.",
    preview: <SearchableSelectDemo />,
    code: `<Select searchable defaultValue="react">
  <SelectTrigger aria-label="Framework">
    <SelectValue placeholder="Select a framework" />
  </SelectTrigger>
  <SelectContent searchPlaceholder="Search frameworks…">
    <SelectItem value="next">Next.js</SelectItem>
    <SelectItem value="react">React</SelectItem>
    <SelectItem value="vite">Vite</SelectItem>
  </SelectContent>
</Select>`,
  },
  {
    id: "grouped",
    title: "Grouped searchable",
    description:
      "Timezone-style groups. Matching options keep their group labels; empty groups hide.",
    preview: <GroupedTimezoneDemo />,
    code: `<Select searchable defaultValue="est">
  <SelectTrigger aria-label="Timezone">
    <SelectValue placeholder="Select a timezone" />
  </SelectTrigger>
  <SelectContent searchPlaceholder="Search timezones">
    <SelectGroup>
      <SelectLabel>North America</SelectLabel>
      <SelectItem value="est">Eastern Standard Time (EST)</SelectItem>
    </SelectGroup>
    <SelectGroup>
      <SelectLabel>Asia</SelectLabel>
      <SelectItem value="ist">India Standard Time (IST)</SelectItem>
    </SelectGroup>
  </SelectContent>
</Select>`,
  },
  {
    id: "version",
    title: "Version selector",
    description: "Compact searchable selector for long version lists.",
    preview: <ChangelogStyleSelectDemo />,
    code: `<Select searchable defaultValue="1.3.0">
  <SelectTrigger aria-label="Version">
    <SelectValue placeholder="Select a version" />
  </SelectTrigger>
  <SelectContent searchPlaceholder="Search versions…">
    <SelectItem value="1.3.0">v1.3.0</SelectItem>
    <SelectItem value="1.2.0">v1.2.0</SelectItem>
  </SelectContent>
</Select>`,
  },
  {
    id: "disabled",
    title: "Disabled",
    description: "Disabled Select and disabled options.",
    preview: <DisabledSelectDemo />,
    code: `<Select disabled defaultValue="est">
  <SelectTrigger aria-label="Disabled select">
    <SelectValue />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="est">Eastern Standard Time (EST)</SelectItem>
  </SelectContent>
</Select>`,
  },
  {
    id: "long-list",
    title: "Long list",
    description: "Scroll and search across many options.",
    preview: <LongListSelectDemo />,
    code: `<Select searchable defaultValue="city-0">
  <SelectTrigger aria-label="City">
    <SelectValue placeholder="Pick a city" />
  </SelectTrigger>
  <SelectContent searchPlaceholder="Search cities">
    {cities.map((city) => (
      <SelectItem key={city.id} value={city.id}>
        {city.name}
      </SelectItem>
    ))}
  </SelectContent>
</Select>`,
  },
  {
    id: "form",
    title: "Form example",
    description: "Use name for native form posts with a hidden input.",
    preview: <FormSelectDemo />,
    code: `<Select name="plan" defaultValue="pro">
  <SelectTrigger id="plan">
    <SelectValue placeholder="Choose a plan" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="starter">Starter</SelectItem>
    <SelectItem value="pro">Pro</SelectItem>
  </SelectContent>
</Select>`,
  },
  {
    id: "dashboard",
    title: "Dashboard example",
    description: "Compact filter control for analytics surfaces.",
    preview: <DashboardFilterDemo />,
    code: `<Select value={range} onValueChange={setRange}>
  <SelectTrigger className="w-36" aria-label="Date range">
    <SelectValue />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="7d">Last 7 days</SelectItem>
    <SelectItem value="30d">Last 30 days</SelectItem>
  </SelectContent>
</Select>`,
  },
];

const inPractice: ComponentInPractice = {
  description:
    "Pair Select with Label for locale and timezone preferences. Use searchable only when the list benefits from filtering.",
  preview: <FormSelectDemo />,
  code: inPracticeSource,
};

export default async function SelectPage() {
  const source = await readFile(
    path.join(process.cwd(), "registry/new-york/ui/select/index.tsx"),
    "utf8",
  );

  return (
    <ComponentReference
      title="Select"
      description="A custom select with optional built-in search, grouped options, and accessible listbox behavior."
      overview={
        <>
          <p>
            Select is a custom dropdown for styled surfaces. By default it
            behaves like a conventional picker with no search field. Pass{" "}
            <code>searchable</code> when you need built-in filtering.
          </p>
          <p>
            Use{" "}
            <a href="/components/native-select" className="underline">
              Native Select
            </a>{" "}
            when you need the platform picker or native form semantics only.
          </p>
        </>
      }
      install="vinyaas add select"
      usage={usage}
      examples={examples}
      inPractice={inPractice}
      api={api}
      accessibility={
        <>
          <p>
            The trigger exposes <code>role=&quot;combobox&quot;</code> with{" "}
            <code>aria-expanded</code> and <code>aria-controls</code>. Options
            render in a <code>role=&quot;listbox&quot;</code> with{" "}
            <code>role=&quot;option&quot;</code> and <code>aria-selected</code>.
          </p>
          <p>
            Open with Enter, Space, or Arrow Down on the trigger. In searchable
            mode the search field receives focus; otherwise the first option is
            focused. Move with Arrow Up/Down, select with Enter or click, and
            close with Escape. Focus returns to the trigger when the list
            closes.
          </p>
        </>
      }
      source={source}
    >
      <BasicSelectDemo />
    </ComponentReference>
  );
}

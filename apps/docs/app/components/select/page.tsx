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
        <Select name="timezone" defaultValue="America/Los_Angeles">
          <SelectTrigger id="timezone">
            <SelectValue placeholder="Select a timezone" />
          </SelectTrigger>
          <SelectContent>
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
];

const examples: ComponentExample[] = [
  {
    id: "basic",
    title: "Basic",
    description: "Default Select — a conventional styled picker.",
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
    id: "grouped",
    title: "Grouped",
    description: "Timezone-style groups with labels and separators.",
    preview: <GroupedTimezoneDemo />,
    code: `<Select defaultValue="est">
  <SelectTrigger aria-label="Timezone">
    <SelectValue placeholder="Select a timezone" />
  </SelectTrigger>
  <SelectContent>
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
    description: "Compact selector for a short list of release versions.",
    preview: <ChangelogStyleSelectDemo />,
    code: `<Select defaultValue="1.3.0">
  <SelectTrigger aria-label="Version">
    <SelectValue placeholder="Select a version" />
  </SelectTrigger>
  <SelectContent>
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
    description: "Scroll through many options in a fixed-height listbox.",
    preview: <LongListSelectDemo />,
    code: `<Select defaultValue="city-0">
  <SelectTrigger aria-label="City">
    <SelectValue placeholder="Pick a city" />
  </SelectTrigger>
  <SelectContent>
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
    "Pair Select with Label for locale and timezone preferences. For long lists that need filtering, use Combobox instead.",
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
      description="A custom select with grouped options and accessible listbox behavior."
      overview={
        <>
          <p>
            Select is a custom dropdown for styled surfaces. It works best for
            short to medium option lists where keyboard listbox navigation is
            enough.
          </p>
          <p>
            Use{" "}
            <a href="/components/combobox" className="underline">
              Combobox
            </a>{" "}
            when users need to search or filter a long list. Use{" "}
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
            Open with Enter, Space, or Arrow Down on the trigger. The selected
            option or the first option receives focus. Move with Arrow Up/Down,
            Home, and End; select with Enter or click; close with Escape. Tab
            moves through options while open and exits at the ends without
            trapping focus. Focus returns to the trigger when the list closes.
          </p>
        </>
      }
      source={source}
    >
      <BasicSelectDemo />
    </ComponentReference>
  );
}

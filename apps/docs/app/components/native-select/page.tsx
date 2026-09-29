import { readFile } from "node:fs/promises";
import path from "node:path";
import type { ApiRow } from "@/components/api-table";
import type {
  ComponentExample,
  ComponentInPractice,
} from "@/components/component-reference";
import { ComponentReference } from "@/components/component-reference";
import { Button } from "@/registry/new-york/ui/button";
import { Label } from "@/registry/new-york/ui/label";
import {
  NativeSelect,
  NativeSelectOptGroup,
  NativeSelectOption,
} from "@/registry/new-york/ui/native-select";
import type { Metadata } from "next";
import { componentPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = componentPageMetadata("native-select");

const usage = `import { Label } from "@/components/ui/label";
import {
  NativeSelect,
  NativeSelectOptGroup,
  NativeSelectOption,
} from "@/components/ui/native-select";

export function RegionField() {
  return (
    <div className="grid gap-2">
      <Label htmlFor="region">Region</Label>
      <NativeSelect id="region" name="region" defaultValue="in">
        <NativeSelectOptGroup label="Asia">
          <NativeSelectOption value="in">India</NativeSelectOption>
        </NativeSelectOptGroup>
        <NativeSelectOption value="us">United States</NativeSelectOption>
      </NativeSelect>
    </div>
  );
}
`;

const inPracticeSource = `import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  NativeSelect,
  NativeSelectOptGroup,
  NativeSelectOption,
} from "@/components/ui/native-select";

export function LocaleProfile() {
  return (
    <form className="grid w-full max-w-md gap-4 text-left">
      <div className="grid gap-2">
        <Label htmlFor="locale">Language</Label>
        <NativeSelect id="locale" name="locale" defaultValue="en-US">
          <NativeSelectOption value="en-US">English (United States)</NativeSelectOption>
          <NativeSelectOption value="en-GB">English (United Kingdom)</NativeSelectOption>
          <NativeSelectOption value="hi-IN">Hindi (India)</NativeSelectOption>
        </NativeSelect>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="timezone">Timezone</Label>
        <NativeSelect id="timezone" name="timezone" defaultValue="America/Los_Angeles">
          <NativeSelectOptGroup label="Americas">
            <NativeSelectOption value="America/Los_Angeles">
              Pacific Time (Los Angeles)
            </NativeSelectOption>
            <NativeSelectOption value="America/New_York">
              Eastern Time (New York)
            </NativeSelectOption>
          </NativeSelectOptGroup>
          <NativeSelectOptGroup label="Asia">
            <NativeSelectOption value="Asia/Kolkata">
              India Standard Time (Kolkata)
            </NativeSelectOption>
          </NativeSelectOptGroup>
        </NativeSelect>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="date-format">Date format</Label>
        <NativeSelect id="date-format" name="dateFormat" defaultValue="mdy">
          <NativeSelectOption value="mdy">Sep 29, 2026</NativeSelectOption>
          <NativeSelectOption value="dmy">29 Sep 2026</NativeSelectOption>
          <NativeSelectOption value="ymd">2026-09-29</NativeSelectOption>
        </NativeSelect>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row">
        <Button type="submit">Save preferences</Button>
        <Button type="button" variant="outline">
          Cancel
        </Button>
      </div>
    </form>
  );
}
`;

const api: ApiRow[] = [
  {
    prop: "value",
    type: "string | string[]",
    description: "Controlled selected value. Use with onChange.",
  },
  {
    prop: "defaultValue",
    type: "string | string[]",
    description: "Initial selected value for an uncontrolled select.",
  },
  {
    prop: "disabled",
    type: "boolean",
    description: "Native disabled state.",
  },
  {
    prop: "required",
    type: "boolean",
    description: "Native required constraint.",
  },
  {
    prop: "multiple",
    type: "boolean",
    description: "Allows more than one option and lets the control grow.",
  },
  {
    prop: "className",
    type: "string",
    description: "Merged onto the select with cn.",
  },
];

const examples: ComponentExample[] = [
  {
    id: "basic",
    title: "Basic",
    description: "NativeSelect is a native select. Options are native options.",
    preview: (
      <NativeSelect aria-label="Region" defaultValue="in" className="max-w-sm">
        <NativeSelectOption value="in">India</NativeSelectOption>
        <NativeSelectOption value="us">United States</NativeSelectOption>
      </NativeSelect>
    ),
    code: `<NativeSelect aria-label="Region" defaultValue="in">
  <NativeSelectOption value="in">India</NativeSelectOption>
  <NativeSelectOption value="us">United States</NativeSelectOption>
</NativeSelect>`,
  },
  {
    id: "groups",
    title: "Groups",
    description: "NativeSelectOptGroup is a native optgroup.",
    preview: (
      <NativeSelect aria-label="Region" defaultValue="in" className="max-w-sm">
        <NativeSelectOptGroup label="Asia">
          <NativeSelectOption value="in">India</NativeSelectOption>
        </NativeSelectOptGroup>
        <NativeSelectOptGroup label="Americas">
          <NativeSelectOption value="us">United States</NativeSelectOption>
        </NativeSelectOptGroup>
      </NativeSelect>
    ),
    code: `<NativeSelect aria-label="Region" defaultValue="in" className="max-w-sm">
  <NativeSelectOptGroup label="Asia">
    <NativeSelectOption value="in">India</NativeSelectOption>
  </NativeSelectOptGroup>
  <NativeSelectOptGroup label="Americas">
    <NativeSelectOption value="us">United States</NativeSelectOption>
  </NativeSelectOptGroup>
</NativeSelect>`,
  },
  {
    id: "disabled",
    title: "Disabled",
    description: "disabled is the native state.",
    preview: (
      <NativeSelect
        aria-label="Region"
        defaultValue="in"
        disabled
        className="max-w-sm"
      >
        <NativeSelectOption value="in">India</NativeSelectOption>
      </NativeSelect>
    ),
    code: `<NativeSelect aria-label="Region" defaultValue="in" disabled>
  <NativeSelectOption value="in">India</NativeSelectOption>
</NativeSelect>`,
  },
  {
    id: "required",
    title: "Required",
    description: "required is the native constraint.",
    preview: (
      <div className="grid w-full max-w-sm gap-2">
        <Label htmlFor="required-region">Region</Label>
        <NativeSelect
          id="required-region"
          name="region"
          required
          defaultValue=""
        >
          <NativeSelectOption value="">Choose a region</NativeSelectOption>
          <NativeSelectOption value="in">India</NativeSelectOption>
        </NativeSelect>
      </div>
    ),
    code: `<Label htmlFor="region">Region</Label>
<NativeSelect id="region" name="region" required defaultValue="">
  <NativeSelectOption value="">Choose a region</NativeSelectOption>
  <NativeSelectOption value="in">India</NativeSelectOption>
</NativeSelect>`,
  },
  {
    id: "multiple",
    title: "Multiple",
    description:
      "multiple keeps the native list and does not force a 36px height.",
    preview: (
      <NativeSelect
        aria-label="Regions"
        multiple
        defaultValue={["in"]}
        className="max-w-sm"
      >
        <NativeSelectOption value="in">India</NativeSelectOption>
        <NativeSelectOption value="us">United States</NativeSelectOption>
      </NativeSelect>
    ),
    code: `<NativeSelect aria-label="Regions" multiple defaultValue={["in"]}>
  <NativeSelectOption value="in">India</NativeSelectOption>
  <NativeSelectOption value="us">United States</NativeSelectOption>
</NativeSelect>`,
  },
];

const inPractice: ComponentInPractice = {
  description:
    "Language, timezone, and date format use labelled native selects on a profile form.",
  preview: (
    <form className="grid w-full max-w-md gap-4 text-left">
      <div className="grid gap-2">
        <Label htmlFor="practice-locale">Language</Label>
        <NativeSelect id="practice-locale" name="locale" defaultValue="en-US">
          <NativeSelectOption value="en-US">
            English (United States)
          </NativeSelectOption>
          <NativeSelectOption value="en-GB">
            English (United Kingdom)
          </NativeSelectOption>
          <NativeSelectOption value="hi-IN">Hindi (India)</NativeSelectOption>
        </NativeSelect>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="practice-timezone">Timezone</Label>
        <NativeSelect
          id="practice-timezone"
          name="timezone"
          defaultValue="America/Los_Angeles"
        >
          <NativeSelectOptGroup label="Americas">
            <NativeSelectOption value="America/Los_Angeles">
              Pacific Time (Los Angeles)
            </NativeSelectOption>
            <NativeSelectOption value="America/New_York">
              Eastern Time (New York)
            </NativeSelectOption>
          </NativeSelectOptGroup>
          <NativeSelectOptGroup label="Asia">
            <NativeSelectOption value="Asia/Kolkata">
              India Standard Time (Kolkata)
            </NativeSelectOption>
          </NativeSelectOptGroup>
        </NativeSelect>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="practice-date-format">Date format</Label>
        <NativeSelect
          id="practice-date-format"
          name="dateFormat"
          defaultValue="mdy"
        >
          <NativeSelectOption value="mdy">Sep 29, 2026</NativeSelectOption>
          <NativeSelectOption value="dmy">29 Sep 2026</NativeSelectOption>
          <NativeSelectOption value="ymd">2026-09-29</NativeSelectOption>
        </NativeSelect>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row">
        <Button type="submit">Save preferences</Button>
        <Button type="button" variant="outline">
          Cancel
        </Button>
      </div>
    </form>
  ),
  code: inPracticeSource,
};

export default async function NativeSelectPage() {
  const source = await readFile(
    path.join(process.cwd(), "registry/new-york/ui/native-select/index.tsx"),
    "utf8",
  );

  return (
    <ComponentReference
      title="Native Select"
      description="A composed native select."
      overview={
        <>
          <p>
            NativeSelect, NativeSelectOption, and NativeSelectOptGroup render a
            native <code>select</code>, <code>option</code>, and{" "}
            <code>optgroup</code>. The browser handles the menu, the keyboard,
            and the submitted value.
          </p>
          <p>
            Use a plain <code>select</code> when the composed parts are not
            needed. NativeSelect is the installable composed API. A custom popup
            Select is not part of this library.
          </p>
        </>
      }
      install="vinyaas add native-select"
      manual={
        <p>
          After <code>vinyaas init</code>, place the source at{" "}
          <code>components/ui/native-select/index.tsx</code>. It imports{" "}
          <code>cn</code> from <code>@/lib/utils</code>. The project also needs{" "}
          <code>clsx</code> and <code>tailwind-merge</code>.
        </p>
      }
      usage={usage}
      examples={examples}
      inPractice={inPractice}
      api={api}
      accessibility={
        <>
          <p>
            NativeSelect does not add an ARIA role. A single select is a
            combobox. A multiple select is a list box.
          </p>
          <ul className="list-disc pl-5">
            <li>Name it with a label and matching id, or with aria-label.</li>
            <li>Keyboard behavior is the browser default.</li>
            <li>disabled and required are the native states.</li>
          </ul>
        </>
      }
      source={source}
    >
      <div className="grid w-full max-w-sm gap-2">
        <Label htmlFor="preview-region">Region</Label>
        <NativeSelect id="preview-region" defaultValue="in">
          <NativeSelectOptGroup label="Asia">
            <NativeSelectOption value="in">India</NativeSelectOption>
          </NativeSelectOptGroup>
          <NativeSelectOption value="us">United States</NativeSelectOption>
        </NativeSelect>
      </div>
    </ComponentReference>
  );
}

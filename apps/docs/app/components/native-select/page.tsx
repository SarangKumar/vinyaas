import { readFile } from "node:fs/promises";
import path from "node:path";

import type { ApiRow } from "@/components/api-table";
import type { ComponentExample } from "@/components/component-reference";
import { ComponentReference } from "@/components/component-reference";
import { Label } from "@/registry/new-york/ui/label/label";
import {
  NativeSelect,
  NativeSelectOptGroup,
  NativeSelectOption,
} from "@/registry/new-york/ui/native-select/native-select";

const usage = `import { Label } from "@/components/ui/label/label";
import {
  NativeSelect,
  NativeSelectOptGroup,
  NativeSelectOption,
} from "@/components/ui/native-select/native-select";

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
    code: `<NativeSelect aria-label="Region" defaultValue="in">
  <NativeSelectOptGroup label="Asia">
    <NativeSelectOption value="in">India</NativeSelectOption>
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

export default async function NativeSelectPage() {
  const source = await readFile(
    path.join(
      process.cwd(),
      "registry/new-york/ui/native-select/native-select.tsx",
    ),
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
          <code>components/ui/native-select/native-select.tsx</code>. It imports{" "}
          <code>cn</code> from <code>@/lib/utils</code>. The project also needs{" "}
          <code>clsx</code> and <code>tailwind-merge</code>.
        </p>
      }
      usage={usage}
      examples={examples}
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

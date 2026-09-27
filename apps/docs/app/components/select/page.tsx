import { readFile } from "node:fs/promises";
import path from "node:path";

import type { ApiRow } from "@/components/api-table";
import type { ComponentExample } from "@/components/component-reference";
import { ComponentReference } from "@/components/component-reference";
import { Label } from "@/registry/new-york/ui/label/label";
import { Select } from "@/registry/new-york/ui/select/select";

const usage = `import { Label } from "@/components/ui/label/label";
import { Select } from "@/components/ui/select/select";

export function PlanField() {
  return (
    <div className="grid gap-2">
      <Label htmlFor="plan">Plan</Label>
      <Select id="plan" name="plan" defaultValue="pro">
        <option value="free">Free</option>
        <option value="pro">Pro</option>
      </Select>
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
    description:
      "Allows more than one option. The control becomes a list box and its height grows.",
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
    description: "A native select. Arrow keys and typing follow the browser.",
    preview: (
      <Select aria-label="Plan" defaultValue="pro" className="max-w-sm">
        <option value="free">Free</option>
        <option value="pro">Pro</option>
      </Select>
    ),
    code: `<Select aria-label="Plan" defaultValue="pro">
  <option value="free">Free</option>
  <option value="pro">Pro</option>
</Select>`,
  },
  {
    id: "placeholder",
    title: "Placeholder",
    description: "An empty option is the prompt. It is a real option.",
    preview: (
      <Select aria-label="Plan" defaultValue="" className="max-w-sm">
        <option value="">Choose a plan</option>
        <option value="free">Free</option>
        <option value="pro">Pro</option>
      </Select>
    ),
    code: `<Select aria-label="Plan" defaultValue="">
  <option value="">Choose a plan</option>
  <option value="pro">Pro</option>
</Select>`,
  },
  {
    id: "disabled",
    title: "Disabled",
    description: "A disabled select cannot be changed.",
    preview: (
      <Select
        aria-label="Plan"
        defaultValue="pro"
        disabled
        className="max-w-sm"
      >
        <option value="pro">Pro</option>
      </Select>
    ),
    code: `<Select aria-label="Plan" defaultValue="pro" disabled>
  <option value="pro">Pro</option>
</Select>`,
  },
  {
    id: "required",
    title: "Required",
    description:
      "required is the native constraint. Name the field with a label.",
    preview: (
      <div className="grid w-full max-w-sm gap-2">
        <Label htmlFor="required-plan">Plan</Label>
        <Select id="required-plan" name="plan" required defaultValue="">
          <option value="">Choose a plan</option>
          <option value="pro">Pro</option>
        </Select>
      </div>
    ),
    code: `<Label htmlFor="plan">Plan</Label>
<Select id="plan" name="plan" required defaultValue="">
  <option value="">Choose a plan</option>
  <option value="pro">Pro</option>
</Select>`,
  },
  {
    id: "multiple",
    title: "Multiple",
    description:
      "multiple keeps the native list. Hold the modifier key the browser uses to select more than one option.",
    preview: (
      <Select
        aria-label="Regions"
        multiple
        defaultValue={["us"]}
        className="max-w-sm"
      >
        <option value="us">United States</option>
        <option value="in">India</option>
      </Select>
    ),
    code: `<Select aria-label="Regions" multiple defaultValue={["us"]}>
  <option value="us">United States</option>
  <option value="in">India</option>
</Select>`,
  },
];

export default async function SelectPage() {
  const source = await readFile(
    path.join(process.cwd(), "registry/new-york/ui/select/select.tsx"),
    "utf8",
  );

  return (
    <ComponentReference
      title="Select"
      description="A native select for choosing an option."
      overview={
        <>
          <p>
            Select renders a native <code>select</code>. Options are native{" "}
            <code>option</code> elements. The browser handles the menu, the
            keyboard, and the submitted value.
          </p>
          <p>
            The closed control uses the same height, type size, border, and
            focus ring as Input. The dropdown indicator stays the browser&apos;s
            own.
          </p>
        </>
      }
      install="vinyaas add select"
      manual={
        <p>
          After <code>vinyaas init</code>, place the source at{" "}
          <code>components/ui/select/select.tsx</code>. It imports{" "}
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
            Select is a native select. It does not add an ARIA role. A single
            select is a combobox. A multiple select is a list box.
          </p>
          <ul className="list-disc pl-5">
            <li>Name it with a label and matching id, or with aria-label.</li>
            <li>
              Keyboard behavior is the browser default, including arrow keys and
              type-ahead.
            </li>
            <li>disabled and required are the native states.</li>
            <li>aria attributes are passed through.</li>
          </ul>
        </>
      }
      source={source}
    >
      <div className="grid w-full max-w-sm gap-2">
        <Label htmlFor="preview-plan">Plan</Label>
        <Select id="preview-plan" defaultValue="pro">
          <option value="free">Free</option>
          <option value="pro">Pro</option>
        </Select>
      </div>
    </ComponentReference>
  );
}

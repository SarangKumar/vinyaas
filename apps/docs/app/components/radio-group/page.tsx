import { readFile } from "node:fs/promises";
import path from "node:path";
import type { ApiRow } from "@/components/api-table";
import type { ComponentExample } from "@/components/component-reference";
import { ComponentReference } from "@/components/component-reference";
import { Label } from "@/registry/new-york/ui/label/label";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/registry/new-york/ui/radio-group/radio-group";
import type { Metadata } from "next";
import { componentPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = componentPageMetadata("radio-group");

const usage = `import { Label } from "@/components/ui/label/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group/radio-group";

export function SpacingField() {
  return (
    <RadioGroup defaultValue="comfortable" name="spacing">
      <div className="flex items-center gap-2">
        <RadioGroupItem value="default" id="r1" />
        <Label htmlFor="r1">Default</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="comfortable" id="r2" />
        <Label htmlFor="r2">Comfortable</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="compact" id="r3" />
        <Label htmlFor="r3">Compact</Label>
      </div>
    </RadioGroup>
  );
}
`;

const api: ApiRow[] = [
  {
    prop: "value",
    type: "string",
    description:
      "On RadioGroup, the controlled selection. On RadioGroupItem, the option value.",
  },
  {
    prop: "defaultValue",
    type: "string",
    description: "Uncontrolled initial selection for RadioGroup.",
  },
  {
    prop: "onValueChange",
    type: "(value: string) => void",
    description: "Called with the newly selected item value.",
  },
  {
    prop: "name",
    type: "string",
    description:
      "Shared by the items so the browser treats them as one group and submits one value.",
  },
  {
    prop: "disabled",
    type: "boolean",
    description:
      "On the group, disables every item. On an item, disables that option.",
  },
  {
    prop: "required",
    type: "boolean",
    description: "Requires a selection when the group is in a form.",
  },
  {
    prop: "className",
    type: "string",
    description: "Merged with cn on the group or the item.",
  },
];

const examples: ComponentExample[] = [
  {
    id: "options",
    title: "Options",
    description: "defaultValue selects one option. The others stay unchecked.",
    preview: (
      <RadioGroup defaultValue="comfortable" name="spacing-example">
        <div className="flex items-center gap-2">
          <RadioGroupItem value="default" id="spacing-default" />
          <Label htmlFor="spacing-default">Default</Label>
        </div>
        <div className="flex items-center gap-2">
          <RadioGroupItem value="comfortable" id="spacing-comfortable" />
          <Label htmlFor="spacing-comfortable">Comfortable</Label>
        </div>
        <div className="flex items-center gap-2">
          <RadioGroupItem value="compact" id="spacing-compact" />
          <Label htmlFor="spacing-compact">Compact</Label>
        </div>
      </RadioGroup>
    ),
    code: `<RadioGroup defaultValue="comfortable" name="spacing">
  <div className="flex items-center gap-2">
    <RadioGroupItem value="default" id="r1" />
    <Label htmlFor="r1">Default</Label>
  </div>
  <div className="flex items-center gap-2">
    <RadioGroupItem value="comfortable" id="r2" />
    <Label htmlFor="r2">Comfortable</Label>
  </div>
</RadioGroup>`,
  },
  {
    id: "disabled-item",
    title: "Disabled option",
    description: "One option can be disabled while the others stay available.",
    preview: (
      <RadioGroup defaultValue="card" name="method-example">
        <div className="flex items-center gap-2">
          <RadioGroupItem value="card" id="method-card" />
          <Label htmlFor="method-card">Card</Label>
        </div>
        <div className="flex items-center gap-2">
          <RadioGroupItem value="invoice" id="method-invoice" disabled />
          <Label htmlFor="method-invoice">Invoice</Label>
        </div>
      </RadioGroup>
    ),
    code: `<RadioGroupItem value="invoice" id="invoice" disabled />`,
  },
  {
    id: "disabled-group",
    title: "Disabled group",
    description: "disabled on RadioGroup disables every item.",
    preview: (
      <RadioGroup defaultValue="email" name="notify-example" disabled>
        <div className="flex items-center gap-2">
          <RadioGroupItem value="email" id="notify-email" />
          <Label htmlFor="notify-email">Email</Label>
        </div>
        <div className="flex items-center gap-2">
          <RadioGroupItem value="sms" id="notify-sms" />
          <Label htmlFor="notify-sms">SMS</Label>
        </div>
      </RadioGroup>
    ),
    code: `<RadioGroup defaultValue="email" disabled>
  <RadioGroupItem value="email" id="email" />
  <RadioGroupItem value="sms" id="sms" />
</RadioGroup>`,
  },
];

export default async function RadioGroupPage() {
  const source = await readFile(
    path.join(
      process.cwd(),
      "registry/new-york/ui/radio-group/radio-group.tsx",
    ),
    "utf8",
  );

  return (
    <ComponentReference
      title="Radio Group"
      description="A set of mutually exclusive options."
      overview={
        <p>
          Radio Group renders native radio inputs that share a name. Use it when
          a person must choose one option. Arrow keys move between the options,
          which is the browser&apos;s radio behavior. The group does not
          validate the field or store form state beyond the selected value.
        </p>
      }
      install="vinyaas add radio-group"
      manual={
        <p>
          After <code>vinyaas init</code>, place the source at{" "}
          <code>components/ui/radio-group/radio-group.tsx</code>. It imports{" "}
          <code>cn</code> from <code>@/lib/utils</code>. The project also needs{" "}
          <code>clsx</code> and <code>tailwind-merge</code>. Label is a separate
          component.
        </p>
      }
      usage={usage}
      examples={examples}
      api={api}
      accessibility={
        <>
          <p>
            The group is a radiogroup. Each item is a native radio input. Items
            do not add an extra ARIA role.
          </p>
          <ul className="list-disc pl-5">
            <li>
              Name each option with a label whose htmlFor matches the item id.
            </li>
            <li>
              Items in one group share a name, so the browser selects only one
              and submits that value.
            </li>
            <li>
              Arrow keys move the selection. Space selects the focused option.
            </li>
            <li>
              disabled on the group disables every item. disabled on an item
              disables that option.
            </li>
            <li>Focus uses a visible focus-visible ring on the radio.</li>
          </ul>
        </>
      }
      source={source}
    >
      <RadioGroup defaultValue="comfortable" name="spacing">
        <div className="flex items-center gap-2">
          <RadioGroupItem value="default" id="r1" />
          <Label htmlFor="r1">Default</Label>
        </div>
        <div className="flex items-center gap-2">
          <RadioGroupItem value="comfortable" id="r2" />
          <Label htmlFor="r2">Comfortable</Label>
        </div>
        <div className="flex items-center gap-2">
          <RadioGroupItem value="compact" id="r3" />
          <Label htmlFor="r3">Compact</Label>
        </div>
      </RadioGroup>
    </ComponentReference>
  );
}

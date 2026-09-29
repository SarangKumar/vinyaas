import { readFile } from "node:fs/promises";
import path from "node:path";
import type { ApiRow } from "@/components/api-table";
import type { ComponentExample } from "@/components/component-reference";
import { ComponentReference } from "@/components/component-reference";
import { Checkbox } from "@/registry/new-york/ui/checkbox";
import { Label } from "@/registry/new-york/ui/label";
import type { Metadata } from "next";
import { componentPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = componentPageMetadata("checkbox");

const usage = `import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export function TermsField() {
  return (
    <div className="flex items-center gap-2">
      <Checkbox id="terms" name="terms" value="accepted" />
      <Label htmlFor="terms">Accept terms and conditions</Label>
    </div>
  );
}
`;

const api: ApiRow[] = [
  {
    prop: "checked",
    type: "boolean",
    description: "Controlled checked state. Pair it with onChange.",
  },
  {
    prop: "defaultChecked",
    type: "boolean",
    description: "Uncontrolled initial checked state.",
  },
  {
    prop: "disabled",
    type: "boolean",
    description: "Native disabled state. The control stays in the tab order.",
  },
  {
    prop: "required",
    type: "boolean",
    description: "Native required state for the surrounding form.",
  },
  {
    prop: "name",
    type: "string",
    description: "Submitted with the form when the box is checked.",
  },
  {
    prop: "value",
    type: "string",
    description: "Submitted value. The default is on.",
  },
  {
    prop: "indeterminate",
    type: "boolean",
    description: "Mixed state, such as a parent of partially selected items.",
  },
  {
    prop: "className",
    type: "string",
    description: "Merged onto the checkbox with cn.",
  },
];

const examples: ComponentExample[] = [
  {
    id: "with-label",
    title: "With a label",
    description:
      "htmlFor matches the checkbox id. The label names the control.",
    preview: (
      <div className="flex items-center gap-2">
        <Checkbox id="terms-example" />
        <Label htmlFor="terms-example">Accept terms and conditions</Label>
      </div>
    ),
    code: `<div className="flex items-center gap-2">
  <Checkbox id="terms" />
  <Label htmlFor="terms">Accept terms and conditions</Label>
</div>`,
  },
  {
    id: "checked",
    title: "Checked",
    description: "defaultChecked starts the box selected.",
    preview: (
      <div className="flex items-center gap-2">
        <Checkbox id="updates" defaultChecked />
        <Label htmlFor="updates">Send product updates</Label>
      </div>
    ),
    code: `<Checkbox id="updates" name="updates" defaultChecked />`,
  },
  {
    id: "disabled",
    title: "Disabled",
    description: "A disabled checkbox cannot be toggled.",
    preview: (
      <div className="flex items-center gap-2">
        <Checkbox id="locked" defaultChecked disabled />
        <Label htmlFor="locked">Required for this account</Label>
      </div>
    ),
    code: `<Checkbox id="locked" defaultChecked disabled />`,
  },
  {
    id: "indeterminate",
    title: "Indeterminate",
    description:
      "Use indeterminate when a parent checkbox represents a partial selection.",
    preview: (
      <div className="flex items-center gap-2">
        <Checkbox id="select-all" indeterminate />
        <Label htmlFor="select-all">Select all</Label>
      </div>
    ),
    code: `<Checkbox id="select-all" indeterminate />`,
  },
];

export default async function CheckboxPage() {
  const source = await readFile(
    path.join(process.cwd(), "registry/new-york/ui/checkbox/index.tsx"),
    "utf8",
  );

  return (
    <ComponentReference
      title="Checkbox"
      description="A native checkbox for selecting one or more options."
      overview={
        <p>
          Checkbox renders a native checkbox. Use it when a person can select
          any number of independent options, including none. It participates in
          a form through <code>name</code> and <code>value</code>. It does not
          store form state or validate the field.
        </p>
      }
      install="vinyaas add checkbox"
      manual={
        <p>
          After <code>vinyaas init</code>, place the source at{" "}
          <code>components/ui/checkbox/index.tsx</code>. It imports{" "}
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
          <p>Checkbox is a native checkbox. It does not add an ARIA role.</p>
          <ul className="list-disc pl-5">
            <li>Name it with a label whose htmlFor matches the checkbox id.</li>
            <li>Space toggles it when it has focus.</li>
            <li>
              disabled blocks toggling. The control stays in the accessibility
              tree.
            </li>
            <li>Focus uses a visible focus-visible ring.</li>
            <li>
              aria-invalid and other ARIA attributes are passed through.
              indeterminate is the native mixed state.
            </li>
          </ul>
        </>
      }
      source={source}
    >
      <div className="flex items-center gap-2">
        <Checkbox id="terms" />
        <Label htmlFor="terms">Accept terms and conditions</Label>
      </div>
    </ComponentReference>
  );
}

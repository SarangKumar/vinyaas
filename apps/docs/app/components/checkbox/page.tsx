import { readFile } from "node:fs/promises";
import path from "node:path";
import type { ApiRow } from "@/components/api-table";
import type {
  ComponentExample,
  ComponentInPractice,
} from "@/components/component-reference";
import { ComponentReference } from "@/components/component-reference";
import { Button } from "@/registry/new-york/ui/button";
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

const inPracticeSource = `import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export function NotificationPreferences() {
  return (
    <form className="grid w-full max-w-md gap-4 text-left">
      <p className="text-muted-foreground text-base leading-7">
        Choose which workspace email you want to receive.
      </p>
      <div className="grid gap-3">
        <div className="flex items-start gap-2">
          <Checkbox id="product-updates" name="product-updates" defaultChecked />
          <div className="grid gap-1">
            <Label htmlFor="product-updates">Product updates</Label>
            <p className="text-muted-foreground text-base leading-7">
              Release notes and occasional announcements.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <Checkbox id="billing" name="billing" defaultChecked />
          <div className="grid gap-1">
            <Label htmlFor="billing">Billing</Label>
            <p className="text-muted-foreground text-base leading-7">
              Invoices, receipts, and payment failures.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <Checkbox id="security" name="security" defaultChecked />
          <div className="grid gap-1">
            <Label htmlFor="security">Security alerts</Label>
            <p className="text-muted-foreground text-base leading-7">
              Sign-ins, password changes, and 2FA events.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <Checkbox id="marketing" name="marketing" />
          <div className="grid gap-1">
            <Label htmlFor="marketing">Marketing</Label>
            <p className="text-muted-foreground text-base leading-7">
              Tips, webinars, and partner offers.
            </p>
          </div>
        </div>
      </div>
      <Button type="submit" className="w-full sm:w-auto">
        Save preferences
      </Button>
    </form>
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

const inPractice: ComponentInPractice = {
  description:
    "Independent notification channels use checkboxes. Save writes the selection.",
  preview: (
    <form className="grid w-full max-w-md gap-4 text-left">
      <p className="text-muted-foreground text-base leading-7">
        Choose which workspace email you want to receive.
      </p>
      <div className="grid gap-3">
        <div className="flex items-start gap-2">
          <Checkbox
            id="practice-product-updates"
            name="product-updates"
            defaultChecked
          />
          <div className="grid gap-1">
            <Label htmlFor="practice-product-updates">Product updates</Label>
            <p className="text-muted-foreground text-base leading-7">
              Release notes and occasional announcements.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <Checkbox id="practice-billing" name="billing" defaultChecked />
          <div className="grid gap-1">
            <Label htmlFor="practice-billing">Billing</Label>
            <p className="text-muted-foreground text-base leading-7">
              Invoices, receipts, and payment failures.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <Checkbox id="practice-security" name="security" defaultChecked />
          <div className="grid gap-1">
            <Label htmlFor="practice-security">Security alerts</Label>
            <p className="text-muted-foreground text-base leading-7">
              Sign-ins, password changes, and 2FA events.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <Checkbox id="practice-marketing" name="marketing" />
          <div className="grid gap-1">
            <Label htmlFor="practice-marketing">Marketing</Label>
            <p className="text-muted-foreground text-base leading-7">
              Tips, webinars, and partner offers.
            </p>
          </div>
        </div>
      </div>
      <Button type="submit" className="w-full sm:w-auto">
        Save preferences
      </Button>
    </form>
  ),
  code: inPracticeSource,
};

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
      inPractice={inPractice}
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

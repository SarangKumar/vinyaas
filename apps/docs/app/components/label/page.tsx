import { readFile } from "node:fs/promises";
import path from "node:path";
import type { ApiRow } from "@/components/api-table";
import type { ComponentExample } from "@/components/component-reference";
import { ComponentReference } from "@/components/component-reference";
import { Input } from "@/registry/new-york/ui/input";
import { Label } from "@/registry/new-york/ui/label";
import { Textarea } from "@/registry/new-york/ui/textarea";
import type { Metadata } from "next";
import { componentPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = componentPageMetadata("label");

const usage = `import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function EmailField() {
  return (
    <div className="grid gap-2">
      <Label htmlFor="email">Email</Label>
      <Input id="email" type="email" placeholder="you@example.com" />
    </div>
  );
}
`;

const api: ApiRow[] = [
  {
    prop: "htmlFor",
    type: "string",
    description: "Matches the id of the control this label names.",
  },
  {
    prop: "children",
    type: "ReactNode",
    description: "Visible text for the control.",
  },
  {
    prop: "className",
    type: "string",
    description: "Merged onto the label with cn.",
  },
];

const examples: ComponentExample[] = [
  {
    id: "input",
    title: "Input",
    description:
      "htmlFor matches the input id. The label text is the accessible name.",
    preview: (
      <div className="grid w-full max-w-sm gap-2 text-left">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" placeholder="you@example.com" />
      </div>
    ),
    code: `<div className="grid gap-2">
  <Label htmlFor="email">Email</Label>
  <Input id="email" type="email" placeholder="you@example.com" />
</div>`,
  },
  {
    id: "textarea",
    title: "Textarea",
    description: "The same htmlFor and id pairing names a multiline field.",
    preview: (
      <div className="grid w-full max-w-sm gap-2 text-left">
        <Label htmlFor="message">Message</Label>
        <Textarea id="message" rows={4} placeholder="Write a message" />
      </div>
    ),
    code: `<div className="grid gap-2">
  <Label htmlFor="message">Message</Label>
  <Textarea id="message" rows={4} placeholder="Write a message" />
</div>`,
  },
];

export default async function LabelPage() {
  const source = await readFile(
    path.join(process.cwd(), "registry/new-york/ui/label/index.tsx"),
    "utf8",
  );

  return (
    <ComponentReference
      title="Label"
      description="A visible name for a form control."
      overview={
        <>
          <p>
            Label renders a native label. It supplies the visible text for a
            control such as Input or Textarea. The control itself stays a
            separate component.
          </p>
          <p>
            Set <code>htmlFor</code> to the control&apos;s <code>id</code>. That
            link gives the control its accessible name. Label does not validate
            the field, store form state, report errors, or mark a field
            required.
          </p>
        </>
      }
      install="vinyaas add label"
      manual={
        <p>
          After <code>vinyaas init</code>, place the source at{" "}
          <code>components/ui/label/index.tsx</code>. It imports <code>cn</code>{" "}
          from <code>@/lib/utils</code>. The project also needs{" "}
          <code>clsx</code> and <code>tailwind-merge</code>.
        </p>
      }
      usage={usage}
      examples={examples}
      api={api}
      accessibility={
        <>
          <p>Label is a native label. It does not add an ARIA role.</p>
          <ul className="list-disc pl-5">
            <li>
              Use htmlFor, and give the control an id with the same value.
            </li>
            <li>Prefer a visible label for each form control.</li>
            <li>Placeholder text is not a replacement for the label.</li>
            <li>
              Clicking the label focuses the associated control. That is native
              browser behavior.
            </li>
          </ul>
        </>
      }
      source={source}
    >
      <div className="grid w-full max-w-sm gap-2 text-left">
        <Label htmlFor="email-preview">Email</Label>
        <Input id="email-preview" type="email" placeholder="you@example.com" />
      </div>
    </ComponentReference>
  );
}

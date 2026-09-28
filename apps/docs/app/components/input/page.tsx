import { readFile } from "node:fs/promises";
import path from "node:path";
import type { ApiRow } from "@/components/api-table";
import type { ComponentExample } from "@/components/component-reference";
import { ComponentReference } from "@/components/component-reference";
import { Input } from "@/registry/new-york/ui/input/input";
import type { Metadata } from "next";
import { componentPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = componentPageMetadata("input");

const usage = `import { Input } from "@/components/ui/input/input";

export function EmailField() {
  return (
    <label htmlFor="email" className="flex flex-col gap-2 text-sm">
      Email
      <Input id="email" name="email" type="email" placeholder="name@example.com" />
    </label>
  );
}
`;

const api: ApiRow[] = [
  {
    prop: "type",
    type: "string",
    defaultValue: '"text"',
    description: "Native input type.",
  },
  {
    prop: "className",
    type: "string",
    description: "Merged onto the input with cn.",
  },
  {
    prop: "disabled",
    type: "boolean",
    description:
      "Native disabled state. Uses a not-allowed cursor and reduced opacity.",
  },
  {
    prop: "placeholder",
    type: "string",
    description: "Placeholder text. It is not a label.",
  },
  {
    prop: "required",
    type: "boolean",
    description: "Native required state.",
  },
  {
    prop: "value",
    type: "string",
    description: "Controlled value. Pair it with onChange.",
  },
  {
    prop: "defaultValue",
    type: "string",
    description: "Uncontrolled initial value.",
  },
  {
    prop: "aria-invalid",
    type: '"true" | "false"',
    description: "Passed through. Input does not add a separate invalid color.",
  },
];

const examples: ComponentExample[] = [
  {
    id: "basic",
    title: "Basic",
    description: "A text input with an accessible name from aria-label.",
    preview: <Input aria-label="Name" placeholder="Ada Lovelace" />,
    code: `<Input aria-label="Name" placeholder="Ada Lovelace" />`,
  },
  {
    id: "email",
    title: "Email",
    description:
      "type controls the native input. Email asks for an email address.",
    preview: (
      <Input aria-label="Email" type="email" placeholder="name@example.com" />
    ),
    code: `<Input aria-label="Email" type="email" placeholder="name@example.com" />`,
  },
  {
    id: "label",
    title: "Label and description",
    description:
      "Associate a label with htmlFor and id. Point aria-describedby at the help text.",
    preview: (
      <div className="flex w-full max-w-sm flex-col gap-2 text-left">
        <label htmlFor="email-field" className="text-foreground text-sm">
          Email
        </label>
        <Input
          id="email-field"
          type="email"
          aria-describedby="email-hint"
          placeholder="name@example.com"
        />
        <p id="email-hint" className="text-muted-foreground text-sm">
          We use this for account recovery.
        </p>
      </div>
    ),
    code: `<label htmlFor="email-field">Email</label>
<Input
  id="email-field"
  type="email"
  aria-describedby="email-hint"
  placeholder="name@example.com"
/>
<p id="email-hint">We use this for account recovery.</p>`,
  },
  {
    id: "required",
    title: "Required",
    description:
      "required is the native constraint. The label should say that the field is required.",
    preview: <Input aria-label="Email, required" type="email" required />,
    code: `<Input aria-label="Email, required" type="email" required />`,
  },
  {
    id: "disabled",
    title: "Disabled",
    description:
      "A disabled input cannot be edited and uses the not-allowed cursor.",
    preview: (
      <Input aria-label="Email" defaultValue="ada@example.com" disabled />
    ),
    code: `<Input aria-label="Email" defaultValue="ada@example.com" disabled />`,
  },
  {
    id: "invalid",
    title: "Invalid",
    description:
      "aria-invalid is forwarded to the input. The component does not change its border for that state.",
    preview: (
      <Input
        aria-label="Email"
        type="email"
        defaultValue="not-an-email"
        aria-invalid="true"
      />
    ),
    code: `<Input
  aria-label="Email"
  type="email"
  defaultValue="not-an-email"
  aria-invalid="true"
/>`,
  },
];

export default async function InputPage() {
  const source = await readFile(
    path.join(process.cwd(), "registry/new-york/ui/input/input.tsx"),
    "utf8",
  );

  return (
    <ComponentReference
      title="Input"
      description="A text field that passes through native input attributes."
      overview={
        <p>
          Input renders a native input. The default type is text. It does not
          wrap the control, so labels, descriptions, and validation attributes
          use normal HTML.
        </p>
      }
      install="vinyaas add input"
      manual={
        <p>
          After <code>vinyaas init</code>, place the source at{" "}
          <code>components/ui/input/input.tsx</code>. It imports <code>cn</code>{" "}
          from <code>@/lib/utils</code>. The project also needs{" "}
          <code>clsx</code> and <code>tailwind-merge</code>.
        </p>
      }
      usage={usage}
      examples={examples}
      api={api}
      accessibility={
        <>
          <p>Input is a native input. It does not add an ARIA role.</p>
          <ul className="list-disc pl-5">
            <li>Name it with a label and matching id, or with aria-label.</li>
            <li>Placeholder text is not a replacement for the label.</li>
            <li>
              Use the native type, such as email or password, when it matches
              the data.
            </li>
            <li>
              disabled prevents editing. Focus uses a visible focus-visible
              ring.
            </li>
            <li>aria-invalid and aria-describedby are passed through.</li>
          </ul>
        </>
      }
      source={source}
    >
      <div className="w-full max-w-sm">
        <Input aria-label="Email" type="email" placeholder="name@example.com" />
      </div>
    </ComponentReference>
  );
}

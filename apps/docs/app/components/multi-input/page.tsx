import { readFile } from "node:fs/promises";
import path from "node:path";
import type { ApiRow } from "@/components/api-table";
import type {
  ComponentExample,
  ComponentInPractice,
} from "@/components/component-reference";
import { ComponentReference } from "@/components/component-reference";
import { Label } from "@/registry/new-york/ui/label";
import { MultiInput } from "@/registry/new-york/ui/multi-input";
import {
  InviteFormDemo,
  MultiInputPreview,
  ValidatedDemo,
} from "./multi-input-previews";
import type { Metadata } from "next";
import { componentPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = componentPageMetadata("multi-input");

const usage = `import { MultiInput } from "@/components/ui/multi-input";

export function Recipients() {
  return (
    <MultiInput
      aria-label="Recipients"
      placeholder="Add a recipient…"
      defaultValue={["ada@vinyaas.dev"]}
    />
  );
}
`;

const inviteFormCode = `"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { MultiInput } from "@/components/ui/multi-input";

const EMAIL = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;

export function InviteForm() {
  const [emails, setEmails] = useState<string[]>([]);

  return (
    <form
      className="grid w-full max-w-md gap-3 text-left"
      onSubmit={(event) => {
        event.preventDefault();
        // send the invites to \`emails\`
      }}
    >
      <Label htmlFor="invite-emails">Invite teammates</Label>
      <MultiInput
        id="invite-emails"
        name="emails"
        value={emails}
        onValueChange={setEmails}
        separators={[",", " "]}
        validate={(value) => EMAIL.test(value)}
        max={10}
        placeholder="ada@example.com"
      />
      <p className="text-muted-foreground text-sm">
        {emails.length} of 10 invites. Separate addresses with a comma or a
        space.
      </p>
      <Button type="submit" disabled={emails.length === 0}>
        Send invites
      </Button>
    </form>
  );
}
`;

const api: ApiRow[] = [
  {
    prop: "value",
    type: "string[]",
    description: "Controlled values. Pair it with onValueChange.",
  },
  {
    prop: "defaultValue",
    type: "string[]",
    defaultValue: "[]",
    description: "Starting values when the field is uncontrolled.",
  },
  {
    prop: "onValueChange",
    type: "(values: string[]) => void",
    description:
      "Fires with the next list whenever a value is added or removed.",
  },
  {
    prop: "separators",
    type: "string[]",
    defaultValue: '[","]',
    description:
      "Characters that end an entry while typing or pasting. Enter and blur always commit.",
  },
  {
    prop: "placeholder",
    type: "string",
    description: "Shown while the field holds no values.",
  },
  {
    prop: "max",
    type: "number",
    description:
      "Maximum number of values. Entries past the limit stay in the field.",
  },
  {
    prop: "validate",
    type: "(value: string) => boolean",
    description:
      "Return false to keep an entry in the field instead of committing it.",
  },
  {
    prop: "allowDuplicates",
    type: "boolean",
    defaultValue: "false",
    description: "Keeps repeated entries instead of dropping them.",
  },
  {
    prop: "disabled",
    type: "boolean",
    defaultValue: "false",
    description: "Disables the text input and every remove button.",
  },
  {
    prop: "invalid",
    type: "boolean",
    defaultValue: "false",
    description:
      "Marks the field invalid. A rejected entry also sets this on its own.",
  },
  {
    prop: "name",
    type: "string",
    description:
      "Submits one hidden input per value so the field works in a native form.",
  },
  {
    prop: "id",
    type: "string",
    description: "Applied to the inner text input so a Label can point at it.",
  },
];

const examples: ComponentExample[] = [
  {
    id: "default",
    title: "Default",
    description:
      "Type an entry and press Enter, or end it with a comma. Backspace in an empty field removes the last value.",
    preview: (
      <MultiInput
        aria-label="Tags"
        className="max-w-sm"
        placeholder="Add a tag…"
      />
    ),
    code: `import { MultiInput } from "@/components/ui/multi-input";

export function Tags() {
  return <MultiInput aria-label="Tags" placeholder="Add a tag…" />;
}
`,
  },
  {
    id: "labeled",
    title: "With a label",
    description: "id points the Label at the inner text input.",
    preview: (
      <div className="grid max-w-sm gap-2">
        <Label htmlFor="docs-topics">Topics</Label>
        <MultiInput
          id="docs-topics"
          defaultValue={["forms", "accessibility"]}
          placeholder="Add a topic…"
        />
      </div>
    ),
    code: `import { Label } from "@/components/ui/label";
import { MultiInput } from "@/components/ui/multi-input";

export function Topics() {
  return (
    <div className="grid gap-2">
      <Label htmlFor="topics">Topics</Label>
      <MultiInput
        id="topics"
        defaultValue={["forms", "accessibility"]}
        placeholder="Add a topic…"
      />
    </div>
  );
}
`,
  },
  {
    id: "separators",
    title: "Separators",
    description:
      "Any listed character ends an entry, so a pasted list splits into values in one step.",
    preview: (
      <MultiInput
        aria-label="Emails"
        className="max-w-sm"
        separators={[",", " ", ";"]}
        placeholder="Paste a list of addresses"
      />
    ),
    code: `import { MultiInput } from "@/components/ui/multi-input";

export function Emails() {
  return (
    <MultiInput
      aria-label="Emails"
      separators={[",", " ", ";"]}
      placeholder="Paste a list of addresses"
    />
  );
}
`,
  },
  {
    id: "validate",
    title: "Validation",
    description:
      "A rejected entry stays in the field and marks it invalid, so the text can be corrected instead of lost.",
    preview: <ValidatedDemo />,
    code: `import { MultiInput } from "@/components/ui/multi-input";

const EMAIL = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;

export function Recipients() {
  return (
    <MultiInput
      aria-label="Email recipients"
      validate={(value) => EMAIL.test(value)}
      placeholder="ada@example.com"
    />
  );
}
`,
  },
  {
    id: "max",
    title: "Limit",
    description:
      "max caps the list. Entries past the limit stay in the field until a value is removed.",
    preview: (
      <MultiInput
        aria-label="Skills"
        className="max-w-sm"
        max={3}
        defaultValue={["typescript", "react"]}
        placeholder="One more…"
      />
    ),
    code: `import { MultiInput } from "@/components/ui/multi-input";

export function Skills() {
  return (
    <MultiInput
      aria-label="Skills"
      max={3}
      defaultValue={["typescript", "react"]}
      placeholder="One more…"
    />
  );
}
`,
  },
  {
    id: "states",
    title: "Invalid and disabled",
    description:
      "Both states match Input, so the field sits in a form unchanged.",
    preview: (
      <div className="grid max-w-sm gap-3">
        <MultiInput aria-label="Invalid tags" defaultValue={["one"]} invalid />
        <MultiInput
          aria-label="Disabled tags"
          defaultValue={["one", "two"]}
          disabled
        />
      </div>
    ),
    code: `import { MultiInput } from "@/components/ui/multi-input";

export function States() {
  return (
    <div className="grid gap-3">
      <MultiInput aria-label="Invalid tags" defaultValue={["one"]} invalid />
      <MultiInput aria-label="Disabled tags" defaultValue={["one", "two"]} disabled />
    </div>
  );
}
`,
  },
];

const inPractice: ComponentInPractice = {
  description:
    "An invite form collects addresses with a comma or a space, validates each one as it is committed, and caps the list at ten.",
  preview: <InviteFormDemo />,
  code: inviteFormCode,
};

export default async function MultiInputPage() {
  const source = await readFile(
    path.join(process.cwd(), "registry/new-york/ui/multi-input/index.tsx"),
    "utf8",
  );

  return (
    <ComponentReference
      title="Multi Input"
      description="A field that collects several values as removable chips in one row."
      overview={
        <>
          <p>
            MultiInput is one field that holds a list. Each committed entry
            becomes a chip with its own remove button, and the text input stays
            on the same row so the field grows downward as the list fills.
          </p>
          <p>
            An entry is committed by Enter, by typing or pasting one of the{" "}
            <code>separators</code>, or by leaving the field. Entries are
            trimmed, blanks are dropped, and repeats are ignored unless{" "}
            <code>allowDuplicates</code> is set. Pass <code>name</code> to
            submit the list through a native form, or <code>value</code> and{" "}
            <code>onValueChange</code> to drive it from state.
          </p>
        </>
      }
      install="vinyaas add multi-input"
      manual={
        <p>
          After <code>vinyaas init</code>, place the source at{" "}
          <code>components/ui/multi-input/index.tsx</code>. It imports{" "}
          <code>cn</code> from <code>@/lib/utils</code>. The project also needs{" "}
          <code>clsx</code> and <code>tailwind-merge</code>.
        </p>
      }
      usage={usage}
      examples={examples}
      inPractice={inPractice}
      api={api}
      livePreview={MultiInputPreview}
      controlOverrides={{
        value: { exclude: true },
        defaultValue: { exclude: true },
        separators: { exclude: true },
        name: { exclude: true },
        id: { exclude: true },
        max: { min: 2, max: 8, default: 6 },
        placeholder: { default: "Add a team…" },
      }}
      accessibility={
        <ul className="list-disc pl-5">
          <li>
            Name the field with <code>aria-label</code>, or give it an{" "}
            <code>id</code> and point a Label at it.
          </li>
          <li>
            Each remove button is a native button in the tab order, named{" "}
            <code>Remove {"{value}"}</code>, so the list can be emptied without
            a pointer.
          </li>
          <li>
            Backspace in an empty field removes the last value — a shortcut, not
            the only way to remove one.
          </li>
          <li>
            A rejected entry sets <code>aria-invalid</code> on the text input.
            Pair it with your own message when the reason is not obvious.
          </li>
        </ul>
      }
      source={source}
    >
      <MultiInput
        aria-label="Recipients"
        className="max-w-sm"
        defaultValue={["design", "engineering"]}
        placeholder="Add a team…"
      />
    </ComponentReference>
  );
}

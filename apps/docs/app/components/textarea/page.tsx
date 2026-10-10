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
import { Textarea } from "@/registry/new-york/ui/textarea";
import type { Metadata } from "next";
import { componentPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = componentPageMetadata("textarea");

const usage = `import { Textarea } from "@/components/ui/textarea";

export function MessageField() {
  return (
    <label htmlFor="message" className="flex flex-col gap-2 text-sm">
      Message
      <Textarea id="message" name="message" rows={4} placeholder="Write a message" />
    </label>
  );
}
`;

const inPracticeSource = `import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function FeedbackForm() {
  return (
    <form className="grid w-full max-w-md gap-4 text-left">
      <div className="grid gap-2">
        <Label htmlFor="feedback">Message</Label>
        <Textarea
          id="feedback"
          name="feedback"
          rows={4}
          placeholder="What should we improve next?"
          defaultValue="The homepage showcase makes it clear which components to reach for."
        />
      </div>
      <div className="flex flex-col gap-2 sm:flex-row">
        <Button type="submit">Send feedback</Button>
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
    prop: "className",
    type: "string",
    description: "Merged onto the textarea with cn.",
  },
  {
    prop: "showCount",
    type: "boolean",
    defaultValue: "false",
    description:
      "Shows a current/maxLength counter below the field, aligned right. Without maxLength it shows only the current length.",
  },
  {
    prop: "containerClassName",
    type: "string",
    description:
      "Merged onto the wrapper that holds the field and counter when showCount is set.",
  },
  {
    prop: "rows",
    type: "number",
    description: "Native row count. The field also has a minimum height.",
  },
  {
    prop: "cols",
    type: "number",
    description: "Native column count.",
  },
  {
    prop: "disabled",
    type: "boolean",
    description:
      "Native disabled state. Uses a not-allowed cursor and reduced opacity.",
  },
  {
    prop: "required",
    type: "boolean",
    description: "Native required state.",
  },
  {
    prop: "placeholder",
    type: "string",
    description: "Placeholder text. It is not a label.",
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
    description:
      "Passed through. Textarea does not add a separate invalid color.",
  },
];

const examples: ComponentExample[] = [
  {
    id: "basic",
    title: "Basic",
    description: "A multiline field. It can be resized vertically.",
    preview: <Textarea aria-label="Message" placeholder="Write a message" />,
    code: `<Textarea aria-label="Message" placeholder="Write a message" />`,
  },
  {
    id: "character-count",
    title: "Character count",
    description:
      "With maxLength and showCount, the current length and limit show below the field on the right. The counter turns destructive at the limit and is linked with aria-describedby.",
    preview: (
      <div className="w-full max-w-sm">
        <Textarea
          aria-label="Bio"
          placeholder="Tell us about yourself"
          maxLength={120}
          showCount
          defaultValue="Building accessible UI."
        />
      </div>
    ),
    code: `<Textarea
  aria-label="Bio"
  placeholder="Tell us about yourself"
  maxLength={120}
  showCount
/>`,
  },
  {
    id: "label",
    title: "Label",
    description: "Associate the label with htmlFor and id.",
    preview: (
      <div className="flex w-full max-w-sm flex-col gap-2 text-left">
        <label htmlFor="message-field" className="text-foreground text-sm">
          Message
        </label>
        <Textarea id="message-field" rows={4} placeholder="Write a message" />
      </div>
    ),
    code: `<label htmlFor="message-field">Message</label>
<Textarea id="message-field" rows={4} placeholder="Write a message" />`,
  },
  {
    id: "description",
    title: "Description",
    description: "aria-describedby connects the help text to the field.",
    preview: (
      <div className="flex w-full max-w-sm flex-col gap-2 text-left">
        <label htmlFor="notes" className="text-foreground text-sm">
          Notes
        </label>
        <Textarea id="notes" rows={4} aria-describedby="notes-hint" />
        <p id="notes-hint" className="text-muted-foreground text-sm">
          Visible to the project team.
        </p>
      </div>
    ),
    code: `<label htmlFor="notes">Notes</label>
<Textarea id="notes" rows={4} aria-describedby="notes-hint" />
<p id="notes-hint">Visible to the project team.</p>`,
  },
  {
    id: "rows",
    title: "Rows",
    description:
      "rows sets the initial height. The field still has a minimum height from its styles.",
    preview: (
      <Textarea aria-label="Message" rows={6} placeholder="A taller field" />
    ),
    code: `<Textarea aria-label="Message" rows={6} placeholder="A taller field" />`,
  },
  {
    id: "required",
    title: "Required",
    description: "required is the native constraint.",
    preview: <Textarea aria-label="Message, required" required rows={4} />,
    code: `<Textarea aria-label="Message, required" required rows={4} />`,
  },
  {
    id: "disabled",
    title: "Disabled",
    description:
      "A disabled textarea cannot be edited and uses the not-allowed cursor.",
    preview: (
      <Textarea aria-label="Message" defaultValue="Locked note" disabled />
    ),
    code: `<Textarea aria-label="Message" defaultValue="Locked note" disabled />`,
  },
  {
    id: "invalid",
    title: "Invalid",
    description:
      "aria-invalid is forwarded. Textarea does not change its border for that state.",
    preview: (
      <Textarea
        aria-label="Message"
        defaultValue="Too short"
        aria-invalid="true"
      />
    ),
    code: `<Textarea aria-label="Message" defaultValue="Too short" aria-invalid="true" />`,
  },
];

const inPractice: ComponentInPractice = {
  description:
    "A feedback note with a labelled textarea and Submit and Cancel actions.",
  preview: (
    <form className="grid w-full max-w-md gap-4 text-left">
      <div className="grid gap-2">
        <Label htmlFor="practice-feedback">Message</Label>
        <Textarea
          id="practice-feedback"
          name="feedback"
          rows={4}
          placeholder="What should we improve next?"
          defaultValue="The homepage showcase makes it clear which components to reach for."
        />
      </div>
      <div className="flex flex-col gap-2 sm:flex-row">
        <Button type="submit">Send feedback</Button>
        <Button type="button" variant="outline">
          Cancel
        </Button>
      </div>
    </form>
  ),
  code: inPracticeSource,
};

export default async function TextareaPage() {
  const source = await readFile(
    path.join(process.cwd(), "registry/new-york/ui/textarea/index.tsx"),
    "utf8",
  );

  return (
    <ComponentReference
      title="Textarea"
      description="A multiline text field that passes through native textarea attributes."
      overview={
        <p>
          Textarea renders a native textarea. It uses the same border, type
          size, focus ring, and disabled treatment as Input, with a minimum
          height and vertical resizing.
        </p>
      }
      install="vinyaas add textarea"
      manual={
        <p>
          After <code>vinyaas init</code>, place the source at{" "}
          <code>components/ui/textarea/index.tsx</code>. It imports{" "}
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
          <p>Textarea is a native textarea. It does not add an ARIA role.</p>
          <ul className="list-disc pl-5">
            <li>Name it with a label and matching id, or with aria-label.</li>
            <li>Placeholder text is not a replacement for the label.</li>
            <li>
              Keyboard behavior is the browser default, including line breaks.
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
        <label htmlFor="message" className="text-foreground mb-2 block text-sm">
          Message
        </label>
        <Textarea
          id="message"
          name="message"
          rows={4}
          placeholder="Write a message"
        />
      </div>
    </ComponentReference>
  );
}

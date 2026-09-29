import { readFile } from "node:fs/promises";
import path from "node:path";
import type { ApiRow } from "@/components/api-table";
import type { ComponentExample } from "@/components/component-reference";
import { ComponentReference } from "@/components/component-reference";
import { RefreshIcon } from "@/components/icons";
import { Spinner } from "@/registry/new-york/ui/spinner";
import { SubmitSpinner, FormSubmitSpinner } from "./spinner-demos";
import type { Metadata } from "next";
import { componentPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = componentPageMetadata("spinner");

const usage = `import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

export function SaveAction() {
  const [pending, setPending] = useState(false);

  return (
    <Button
      type="button"
      className="gap-2"
      disabled={pending}
      onClick={() => {
        setPending(true);
        window.setTimeout(() => setPending(false), 1200);
      }}
    >
      {pending ? <Spinner label="" /> : null}
      {pending ? "Saving changes" : "Save changes"}
    </Button>
  );
}
`;

const api: ApiRow[] = [
  {
    prop: "label",
    type: "string",
    defaultValue: '"Loading"',
    description:
      "Text for assistive technology. The spinning graphic stays hidden from it.",
  },
  {
    prop: "className",
    type: "string",
    description: "Merged onto the graphic. Use it for size and color.",
  },
];

const examples: ComponentExample[] = [
  {
    id: "in-a-button",
    title: "In a button",
    description:
      "A pending action keeps its label and shows the spinner while work runs.",
    preview: <SubmitSpinner />,
    code: usage,
  },
  {
    id: "standalone",
    title: "Refreshing",
    description: "Pair the spinner with the work that is in progress.",
    preview: (
      <span className="inline-flex items-center gap-2 text-sm">
        <Spinner label="Refreshing data" />
        Refreshing data...
      </span>
    ),
    code: `import { Spinner } from "@/components/ui/spinner";

export function RefreshingData() {
  return (
    <span className="inline-flex items-center gap-2 text-sm">
      <Spinner label="Refreshing data" />
      Refreshing data...
    </span>
  );
}
`,
  },
  {
    id: "form-submit",
    title: "Form submit",
    description: "The submit button shows a spinner while the form is pending.",
    preview: <FormSubmitSpinner />,
    code: `import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

export function SubmitSpinner() {
  const [pending, setPending] = useState(false);

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        setPending(true);
        window.setTimeout(() => setPending(false), 1200);
      }}
    >
      <Button type="submit" className="gap-2" disabled={pending}>
        {pending ? <Spinner label="" /> : null}
        {pending ? "Saving" : "Save"}
      </Button>
    </form>
  );
}
`,
  },
  {
    id: "custom-icon",
    title: "Customization",
    description:
      "Swap the default graphic for another icon component. The label names the work that is in progress.",
    preview: (
      <span className="inline-flex items-center gap-2 text-sm">
        <RefreshIcon className="size-4 animate-spin motion-reduce:animate-none" />
        Refreshing data...
      </span>
    ),
    code: `import { RefreshIcon } from "@/components/icons";

export function RefreshingNote() {
  return (
    <span className="inline-flex items-center gap-2 text-sm">
      <RefreshIcon className="size-4 animate-spin motion-reduce:animate-none" />
      Refreshing data...
    </span>
  );
}
`,
  },
];

export default async function SpinnerPage() {
  const source = await readFile(
    path.join(process.cwd(), "registry/new-york/ui/spinner/index.tsx"),
    "utf8",
  );

  return (
    <ComponentReference
      title="Spinner"
      description="A small loading indicator."
      overview={
        <p>
          Spinner is a decorative graphic with a text alternative. Size it with{" "}
          <code>className</code>. Replace the svg inside the component when you
          want a different icon. The spin stops when the user prefers reduced
          motion.
        </p>
      }
      install="vinyaas add spinner"
      manual={
        <p>
          After <code>vinyaas init</code>, place the source at{" "}
          <code>components/ui/spinner/index.tsx</code>. It imports{" "}
          <code>cn</code> from <code>@/lib/utils</code>. The project also needs{" "}
          <code>clsx</code> and <code>tailwind-merge</code>.
        </p>
      }
      usage={usage}
      examples={examples}
      api={api}
      accessibility={
        <ul className="list-disc pl-5">
          <li>
            The graphic is <code>aria-hidden</code>. The label is the accessible
            name, in a status element.
          </li>
          <li>
            <code>motion-reduce:animate-none</code> stops the spin when reduced
            motion is requested.
          </li>
        </ul>
      }
      source={source}
    >
      <SubmitSpinner />
    </ComponentReference>
  );
}

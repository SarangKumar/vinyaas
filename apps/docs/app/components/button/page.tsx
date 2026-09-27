import { readFile } from "node:fs/promises";
import path from "node:path";

import type { ApiRow } from "@/components/api-table";
import type { ComponentExample } from "@/components/component-reference";
import { ComponentReference } from "@/components/component-reference";
import { Button } from "@/registry/new-york/ui/button/button";

const usage = `import { Button } from "@/components/ui/button/button";

export function SaveButton() {
  return <Button>Save</Button>;
}
`;

const api: ApiRow[] = [
  {
    prop: "variant",
    type: '"default" | "outline" | "destructive"',
    defaultValue: '"default"',
    description: "Visual style.",
  },
  {
    prop: "size",
    type: '"sm" | "md" | "lg"',
    defaultValue: '"md"',
    description:
      "sm is h-8, md is h-9, and lg is h-10. md matches Input. Text stays text-sm.",
  },
  {
    prop: "className",
    type: "string",
    description: "Merged onto the button with cn.",
  },
  {
    prop: "disabled",
    type: "boolean",
    description:
      "Native disabled state. Uses a not-allowed cursor and reduced opacity.",
  },
  {
    prop: "type",
    type: '"button" | "submit" | "reset"',
    defaultValue: '"button"',
    description: "A passed type replaces the default.",
  },
  {
    prop: "children",
    type: "ReactNode",
    description:
      "Visible button content. This is the accessible name when no other name is provided.",
  },
];

const examples: ComponentExample[] = [
  {
    id: "default",
    title: "Default",
    description: "The default variant is a solid button at the md size.",
    preview: <Button>Save</Button>,
    code: `<Button>Save</Button>`,
  },
  {
    id: "outline",
    title: "Outline",
    description:
      "Outline keeps the button border and uses the page background.",
    preview: <Button variant="outline">Cancel</Button>,
    code: `<Button variant="outline">Cancel</Button>`,
  },
  {
    id: "destructive",
    title: "Destructive",
    description: "Destructive is for an irreversible action such as delete.",
    preview: <Button variant="destructive">Delete</Button>,
    code: `<Button variant="destructive">Delete</Button>`,
  },
  {
    id: "disabled",
    title: "Disabled",
    description: "Disabled blocks activation and shows the not-allowed cursor.",
    preview: <Button disabled>Save</Button>,
    code: `<Button disabled>Save</Button>`,
  },
  {
    id: "sizes",
    title: "Sizes",
    description:
      "sm is the compact height, md is the default and matches Input, and lg is taller.",
    preview: (
      <>
        <Button size="sm">Small</Button>
        <Button size="md">Medium</Button>
        <Button size="lg">Large</Button>
      </>
    ),
    code: `<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>`,
  },
];

export default async function ButtonPage() {
  const source = await readFile(
    path.join(process.cwd(), "registry/new-york/ui/button/button.tsx"),
    "utf8",
  );

  return (
    <ComponentReference
      title="Button"
      description="A button with variant and size styles."
      overview={
        <p>
          Button renders a native button. Variants and sizes are the only style
          options. Other button attributes, including click handlers and ARIA
          attributes, are passed through.
        </p>
      }
      install="vinyaas add button"
      manual={
        <p>
          After <code>vinyaas init</code>, place the source at{" "}
          <code>components/ui/button/button.tsx</code>. It imports{" "}
          <code>cn</code> from <code>@/lib/utils</code>. The project also needs{" "}
          <code>class-variance-authority</code>, <code>clsx</code>, and{" "}
          <code>tailwind-merge</code>.
        </p>
      }
      usage={usage}
      examples={examples}
      api={api}
      accessibility={
        <>
          <p>Button is a native button. It does not use a clickable div.</p>
          <ul className="list-disc pl-5">
            <li>Enter and Space activate it when it has focus.</li>
            <li>
              The visible children are the accessible name unless another name
              is set.
            </li>
            <li>
              disabled prevents activation. The control stays in the
              accessibility tree.
            </li>
            <li>
              Focus uses a visible focus-visible ring. Mouse clicks do not show
              that ring.
            </li>
          </ul>
        </>
      }
      source={source}
    >
      <Button>Save</Button>
      <Button variant="outline">Cancel</Button>
      <Button variant="destructive">Delete</Button>
    </ComponentReference>
  );
}

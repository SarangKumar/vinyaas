import { readFile } from "node:fs/promises";
import path from "node:path";

import type { ApiRow } from "@/components/api-table";
import type { ComponentExample } from "@/components/component-reference";
import { ComponentReference } from "@/components/component-reference";
import { Button } from "@/registry/new-york/ui/button/button";
import { Input } from "@/registry/new-york/ui/input/input";
import { Label } from "@/registry/new-york/ui/label/label";

const usage = `import { Button } from "@/components/ui/button/button";

export function SaveButton() {
  return <Button>Save</Button>;
}
`;

const saveSource = {
  tsx: `import { Button } from "@/components/ui/button/button";
import { Input } from "@/components/ui/input/input";
import { Label } from "@/components/ui/label/label";

export function SaveName() {
  return (
    <form className="flex items-end gap-3">
      <div className="grid gap-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" defaultValue="Ada Lovelace" />
      </div>
      <Button type="submit">Save</Button>
    </form>
  );
}
`,
  jsx: `import { Button } from "@/components/ui/button/button";
import { Input } from "@/components/ui/input/input";
import { Label } from "@/components/ui/label/label";

export function SaveName() {
  return (
    <form className="flex items-end gap-3">
      <div className="grid gap-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" defaultValue="Ada Lovelace" />
      </div>
      <Button type="submit">Save</Button>
    </form>
  );
}
`,
};

const api: ApiRow[] = [
  {
    prop: "variant",
    type: '"default" | "outline" | "ghost" | "destructive" | "secondary" | "link"',
    defaultValue: '"default"',
    description: "Visual style.",
  },
  {
    prop: "size",
    type: '"default" | "xs" | "sm" | "lg" | "icon" | "icon-xs" | "icon-sm" | "icon-lg"',
    defaultValue: '"default"',
    description:
      "default is h-9 and matches Input. xs is h-7, sm is h-8, and lg is h-10. Icon sizes are square.",
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
    id: "with-a-field",
    title: "With a field",
    description:
      "The default button is the same height as Input, so a label, a field, and Save sit on one line.",
    preview: (
      <form className="flex items-end gap-3">
        <div className="grid gap-2">
          <Label htmlFor="button-name">Name</Label>
          <Input id="button-name" defaultValue="Ada Lovelace" />
        </div>
        <Button type="submit">Save</Button>
      </form>
    ),
    code: saveSource,
  },
  {
    id: "variants",
    title: "Variants",
    description:
      "Outline, ghost, and secondary are quiet actions. Destructive is for delete. Link is inline.",
    preview: (
      <>
        <Button>Save</Button>
        <Button variant="outline">Cancel</Button>
        <Button variant="ghost">Skip</Button>
        <Button variant="secondary">Draft</Button>
        <Button variant="destructive">Delete</Button>
        <Button variant="link">Learn more</Button>
      </>
    ),
    code: `import { Button } from "@/components/ui/button/button";

export function Actions() {
  return (
    <>
      <Button>Save</Button>
      <Button variant="outline">Cancel</Button>
      <Button variant="ghost">Skip</Button>
      <Button variant="secondary">Draft</Button>
      <Button variant="destructive">Delete</Button>
      <Button variant="link">Learn more</Button>
    </>
  );
}
`,
  },
  {
    id: "sizes",
    title: "Sizes",
    description:
      "default matches Input. xs, sm, and lg change the text button. Icon sizes are square.",
    preview: (
      <>
        <Button size="xs">Extra small</Button>
        <Button size="sm">Small</Button>
        <Button>Default</Button>
        <Button size="lg">Large</Button>
        <Button size="icon" aria-label="Add">
          +
        </Button>
      </>
    ),
    code: `import { Button } from "@/components/ui/button/button";

export function Sizes() {
  return (
    <>
      <Button size="xs">Extra small</Button>
      <Button size="sm">Small</Button>
      <Button>Default</Button>
      <Button size="lg">Large</Button>
      <Button size="icon" aria-label="Add">
        +
      </Button>
    </>
  );
}
`,
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
      <Button variant="secondary">Draft</Button>
      <Button variant="destructive">Delete</Button>
    </ComponentReference>
  );
}

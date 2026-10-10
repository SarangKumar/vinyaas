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
import { Input } from "@/registry/new-york/ui/input";
import { Label } from "@/registry/new-york/ui/label";
import type { Metadata } from "next";
import { componentPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = componentPageMetadata("button");

const usage = `import { Button } from "@/components/ui/button";

export function SaveButton() {
  return <Button>Save</Button>;
}
`;

const withFieldSource = {
  tsx: `import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function SaveName() {
  return (
    <form className="flex flex-col gap-3 sm:flex-row sm:items-end">
      <div className="grid min-w-0 flex-1 gap-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" defaultValue="Ada Lovelace" />
      </div>
      <Button type="submit">Save</Button>
    </form>
  );
}
`,
  jsx: `import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function SaveName() {
  return (
    <form className="flex flex-col gap-3 sm:flex-row sm:items-end">
      <div className="grid min-w-0 flex-1 gap-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" defaultValue="Ada Lovelace" />
      </div>
      <Button type="submit">Save</Button>
    </form>
  );
}
`,
};

const inPracticeSource = {
  tsx: `import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AccountForm() {
  return (
    <form className="grid w-full max-w-md gap-4 text-left">
      <div className="grid gap-2">
        <Label htmlFor="display-name">Display name</Label>
        <Input id="display-name" defaultValue="Ada Lovelace" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="account-email">Email</Label>
        <Input
          id="account-email"
          type="email"
          defaultValue="ada@analytical.engine"
        />
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="directory" defaultChecked />
        <Label htmlFor="directory">Show profile in the directory</Label>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row">
        <Button type="submit">Save changes</Button>
        <Button type="button" variant="outline">
          Cancel
        </Button>
      </div>
    </form>
  );
}
`,
  jsx: `import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AccountForm() {
  return (
    <form className="grid w-full max-w-md gap-4 text-left">
      <div className="grid gap-2">
        <Label htmlFor="display-name">Display name</Label>
        <Input id="display-name" defaultValue="Ada Lovelace" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="account-email">Email</Label>
        <Input
          id="account-email"
          type="email"
          defaultValue="ada@analytical.engine"
        />
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="directory" defaultChecked />
        <Label htmlFor="directory">Show profile in the directory</Label>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row">
        <Button type="submit">Save changes</Button>
        <Button type="button" variant="outline">
          Cancel
        </Button>
      </div>
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
    id: "variants",
    title: "Variants",
    description:
      "Outline, ghost, and secondary are quiet actions. Destructive is for delete. Link is inline.",
    preview: (
      <div className="flex flex-wrap items-center justify-center gap-4">
        <Button>Save</Button>
        <Button variant="outline">Cancel</Button>
        <Button variant="ghost">Skip</Button>
        <Button variant="secondary">Draft</Button>
        <Button variant="destructive">Delete</Button>
        <Button variant="link">Learn more</Button>
      </div>
    ),
    code: `import { Button } from "@/components/ui/button";

export function Actions() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      <Button>Save</Button>
      <Button variant="outline">Cancel</Button>
      <Button variant="ghost">Skip</Button>
      <Button variant="secondary">Draft</Button>
      <Button variant="destructive">Delete</Button>
      <Button variant="link">Learn more</Button>
    </div>
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
      <div className="flex flex-wrap items-center justify-center gap-4">
        <Button size="xs">Extra small</Button>
        <Button size="sm">Small</Button>
        <Button>Default</Button>
        <Button size="lg">Large</Button>
        <Button size="icon" aria-label="Add">
          +
        </Button>
      </div>
    ),
    code: `import { Button } from "@/components/ui/button";

export function Sizes() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      <Button size="xs">Extra small</Button>
      <Button size="sm">Small</Button>
      <Button>Default</Button>
      <Button size="lg">Large</Button>
      <Button size="icon" aria-label="Add">
        +
      </Button>
    </div>
  );
}
`,
  },
  {
    id: "with-a-field",
    title: "With a field",
    description:
      "The default button is the same height as Input, so a label, a field, and Save sit on one line on wider screens.",
    preview: (
      <form className="flex w-full max-w-md flex-col gap-3 sm:flex-row sm:items-end">
        <div className="grid min-w-0 flex-1 gap-2">
          <Label htmlFor="button-name">Name</Label>
          <Input id="button-name" defaultValue="Ada Lovelace" />
        </div>
        <Button type="submit">Save</Button>
      </form>
    ),
    code: withFieldSource,
  },
];

const inPractice: ComponentInPractice = {
  description:
    "Save and Cancel close an account form. Labels, inputs, and a directory checkbox sit above the actions.",
  preview: (
    <form className="grid w-full max-w-md gap-4 text-left">
      <div className="grid gap-2">
        <Label htmlFor="practice-display-name">Display name</Label>
        <Input id="practice-display-name" defaultValue="Ada Lovelace" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="practice-account-email">Email</Label>
        <Input
          id="practice-account-email"
          type="email"
          defaultValue="ada@analytical.engine"
        />
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="practice-directory" defaultChecked />
        <Label htmlFor="practice-directory">
          Show profile in the directory
        </Label>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row">
        <Button type="submit">Save changes</Button>
        <Button type="button" variant="outline">
          Cancel
        </Button>
      </div>
    </form>
  ),
  code: inPracticeSource,
};

export default async function ButtonPage() {
  const source = await readFile(
    path.join(process.cwd(), "registry/new-york/ui/button/index.tsx"),
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
          <code>components/ui/button/index.tsx</code>. It imports{" "}
          <code>cn</code> from <code>@/lib/utils</code>. The project also needs{" "}
          <code>class-variance-authority</code>, <code>clsx</code>, and{" "}
          <code>tailwind-merge</code>.
        </p>
      }
      usage={usage}
      examples={examples}
      inPractice={inPractice}
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

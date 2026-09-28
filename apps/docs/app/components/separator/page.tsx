import { readFile } from "node:fs/promises";
import path from "node:path";
import type { ApiRow } from "@/components/api-table";
import type { ComponentExample } from "@/components/component-reference";
import { ComponentReference } from "@/components/component-reference";
import { Separator } from "@/registry/new-york/ui/separator/separator";
import type { Metadata } from "next";
import { componentPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = componentPageMetadata("separator");

const usage = `import { Separator } from "@/components/ui/separator/separator";

export function SectionBreak() {
  return <Separator />;
}
`;

const api: ApiRow[] = [
  {
    prop: "orientation",
    type: '"horizontal" | "vertical"',
    defaultValue: '"horizontal"',
    description:
      "Horizontal renders an hr. Vertical renders a separator with aria-orientation.",
  },
  {
    prop: "className",
    type: "string",
    description: "Merged onto the separator with cn.",
  },
];

const examples: ComponentExample[] = [
  {
    id: "horizontal",
    title: "Horizontal",
    description: "A horizontal rule separates stacked sections.",
    preview: (
      <div className="grid w-full max-w-sm gap-3 text-left text-sm">
        <p>Account</p>
        <Separator />
        <p>Billing</p>
      </div>
    ),
    code: `<div className="grid gap-3">
  <p>Account</p>
  <Separator />
  <p>Billing</p>
</div>`,
  },
  {
    id: "vertical",
    title: "Vertical",
    description:
      "A vertical separator divides items in a row. It sets aria-orientation so it is not announced as a horizontal rule.",
    preview: (
      <div className="flex h-5 items-center gap-3 text-sm">
        <span>Docs</span>
        <Separator orientation="vertical" />
        <span>Components</span>
      </div>
    ),
    code: `<div className="flex h-5 items-center gap-3">
  <span>Docs</span>
  <Separator orientation="vertical" />
  <span>Components</span>
</div>`,
  },
  {
    id: "grouping",
    title: "Grouping",
    description:
      "Use separators to group related items without extra headings.",
    preview: (
      <div className="flex items-center gap-3 text-sm">
        <span>Blog</span>
        <Separator orientation="vertical" />
        <span>Docs</span>
        <Separator orientation="vertical" />
        <span>Changelog</span>
      </div>
    ),
    code: `<div className="flex items-center gap-3">
  <span>Blog</span>
  <Separator orientation="vertical" />
  <span>Docs</span>
  <Separator orientation="vertical" />
  <span>Changelog</span>
</div>`,
  },
];

export default async function SeparatorPage() {
  const source = await readFile(
    path.join(process.cwd(), "registry/new-york/ui/separator/separator.tsx"),
    "utf8",
  );

  return (
    <ComponentReference
      title="Separator"
      description="A horizontal or vertical divider between content."
      overview={
        <>
          <p>
            Separator divides adjacent content. The default is a native{" "}
            <code>hr</code>. A vertical separator is a{" "}
            <code>role=&quot;separator&quot;</code> element, because an{" "}
            <code>hr</code> is a horizontal break.
          </p>
        </>
      }
      install="vinyaas add separator"
      manual={
        <p>
          After <code>vinyaas init</code>, place the source at{" "}
          <code>components/ui/separator/separator.tsx</code>. It imports{" "}
          <code>cn</code> from <code>@/lib/utils</code>. The project also needs{" "}
          <code>clsx</code> and <code>tailwind-merge</code>.
        </p>
      }
      usage={usage}
      examples={examples}
      api={api}
      accessibility={
        <>
          <p>
            A horizontal separator is an <code>hr</code>. Its separator role and
            horizontal orientation come from the element, so the component does
            not add <code>role</code> or <code>aria-orientation</code>.
          </p>
          <ul className="list-disc pl-5">
            <li>
              Vertical sets <code>role=&quot;separator&quot;</code> and{" "}
              <code>aria-orientation=&quot;vertical&quot;</code>.
            </li>
            <li>
              The default vertical line is 16px tall. Override the height with{" "}
              <code>className</code> when the row is taller.
            </li>
          </ul>
        </>
      }
      source={source}
    >
      <div className="grid w-full max-w-sm gap-3 text-sm">
        <p>Account</p>
        <Separator />
        <div className="flex h-5 items-center gap-3">
          <span>Docs</span>
          <Separator orientation="vertical" />
          <span>Components</span>
        </div>
      </div>
    </ComponentReference>
  );
}

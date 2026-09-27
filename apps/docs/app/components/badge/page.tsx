import { readFile } from "node:fs/promises";
import path from "node:path";

import type { ApiRow } from "@/components/api-table";
import type { ComponentExample } from "@/components/component-reference";
import { ComponentReference } from "@/components/component-reference";
import { Badge } from "@/registry/new-york/ui/badge/badge";
import { Button } from "@/registry/new-york/ui/button/button";

const usage = `import { Badge } from "@/components/ui/badge/badge";

export function Plan() {
  return <Badge>Pro</Badge>;
}
`;

const api: ApiRow[] = [
  {
    prop: "variant",
    type: '"default" | "secondary" | "outline" | "destructive"',
    defaultValue: '"default"',
    description: "Visual style.",
  },
  {
    prop: "className",
    type: "string",
    description: "Merged onto the badge.",
  },
  {
    prop: "children",
    type: "ReactNode",
    description: "The visible label.",
  },
];

const examples: ComponentExample[] = [
  {
    id: "with-a-button",
    title: "With a button",
    description:
      "A badge marks a count or status next to the action it describes.",
    preview: (
      <Button type="button" variant="outline">
        Inbox
        <Badge className="ml-2">3</Badge>
      </Button>
    ),
    code: `import { Badge } from "@/components/ui/badge/badge";
import { Button } from "@/components/ui/button/button";

export function Inbox() {
  return (
    <Button type="button" variant="outline">
      Inbox
      <Badge className="ml-2">3</Badge>
    </Button>
  );
}
`,
  },
  {
    id: "status",
    title: "Status",
    description: "Use a badge to label a row without building a card.",
    preview: (
      <div className="flex w-full max-w-sm items-center justify-between gap-3">
        <span className="text-sm">Deployment</span>
        <Badge variant="secondary">Ready</Badge>
      </div>
    ),
    code: `import { Badge } from "@/components/ui/badge/badge";

export function DeploymentStatus() {
  return (
    <div className="flex items-center justify-between gap-3">
      <span>Deployment</span>
      <Badge variant="secondary">Ready</Badge>
    </div>
  );
}
`,
  },
  {
    id: "variants",
    title: "Variants",
    description:
      "Default, secondary, outline, and destructive cover plan, status, and failure labels.",
    preview: (
      <>
        <Badge>Pro</Badge>
        <Badge variant="secondary">Draft</Badge>
        <Badge variant="outline">Beta</Badge>
        <Badge variant="destructive">Failed</Badge>
      </>
    ),
    code: `import { Badge } from "@/components/ui/badge/badge";

export function StatusLabels() {
  return (
    <>
      <Badge>Pro</Badge>
      <Badge variant="secondary">Draft</Badge>
      <Badge variant="outline">Beta</Badge>
      <Badge variant="destructive">Failed</Badge>
    </>
  );
}
`,
  },
];

export default async function BadgePage() {
  const source = await readFile(
    path.join(process.cwd(), "registry/new-york/ui/badge/badge.tsx"),
    "utf8",
  );

  return (
    <ComponentReference
      title="Badge"
      description="A compact label for status or category."
      overview={
        <p>
          Badge is an inline label. It does not handle clicks. Put an action in
          a button beside it.
        </p>
      }
      install="vinyaas add badge"
      manual={
        <p>
          After <code>vinyaas init</code>, place the source at{" "}
          <code>components/ui/badge/badge.tsx</code>. It imports <code>cn</code>{" "}
          from <code>@/lib/utils</code>. The project also needs{" "}
          <code>clsx</code> and <code>tailwind-merge</code>.
        </p>
      }
      usage={usage}
      examples={examples}
      api={api}
      accessibility={
        <p>
          The text inside the badge is its name. It is not a button. Do not use
          color alone: the label should say the status.
        </p>
      }
      source={source}
    >
      <Badge>Pro</Badge>
      <Badge variant="secondary">Draft</Badge>
      <Badge variant="outline">Beta</Badge>
      <Badge variant="destructive">Failed</Badge>
    </ComponentReference>
  );
}

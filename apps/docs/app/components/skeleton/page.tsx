import { readFile } from "node:fs/promises";
import path from "node:path";

import type { ApiRow } from "@/components/api-table";
import type { ComponentExample } from "@/components/component-reference";
import { ComponentReference } from "@/components/component-reference";
import { Skeleton } from "@/registry/new-york/ui/skeleton/skeleton";

const usage = `import { Skeleton } from "@/components/ui/skeleton/skeleton";

export function LoadingTitle() {
  return <Skeleton className="h-4 w-64" />;
}
`;

const api: ApiRow[] = [
  {
    prop: "className",
    type: "string",
    description: "Sets the size and shape, then merges with cn.",
  },
];

const examples: ComponentExample[] = [
  {
    id: "text",
    title: "Text",
    description: "A short bar stands in for a line of text.",
    preview: <Skeleton className="h-4 w-64" />,
    code: `<Skeleton className="h-4 w-64" />`,
  },
  {
    id: "block",
    title: "Content",
    description: "A larger block stands in for a paragraph or media area.",
    preview: <Skeleton className="h-24 w-full max-w-sm" />,
    code: `<Skeleton className="h-24 w-full max-w-sm" />`,
  },
  {
    id: "card",
    title: "Card",
    description:
      "Compose several placeholders for a person and two lines. Each shape stays decorative.",
    preview: (
      <div className="flex w-full max-w-sm items-center gap-3">
        <Skeleton className="size-10 rounded-full" />
        <div className="grid flex-1 gap-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
    ),
    code: `<div className="flex items-center gap-3">
  <Skeleton className="size-10 rounded-full" />
  <div className="grid flex-1 gap-2">
    <Skeleton className="h-4 w-3/4" />
    <Skeleton className="h-4 w-1/2" />
  </div>
</div>`,
  },
];

export default async function SkeletonPage() {
  const source = await readFile(
    path.join(process.cwd(), "registry/new-york/ui/skeleton/skeleton.tsx"),
    "utf8",
  );

  return (
    <ComponentReference
      title="Skeleton"
      description="A placeholder shown while content is loading."
      overview={
        <>
          <p>
            Skeleton is a decorative placeholder. Size it with{" "}
            <code>className</code>. It does not fetch data or track loading
            state.
          </p>
          <p>
            A soft pulse runs unless the person prefers reduced motion. The
            pulse is visual only.
          </p>
        </>
      }
      install="vinyaas add skeleton"
      manual={
        <p>
          After <code>vinyaas init</code>, place the source at{" "}
          <code>components/ui/skeleton/skeleton.tsx</code>. It imports{" "}
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
            Each skeleton is <code>aria-hidden</code>. A loading region should
            get its accessible name from real text, such as a status message,
            not from the placeholder shapes.
          </p>
          <ul className="list-disc pl-5">
            <li>Do not put meaningful text inside a skeleton.</li>
            <li>
              <code>motion-reduce:animate-none</code> stops the pulse when{" "}
              <code>prefers-reduced-motion</code> is set.
            </li>
          </ul>
        </>
      }
      source={source}
    >
      <div className="flex w-full max-w-sm items-center gap-3">
        <Skeleton className="size-10 rounded-full" />
        <div className="grid flex-1 gap-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
    </ComponentReference>
  );
}

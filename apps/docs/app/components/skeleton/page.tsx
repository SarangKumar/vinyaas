import { readFile } from "node:fs/promises";
import path from "node:path";
import type { ApiRow } from "@/components/api-table";
import type {
  ComponentExample,
  ComponentInPractice,
} from "@/components/component-reference";
import { ComponentReference } from "@/components/component-reference";
import { Card, CardContent, CardHeader } from "@/registry/new-york/ui/card";
import { Skeleton } from "@/registry/new-york/ui/skeleton";
import type { Metadata } from "next";
import { componentPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = componentPageMetadata("skeleton");

const usage = `import { Skeleton } from "@/components/ui/skeleton";

export function LoadingTitle() {
  return <Skeleton className="h-4 w-64" />;
}
`;

const profileSkeletonCode = `import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ProfileLoading() {
  return (
    <Card className="w-full max-w-md" aria-busy="true" aria-label="Loading profile">
      <CardHeader className="flex flex-row items-center gap-3">
        <Skeleton className="size-12 shrink-0 rounded-full" />
        <div className="grid flex-1 gap-2">
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-3 w-1/3" />
        </div>
      </CardHeader>
      <CardContent className="grid gap-4">
        <Skeleton className="h-28 w-full" />
        <div className="grid gap-2">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-5/6" />
          <Skeleton className="h-3 w-2/3" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-20" />
        </div>
      </CardContent>
    </Card>
  );
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
];

const inPractice: ComponentInPractice = {
  description:
    "A profile card keeps its layout while content loads. Avatar, title, media, copy, and actions all use Skeleton shapes.",
  preview: (
    <Card
      className="w-full max-w-md"
      aria-busy="true"
      aria-label="Loading profile"
    >
      <CardHeader className="flex flex-row items-center gap-3">
        <Skeleton className="size-12 shrink-0 rounded-full" />
        <div className="grid flex-1 gap-2">
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-3 w-1/3" />
        </div>
      </CardHeader>
      <CardContent className="grid gap-4">
        <Skeleton className="h-28 w-full" />
        <div className="grid gap-2">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-5/6" />
          <Skeleton className="h-3 w-2/3" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-20" />
        </div>
      </CardContent>
    </Card>
  ),
  code: profileSkeletonCode,
};

export default async function SkeletonPage() {
  const source = await readFile(
    path.join(process.cwd(), "registry/new-york/ui/skeleton/index.tsx"),
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
          <code>components/ui/skeleton/index.tsx</code>. It imports{" "}
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
      <Skeleton className="h-4 w-64" />
    </ComponentReference>
  );
}

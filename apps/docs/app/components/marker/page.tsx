import { readFile } from "node:fs/promises";
import path from "node:path";
import type { ApiRow } from "@/components/api-table";
import type {
  ComponentExample,
  ComponentInPractice,
} from "@/components/component-reference";
import { ComponentReference } from "@/components/component-reference";
import { Button } from "@/registry/new-york/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/registry/new-york/ui/card";
import {
  Marker,
  MarkerContent,
  MarkerIcon,
} from "@/registry/new-york/ui/marker";
import { Spinner } from "@/registry/new-york/ui/spinner";
import type { Metadata } from "next";
import { componentPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = componentPageMetadata("marker");

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const usage = `import { Marker, MarkerContent, MarkerIcon } from "@/components/ui/marker";

export function Note() {
  return (
    <Marker>
      <MarkerIcon><span /></MarkerIcon>
      <MarkerContent>Explored 4 files</MarkerContent>
    </Marker>
  );
}
`;

const deployStatusCode = `import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Marker, MarkerContent, MarkerIcon } from "@/components/ui/marker";

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function DeployStatus() {
  return (
    <Card className="w-full max-w-sm text-left">
      <CardHeader>
        <CardTitle>vinyaas-web</CardTitle>
        <CardDescription>Production · us-east-1</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <p className="text-muted-foreground text-sm">
          Last deploy finished 12 minutes ago. Traffic is healthy.
        </p>
        <Marker>
          <MarkerIcon>
            <CheckIcon />
          </MarkerIcon>
          <MarkerContent>Live on v1.1.0</MarkerContent>
        </Marker>
        <Button variant="outline" className="self-start">
          View logs
        </Button>
      </CardContent>
    </Card>
  );
}
`;

const api: ApiRow[] = [
  {
    prop: "variant",
    type: '"default" | "border" | "separator"',
    defaultValue: '"default"',
    description:
      "default is an inline note. border adds a bottom divider. separator centers the label between lines.",
  },
  {
    prop: "className",
    type: "string",
    description: "Merged onto Marker, MarkerIcon, or MarkerContent with cn.",
  },
];

const examples: ComponentExample[] = [
  {
    id: "status",
    title: "Live status",
    description:
      'Pair Marker with Spinner and role="status" for a running update assistive tech can announce.',
    preview: (
      <Marker role="status" className="max-w-sm">
        <MarkerIcon>
          <Spinner label="" />
        </MarkerIcon>
        <MarkerContent>Indexing workspace…</MarkerContent>
      </Marker>
    ),
    code: `import { Marker, MarkerContent, MarkerIcon } from "@/components/ui/marker";
import { Spinner } from "@/components/ui/spinner";

export function Indexing() {
  return (
    <Marker role="status">
      <MarkerIcon><Spinner label="" /></MarkerIcon>
      <MarkerContent>Indexing workspace…</MarkerContent>
    </Marker>
  );
}
`,
  },
  {
    id: "with-icon",
    title: "With icon",
    description:
      "MarkerIcon holds a decorative glyph. The message stays ordinary text beside it.",
    preview: (
      <Marker className="max-w-sm">
        <MarkerIcon>
          <CheckIcon />
        </MarkerIcon>
        <MarkerContent>Checks passed on main</MarkerContent>
      </Marker>
    ),
    code: `import { Marker, MarkerContent, MarkerIcon } from "@/components/ui/marker";

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Passed() {
  return (
    <Marker>
      <MarkerIcon><CheckIcon /></MarkerIcon>
      <MarkerContent>Checks passed on main</MarkerContent>
    </Marker>
  );
}
`,
  },
  {
    id: "border",
    title: "Bordered rows",
    description:
      "Use border when stacking a short activity list. Each row keeps the inline marker look.",
    preview: (
      <div className="grid w-full max-w-sm gap-0 text-left">
        <Marker variant="border">
          <MarkerContent>Opened pull request #248</MarkerContent>
        </Marker>
        <Marker variant="border">
          <MarkerContent>Requested review from design</MarkerContent>
        </Marker>
        <Marker variant="border">
          <MarkerContent>Updated CI for docs</MarkerContent>
        </Marker>
      </div>
    ),
    code: `import { Marker, MarkerContent } from "@/components/ui/marker";

export function Activity() {
  return (
    <>
      <Marker variant="border">
        <MarkerContent>Opened pull request #248</MarkerContent>
      </Marker>
      <Marker variant="border">
        <MarkerContent>Requested review from design</MarkerContent>
      </Marker>
      <Marker variant="border">
        <MarkerContent>Updated CI for docs</MarkerContent>
      </Marker>
    </>
  );
}
`,
  },
  {
    id: "separator",
    title: "Day separator",
    description:
      "A labeled divider splits ordinary copy into days without making every line a Marker.",
    preview: (
      <div className="flex w-full max-w-sm flex-col gap-3 text-left">
        <p className="text-muted-foreground text-sm">
          Merged accessibility fixes for Dialog.
        </p>
        <Marker variant="separator">
          <MarkerContent>Today</MarkerContent>
        </Marker>
        <p className="text-muted-foreground text-sm">
          Published registry artifacts for Toast.
        </p>
      </div>
    ),
    code: `import { Marker, MarkerContent } from "@/components/ui/marker";

export function ActivityDay() {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-muted-foreground text-sm">
        Merged accessibility fixes for Dialog.
      </p>
      <Marker variant="separator">
        <MarkerContent>Today</MarkerContent>
      </Marker>
      <p className="text-muted-foreground text-sm">
        Published registry artifacts for Toast.
      </p>
    </div>
  );
}
`,
  },
];

const inPractice: ComponentInPractice = {
  description:
    "A project card carries one status Marker. The rest of the surface is Card, copy, and a button.",
  preview: (
    <Card className="w-full max-w-sm text-left">
      <CardHeader>
        <CardTitle>vinyaas-web</CardTitle>
        <CardDescription>Production · us-east-1</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <p className="text-muted-foreground text-sm">
          Last deploy finished 12 minutes ago. Traffic is healthy.
        </p>
        <Marker>
          <MarkerIcon>
            <CheckIcon />
          </MarkerIcon>
          <MarkerContent>Live on v1.1.0</MarkerContent>
        </Marker>
        <Button variant="outline" className="self-start">
          View logs
        </Button>
      </CardContent>
    </Card>
  ),
  code: deployStatusCode,
};

export default async function MarkerPage() {
  const source = await readFile(
    path.join(process.cwd(), "registry/new-york/ui/marker/index.tsx"),
    "utf8",
  );

  return (
    <ComponentReference
      title="Marker"
      description="An inline status, bordered row, or labeled divider."
      overview={
        <p>
          Marker is presentational. Use <code>role=&quot;status&quot;</code>{" "}
          when the text is a live update. Put a real link or button in{" "}
          <code>MarkerContent</code> when the marker should navigate or act.
          MarkerIcon is hidden from assistive technology.
        </p>
      }
      install="vinyaas add marker"
      manual={
        <p>
          After <code>vinyaas init</code>, place the source at{" "}
          <code>components/ui/marker/index.tsx</code>. It imports{" "}
          <code>cn</code> from <code>@/lib/utils</code>. The project also needs{" "}
          <code>clsx</code> and <code>tailwind-merge</code>.
        </p>
      }
      usage={usage}
      examples={examples}
      inPractice={inPractice}
      api={api}
      accessibility={
        <ul className="list-disc pl-5">
          <li>The root has no role unless you pass one.</li>
          <li>Status text uses role=&quot;status&quot;.</li>
          <li>
            MarkerIcon is aria-hidden. An icon-only marker needs an aria-label.
          </li>
          <li>A labeled separator does not use role=&quot;separator&quot;.</li>
          <li>Links and buttons stay real anchors and buttons.</li>
        </ul>
      }
      source={source}
    >
      <Marker>
        <MarkerContent>Explored 4 files</MarkerContent>
      </Marker>
    </ComponentReference>
  );
}

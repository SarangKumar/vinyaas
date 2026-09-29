import { readFile } from "node:fs/promises";
import path from "node:path";
import type { ApiRow } from "@/components/api-table";
import type {
  ComponentExample,
  ComponentInPractice,
} from "@/components/component-reference";
import { ComponentReference } from "@/components/component-reference";
import {
  Marker,
  MarkerContent,
  MarkerIcon,
} from "@/registry/new-york/ui/marker";
import { Spinner } from "@/registry/new-york/ui/spinner";
import type { Metadata } from "next";
import { componentPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = componentPageMetadata("marker");

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

const activityFeedCode = `import { Marker, MarkerContent, MarkerIcon } from "@/components/ui/marker";
import { Spinner } from "@/components/ui/spinner";

export function ActivityFeed() {
  return (
    <div className="flex w-full max-w-md flex-col gap-3 text-left">
      <Marker variant="separator">
        <MarkerContent>Yesterday</MarkerContent>
      </Marker>
      <div className="grid gap-1">
        <Marker variant="border">
          <MarkerContent>Merged accessibility fixes for Dialog</MarkerContent>
        </Marker>
        <p className="text-muted-foreground pl-1 text-xs">4:18 PM</p>
      </div>
      <div className="grid gap-1">
        <Marker variant="border">
          <MarkerContent>Published registry artifacts for Toast</MarkerContent>
        </Marker>
        <p className="text-muted-foreground pl-1 text-xs">11:02 AM</p>
      </div>
      <Marker variant="separator">
        <MarkerContent>Today</MarkerContent>
      </Marker>
      <div className="grid gap-1">
        <Marker role="status">
          <MarkerIcon>
            <Spinner label="" />
          </MarkerIcon>
          <MarkerContent>Compacting conversation</MarkerContent>
        </Marker>
        <p className="text-muted-foreground pl-1 text-xs">Just now</p>
      </div>
      <div className="grid gap-1">
        <Marker variant="border">
          <MarkerContent>Updated installation docs for multi-add</MarkerContent>
        </Marker>
        <p className="text-muted-foreground pl-1 text-xs">9:41 AM</p>
      </div>
    </div>
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
    title: "Status",
    description:
      'A running note uses role="status" so the text can be announced.',
    preview: (
      <Marker role="status" className="max-w-sm">
        <MarkerIcon>
          <Spinner label="" />
        </MarkerIcon>
        <MarkerContent>Compacting conversation</MarkerContent>
      </Marker>
    ),
    code: `import { Marker, MarkerContent, MarkerIcon } from "@/components/ui/marker";
import { Spinner } from "@/components/ui/spinner";

export function Running() {
  return (
    <Marker role="status">
      <MarkerIcon><Spinner label="" /></MarkerIcon>
      <MarkerContent>Compacting conversation</MarkerContent>
    </Marker>
  );
}
`,
  },
  {
    id: "border",
    title: "Border",
    description: "The row keeps the inline marker and adds a bottom border.",
    preview: (
      <div className="grid w-full max-w-sm gap-2 text-left">
        <Marker variant="border">
          <MarkerContent>Switched to release-candidate</MarkerContent>
        </Marker>
        <Marker variant="border">
          <MarkerContent>Reviewed 8 related files</MarkerContent>
        </Marker>
      </div>
    ),
    code: `import { Marker, MarkerContent } from "@/components/ui/marker";

export function Notes() {
  return (
    <Marker variant="border">
      <MarkerContent>Reviewed 8 related files</MarkerContent>
    </Marker>
  );
}
`,
  },
  {
    id: "separator",
    title: "Separator",
    description:
      "A labeled divider splits a feed into days. Content stays ordinary text above and below.",
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
  {
    id: "link",
    title: "Link",
    description:
      "The marker stays presentational. The link is a real anchor, so it keeps its own role.",
    preview: (
      <Marker>
        <MarkerContent>
          <a href="/components/marker" className="underline">
            View the pull request
          </a>
        </MarkerContent>
      </Marker>
    ),
    code: `import { Marker, MarkerContent } from "@/components/ui/marker";

export function PullRequest() {
  return (
    <Marker>
      <MarkerContent>
        <a href="/pulls">View the pull request</a>
      </MarkerContent>
    </Marker>
  );
}
`,
  },
];

const inPractice: ComponentInPractice = {
  description:
    "An activity feed groups day separators, bordered notes with timestamps, and a live status row.",
  preview: (
    <div className="flex w-full max-w-md flex-col gap-3 text-left">
      <Marker variant="separator">
        <MarkerContent>Yesterday</MarkerContent>
      </Marker>
      <div className="grid gap-1">
        <Marker variant="border">
          <MarkerContent>Merged accessibility fixes for Dialog</MarkerContent>
        </Marker>
        <p className="text-muted-foreground pl-1 text-xs">4:18 PM</p>
      </div>
      <div className="grid gap-1">
        <Marker variant="border">
          <MarkerContent>Published registry artifacts for Toast</MarkerContent>
        </Marker>
        <p className="text-muted-foreground pl-1 text-xs">11:02 AM</p>
      </div>
      <Marker variant="separator">
        <MarkerContent>Today</MarkerContent>
      </Marker>
      <div className="grid gap-1">
        <Marker role="status">
          <MarkerIcon>
            <Spinner label="" />
          </MarkerIcon>
          <MarkerContent>Compacting conversation</MarkerContent>
        </Marker>
        <p className="text-muted-foreground pl-1 text-xs">Just now</p>
      </div>
      <div className="grid gap-1">
        <Marker variant="border">
          <MarkerContent>Updated installation docs for multi-add</MarkerContent>
        </Marker>
        <p className="text-muted-foreground pl-1 text-xs">9:41 AM</p>
      </div>
    </div>
  ),
  code: activityFeedCode,
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

import { readFile } from "node:fs/promises";
import path from "node:path";

import type { ApiRow } from "@/components/api-table";
import type { ComponentExample } from "@/components/component-reference";
import { ComponentReference } from "@/components/component-reference";
import {
  Marker,
  MarkerContent,
  MarkerIcon,
} from "@/registry/new-york/ui/marker/marker";
import { Spinner } from "@/registry/new-york/ui/spinner/spinner";

const usage = `import { Marker, MarkerContent, MarkerIcon } from "@/components/ui/marker/marker";

export function Note() {
  return (
    <Marker>
      <MarkerIcon><span /></MarkerIcon>
      <MarkerContent>Explored 4 files</MarkerContent>
    </Marker>
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
    code: `import { Marker, MarkerContent, MarkerIcon } from "@/components/ui/marker/marker";
import { Spinner } from "@/components/ui/spinner/spinner";

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
    code: `import { Marker, MarkerContent } from "@/components/ui/marker/marker";

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
      "A date sits between two divider lines. The text stays ordinary content.",
    preview: (
      <Marker variant="separator" className="w-full max-w-sm">
        <MarkerContent>Today</MarkerContent>
      </Marker>
    ),
    code: `import { Marker, MarkerContent } from "@/components/ui/marker/marker";

export function Day() {
  return (
    <Marker variant="separator">
      <MarkerContent>Today</MarkerContent>
    </Marker>
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
    code: `import { Marker, MarkerContent } from "@/components/ui/marker/marker";

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

export default async function MarkerPage() {
  const source = await readFile(
    path.join(process.cwd(), "registry/new-york/ui/marker/marker.tsx"),
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
          <code>components/ui/marker/marker.tsx</code>. It imports{" "}
          <code>cn</code> from <code>@/lib/utils</code>. The project also needs{" "}
          <code>clsx</code> and <code>tailwind-merge</code>.
        </p>
      }
      usage={usage}
      examples={examples}
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

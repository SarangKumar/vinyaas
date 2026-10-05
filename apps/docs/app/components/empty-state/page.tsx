import { readFile } from "node:fs/promises";
import path from "node:path";
import type { ApiRow } from "@/components/api-table";
import type {
  ComponentExample,
  ComponentInPractice,
} from "@/components/component-reference";
import { ComponentReference } from "@/components/component-reference";
import {
  Empty,
  EmptyDescription,
  EmptyTitle,
} from "@/registry/new-york/ui/empty-state";
import type { Metadata } from "next";
import { componentPageMetadata } from "@/lib/page-metadata";

import {
  BasicEmptyDemo,
  FirstProjectInPracticeDemo,
  TableSearchEmptyDemo,
  WithActionEmptyDemo,
  WithIconEmptyDemo,
  WithMultipleActionsEmptyDemo,
} from "./empty-state-demos";

export const metadata: Metadata = componentPageMetadata("empty-state");

const usage = `import {
  Empty,
  EmptyDescription,
  EmptyTitle,
} from "@/components/ui/empty-state";

export function NoResults() {
  return (
    <Empty>
      <EmptyTitle>No results</EmptyTitle>
      <EmptyDescription>
        Try adjusting your filters or search terms.
      </EmptyDescription>
    </Empty>
  );
}
`;

const inPracticeSource = `import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyActions,
  EmptyDescription,
  EmptyIcon,
  EmptyTitle,
} from "@/components/ui/empty-state";

function FolderIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />
    </svg>
  );
}

export function ProjectsPanel() {
  return (
    <Empty>
      <EmptyIcon>
        <FolderIcon />
      </EmptyIcon>
      <EmptyTitle>No projects yet</EmptyTitle>
      <EmptyDescription>
        Create your first project to organize repositories and environments.
      </EmptyDescription>
      <EmptyActions>
        <Button type="button">Create your first project</Button>
      </EmptyActions>
    </Empty>
  );
}
`;

const api: ApiRow[] = [
  {
    prop: "Empty size",
    type: '"default" | "sm"',
    defaultValue: '"default"',
    description: "Padding and vertical spacing for compact table cells.",
  },
  {
    prop: "Empty className",
    type: "string",
    description: "Layout helpers such as max width inside a card or table.",
  },
  {
    prop: "EmptyIcon",
    type: "div",
    description: "Circular muted icon shell sized for inline SVGs.",
  },
  {
    prop: "EmptyTitle",
    type: "h3",
    description: "Primary message — keep it short and specific.",
  },
  {
    prop: "EmptyDescription",
    type: "p",
    description: "Supporting copy with constrained width for readability.",
  },
  {
    prop: "EmptyActions",
    type: "div",
    description: "Row of buttons or links centered below the copy.",
  },
];

const examples: ComponentExample[] = [
  {
    id: "basic",
    title: "Basic",
    description: "Title and description inside the dashed border shell.",
    preview: <BasicEmptyDemo />,
    code: `<Empty>
  <EmptyTitle>No results</EmptyTitle>
  <EmptyDescription>
    Try adjusting your filters or search terms.
  </EmptyDescription>
</Empty>`,
  },
  {
    id: "with-icon",
    title: "With icon",
    description: "EmptyIcon centers an illustrative glyph above the copy.",
    preview: <WithIconEmptyDemo />,
    code: `<Empty>
  <EmptyIcon>
    <FolderIcon />
  </EmptyIcon>
  <EmptyTitle>No files yet</EmptyTitle>
  <EmptyDescription>Upload assets to share them with your team.</EmptyDescription>
</Empty>`,
  },
  {
    id: "with-action",
    title: "With action",
    description: "A single primary action for the most likely next step.",
    preview: <WithActionEmptyDemo />,
    code: `<EmptyActions>
  <Button type="button" size="sm">
    Create project
  </Button>
</EmptyActions>`,
  },
  {
    id: "multiple-actions",
    title: "With multiple actions",
    description: "Primary and secondary actions for branching flows.",
    preview: <WithMultipleActionsEmptyDemo />,
    code: `<EmptyActions>
  <Button type="button" size="sm">Invite people</Button>
  <Button type="button" size="sm" variant="outline">
    Import CSV
  </Button>
</EmptyActions>`,
  },
  {
    id: "table-search",
    title: "Table / search",
    description: "Compact size for filtered tables and search with no matches.",
    preview: <TableSearchEmptyDemo />,
    code: `<Empty size="sm">
  <EmptyIcon>
    <SearchIcon />
  </EmptyIcon>
  <EmptyTitle>No matching rows</EmptyTitle>
  <EmptyDescription>Clear the search or try another keyword.</EmptyDescription>
</Empty>`,
  },
];

const inPractice: ComponentInPractice = {
  description:
    "When a projects list is empty, explain the value and offer a clear create action.",
  preview: <FirstProjectInPracticeDemo />,
  code: inPracticeSource,
};

export default async function EmptyStatePage() {
  const source = await readFile(
    path.join(process.cwd(), "registry/new-york/ui/empty-state/index.tsx"),
    "utf8",
  );

  return (
    <ComponentReference
      title="Empty State"
      description="A composable empty state for lists and dashboard panels."
      overview={
        <p>
          Empty State is a dashed card with optional icon, title, description,
          and actions. Use it inside tables, side panels, and dashboard tiles
          when data is missing or filters return zero rows.
        </p>
      }
      install="vinyaas add empty-state"
      usage={usage}
      examples={examples}
      inPractice={inPractice}
      api={api}
      accessibility={
        <>
          <p>
            The root uses <code>role=&quot;status&quot;</code> so assistive
            technology announces the empty view when it appears.
          </p>
          <p>
            Keep titles concise. If the empty state replaces live content, move
            focus to the title or an action when appropriate so users know the
            view changed.
          </p>
        </>
      }
      source={source}
    >
      <Empty className="max-w-sm">
        <EmptyTitle>No items</EmptyTitle>
        <EmptyDescription>Add an item to see it listed here.</EmptyDescription>
      </Empty>
    </ComponentReference>
  );
}

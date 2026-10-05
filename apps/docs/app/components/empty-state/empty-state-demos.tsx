"use client";

import { SearchIcon } from "@/components/icons";
import { Button } from "@/registry/new-york/ui/button";
import {
  Empty,
  EmptyActions,
  EmptyDescription,
  EmptyIcon,
  EmptyTitle,
} from "@/registry/new-york/ui/empty-state";

function FolderIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />
    </svg>
  );
}

export function BasicEmptyDemo() {
  return (
    <Empty className="max-w-md">
      <EmptyTitle>No results</EmptyTitle>
      <EmptyDescription>
        Try adjusting your filters or search terms.
      </EmptyDescription>
    </Empty>
  );
}

export function WithIconEmptyDemo() {
  return (
    <Empty className="max-w-md">
      <EmptyIcon>
        <FolderIcon />
      </EmptyIcon>
      <EmptyTitle>No files yet</EmptyTitle>
      <EmptyDescription>
        Upload assets to share them with your team.
      </EmptyDescription>
    </Empty>
  );
}

export function WithActionEmptyDemo() {
  return (
    <Empty className="max-w-md">
      <EmptyIcon>
        <FolderIcon />
      </EmptyIcon>
      <EmptyTitle>No projects yet</EmptyTitle>
      <EmptyDescription>
        Create a project to organize issues, docs, and deploys.
      </EmptyDescription>
      <EmptyActions>
        <Button type="button" size="sm">
          Create project
        </Button>
      </EmptyActions>
    </Empty>
  );
}

export function WithMultipleActionsEmptyDemo() {
  return (
    <Empty className="max-w-md">
      <EmptyTitle>Invite your team</EmptyTitle>
      <EmptyDescription>
        You are the only member in this workspace. Add teammates or import from
        CSV.
      </EmptyDescription>
      <EmptyActions>
        <Button type="button" size="sm">
          Invite people
        </Button>
        <Button type="button" size="sm" variant="outline">
          Import CSV
        </Button>
      </EmptyActions>
    </Empty>
  );
}

export function TableSearchEmptyDemo() {
  return (
    <Empty size="sm" className="max-w-lg">
      <EmptyIcon>
        <SearchIcon />
      </EmptyIcon>
      <EmptyTitle>No matching rows</EmptyTitle>
      <EmptyDescription>
        Nothing matched{" "}
        <span className="text-foreground font-medium">billing</span>. Clear the
        search or try another keyword.
      </EmptyDescription>
      <EmptyActions>
        <Button type="button" size="sm" variant="outline">
          Clear search
        </Button>
      </EmptyActions>
    </Empty>
  );
}

export function FirstProjectInPracticeDemo() {
  return (
    <Empty className="max-w-lg">
      <EmptyIcon>
        <FolderIcon />
      </EmptyIcon>
      <EmptyTitle>No projects yet</EmptyTitle>
      <EmptyDescription>
        Projects group repositories, environments, and access rules. Create your
        first project to get started.
      </EmptyDescription>
      <EmptyActions>
        <Button type="button">Create your first project</Button>
        <Button type="button" variant="ghost">
          Browse templates
        </Button>
      </EmptyActions>
    </Empty>
  );
}

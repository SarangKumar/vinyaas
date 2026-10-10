"use client";

import { PlayBlock } from "@/app/home/play-block";
import { Button } from "@/registry/new-york/ui/button";
import {
  Empty,
  EmptyActions,
  EmptyDescription,
  EmptyIcon,
  EmptyTitle,
} from "@/registry/new-york/ui/empty-state";

export function EmptyStateBlock() {
  return (
    <PlayBlock
      align="center"
      title="Empty workspace"
      description="Empty dashboard panel before the first project."
    >
      <Empty size="sm" className="border-0 bg-transparent p-2">
        <EmptyIcon>
          <FolderGlyph />
        </EmptyIcon>
        <EmptyTitle>No projects yet</EmptyTitle>
        <EmptyDescription>
          Create your first project to start organizing work.
        </EmptyDescription>
        <EmptyActions>
          <Button type="button" size="sm">
            Create project
          </Button>
        </EmptyActions>
      </Empty>
    </PlayBlock>
  );
}

function FolderGlyph() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="size-5"
    >
      <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.7-.9l-.8-1.2A2 2 0 0 0 7.9 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />
    </svg>
  );
}

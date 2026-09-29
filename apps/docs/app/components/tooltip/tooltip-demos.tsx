"use client";

import { Button } from "@/registry/new-york/ui/button";
import { Tooltip } from "@/registry/new-york/ui/tooltip";

export function BasicTooltip() {
  return (
    <Tooltip content="Saved locally">
      <Button type="button">Hint</Button>
    </Tooltip>
  );
}

export function KeyboardTooltip() {
  return (
    <Tooltip content="Saved locally">
      <Button type="button">Focus me</Button>
    </Tooltip>
  );
}

export function PositionTooltips() {
  return (
    <>
      <Tooltip content="Above the trigger" side="top">
        <Button type="button" variant="outline">
          Top
        </Button>
      </Tooltip>
      <Tooltip content="Below the trigger" side="bottom">
        <Button type="button" variant="outline">
          Bottom
        </Button>
      </Tooltip>
      <Tooltip content="Left of the trigger" side="left">
        <Button type="button" variant="outline">
          Left
        </Button>
      </Tooltip>
      <Tooltip content="Right of the trigger" side="right">
        <Button type="button" variant="outline">
          Right
        </Button>
      </Tooltip>
    </>
  );
}

function BoldIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4 fill-current">
      <path d="M7 5h6.5a3.5 3.5 0 0 1 0 7H7V5Zm0 7h7.5a3.5 3.5 0 0 1 0 7H7v-7Z" />
    </svg>
  );
}

function ItalicIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="size-4 fill-none stroke-current"
      strokeWidth="2"
    >
      <path d="M10 5h8M6 19h8M14.5 5 9.5 19" strokeLinecap="round" />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="size-4 fill-none stroke-current"
      strokeWidth="2"
    >
      <path
        d="M10 13a5 5 0 0 0 7.07 0l1.41-1.41a5 5 0 0 0-7.07-7.07L10 5.93"
        strokeLinecap="round"
      />
      <path
        d="M14 11a5 5 0 0 0-7.07 0L5.52 12.4a5 5 0 0 0 7.07 7.07L14 18.07"
        strokeLinecap="round"
      />
    </svg>
  );
}

function UndoIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="size-4 fill-none stroke-current"
      strokeWidth="2"
    >
      <path d="M9 14 4 9l5-5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 9h10a6 6 0 0 1 0 12h-3" strokeLinecap="round" />
    </svg>
  );
}

export function ToolbarTooltips() {
  return (
    <div
      role="toolbar"
      aria-label="Formatting"
      className="border-border bg-background flex flex-wrap items-center gap-1 rounded-lg border p-1"
    >
      <Tooltip content="Undo">
        <Button type="button" variant="ghost" size="icon-sm" aria-label="Undo">
          <UndoIcon />
        </Button>
      </Tooltip>
      <Tooltip content="Bold">
        <Button type="button" variant="ghost" size="icon-sm" aria-label="Bold">
          <BoldIcon />
        </Button>
      </Tooltip>
      <Tooltip content="Italic">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label="Italic"
        >
          <ItalicIcon />
        </Button>
      </Tooltip>
      <Tooltip content="Insert link">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label="Insert link"
        >
          <LinkIcon />
        </Button>
      </Tooltip>
    </div>
  );
}

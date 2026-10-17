"use client";

import { useState } from "react";
import { FuseButton } from "@/registry/new-york/ui/fuse-button";

export function DefaultDemo() {
  const [active, setActive] = useState(false);
  return (
    <FuseButton
      variant="destructive"
      active={active}
      onActivate={() => setActive(true)}
      onFire={() => setActive(false)}
      onUndo={() => setActive(false)}
    >
      Delete
    </FuseButton>
  );
}

export function CircleDemo() {
  const [active, setActive] = useState(false);
  return (
    <FuseButton
      size="icon"
      variant="destructive"
      shape="circle"
      active={active}
      onActivate={() => setActive(true)}
      onFire={() => setActive(false)}
      onUndo={() => setActive(false)}
      aria-label="Delete"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden
        className="size-4"
      >
        <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
      </svg>
    </FuseButton>
  );
}

export function InPracticeDemo() {
  const [active, setActive] = useState(false);
  const [deleted, setDeleted] = useState(false);

  if (deleted) {
    return (
      <div className="text-muted-foreground text-sm">
        Item deleted.{" "}
        <button
          className="text-foreground underline"
          onClick={() => setDeleted(false)}
        >
          Reset
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm">My document.pdf</span>
      <FuseButton
        size="sm"
        variant="destructive"
        active={active}
        onActivate={() => setActive(true)}
        onFire={() => {
          setActive(false);
          setDeleted(true);
        }}
        onUndo={() => setActive(false)}
        duration={4000}
      >
        Delete
      </FuseButton>
    </div>
  );
}

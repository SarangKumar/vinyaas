"use client";

import { useState } from "react";

import { PlayBlock } from "@/app/home/play-block";
import { FuseButton } from "@/registry/new-york/ui/fuse-button";

function TrashIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14H6L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4h6v2" />
    </svg>
  );
}

export function FuseButtonBlock() {
  const [active1, setActive1] = useState(false);
  const [active2, setActive2] = useState(false);

  return (
    <PlayBlock
      title="Fuse button"
      description="Hold-to-confirm button that burns before firing a destructive action."
    >
      <div className="flex flex-wrap items-center justify-center gap-4">
        <FuseButton
          variant="destructive"
          active={active1}
          onActivate={() => setActive1(true)}
          onFire={() => setActive1(false)}
          onUndo={() => setActive1(false)}
        >
          Delete project
        </FuseButton>
        <FuseButton
          shape="circle"
          variant="destructive"
          size="icon"
          active={active2}
          onActivate={() => setActive2(true)}
          onFire={() => setActive2(false)}
          onUndo={() => setActive2(false)}
          aria-label="Delete"
        >
          <TrashIcon />
        </FuseButton>
      </div>
    </PlayBlock>
  );
}

"use client";

import { useState } from "react";
import type { ControlValues } from "@/components/component-demo";
import {
  FuseButton,
  type FuseButtonProps,
} from "@/registry/new-york/ui/fuse-button";
import type { ButtonProps } from "@/registry/new-york/ui/button";

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

const ICON_SIZES = new Set(["icon", "icon-sm", "icon-lg", "icon-xs"]);

export function FuseButtonPreview({ values }: { values: ControlValues }) {
  const [active, setActive] = useState(false);
  const size = values.size as string;
  const shape = values.shape as string;
  const isIconSize = ICON_SIZES.has(size);
  const isCircle = shape === "circle";
  return (
    <FuseButton
      shape={shape as "rect" | "circle"}
      variant={values.variant as FuseButtonProps["variant"]}
      size={size as ButtonProps["size"]}
      duration={values.duration as number}
      active={active}
      onActivate={() => setActive(true)}
      onFire={() => setActive(false)}
      onUndo={() => setActive(false)}
      aria-label={isIconSize || isCircle ? "Delete" : undefined}
    >
      {isIconSize || isCircle ? <TrashIcon /> : "Delete"}
    </FuseButton>
  );
}

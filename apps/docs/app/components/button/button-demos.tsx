"use client";

import { Button, type ButtonProps } from "@/registry/new-york/ui/button";
import type { ControlValues } from "@/components/component-demo";

function PlusIcon() {
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
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}

const ICON_SIZES = new Set(["icon", "icon-sm", "icon-lg", "icon-xs"]);

/** Live preview rendered by the main Preview Customize panel. */
export function ButtonPreview({ values }: { values: ControlValues }) {
  const size = values.size as ButtonProps["size"];
  const isIcon = ICON_SIZES.has(size ?? "");
  return (
    <Button
      variant={values.variant as ButtonProps["variant"]}
      size={size}
      disabled={values.disabled as boolean}
      aria-label={isIcon ? "Add item" : undefined}
    >
      {isIcon ? <PlusIcon /> : (values.label as string) || "Button"}
    </Button>
  );
}

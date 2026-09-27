"use client";

import { useState } from "react";

import { focusRing } from "@/components/focus-ring";

type CopyStatus = "idle" | "copied" | "failed";

const labels: Record<CopyStatus, string> = {
  idle: "Copy code",
  copied: "Copied",
  failed: "Copy failed",
};

export function CopyButton({ value }: { value: string }) {
  const [status, setStatus] = useState<CopyStatus>("idle");

  return (
    <button
      type="button"
      className={`text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer rounded-md p-1.5 ${focusRing}`}
      aria-label={labels[status]}
      aria-live="polite"
      onClick={() => {
        const clipboard = navigator.clipboard;

        if (!clipboard) {
          setStatus("failed");
          window.setTimeout(() => setStatus("idle"), 1500);
          return;
        }

        void clipboard.writeText(value).then(
          () => {
            setStatus("copied");
            window.setTimeout(() => setStatus("idle"), 1500);
          },
          () => {
            setStatus("failed");
            window.setTimeout(() => setStatus("idle"), 1500);
          },
        );
      }}
    >
      {status === "copied" ? <CheckIcon /> : <CopyIcon />}
    </button>
  );
}

function CopyIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

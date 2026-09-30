"use client";

import type { ReactNode } from "react";
import { useState } from "react";

import { focusRing } from "@/components/focus-ring";
import { Button } from "@/registry/new-york/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/registry/new-york/ui/dialog";
import { cn } from "@/lib/utils";

/**
 * Toolbar "Copy code" opens a Dialog with the theme/typeset source.
 * Clipboard write happens from the dialog Copy control, not the trigger.
 */
export function PlaygroundCopyCodeButton({
  value,
  title = "Theme",
  description = "Copy and paste the following code into your CSS file.",
  className,
}: {
  value: string;
  title?: string;
  description?: string;
  className?: string;
}) {
  return (
    <Dialog>
      <DialogTrigger>
        <Button
          type="button"
          size="sm"
          aria-label="Copy code"
          className={cn(
            "size-8 shrink-0 px-0 sm:h-8 sm:w-auto sm:gap-1.5 sm:px-3",
            className,
          )}
        >
          <CopyIcon className="size-4 sm:hidden" />
          <span className="hidden sm:inline">Copy code</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="flex max-h-[min(40rem,calc(100vh-2rem))] w-[min(42rem,calc(100vw-1.5rem))] flex-col gap-0 overflow-hidden p-0 sm:max-w-2xl">
        <div className="relative flex min-h-0 flex-1 flex-col gap-4 p-5 sm:gap-5 sm:p-6">
          <DialogClose>
            <button
              type="button"
              aria-label="Close"
              className={cn(
                "text-muted-foreground hover:bg-muted hover:text-foreground absolute top-3 right-3 rounded-md p-1.5 sm:top-4 sm:right-4",
                focusRing,
              )}
            >
              <CloseIcon />
            </button>
          </DialogClose>
          <DialogHeader className="gap-1.5 pr-8 text-left">
            <DialogTitle className="text-xl tracking-tight sm:text-2xl">
              {title}
            </DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-end">
            <LabeledCopyButton value={value} />
          </div>
          <pre
            data-playground-code
            className="border-border bg-muted/50 text-foreground min-h-0 flex-1 overflow-auto rounded-xl border p-4 font-mono text-[0.75rem] leading-5 sm:p-5 sm:text-[0.8125rem]"
          >
            <code>{value}</code>
          </pre>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function LabeledCopyButton({ value }: { value: string }) {
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");
  const label =
    status === "copied" ? "Copied" : status === "failed" ? "Failed" : "Copy";

  return (
    <button
      type="button"
      className={cn(
        "border-border bg-background text-foreground hover:bg-muted inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-md border px-2.5 text-xs font-medium",
        focusRing,
      )}
      aria-label={label === "Copy" ? "Copy code" : label}
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
      {label}
    </button>
  );
}

function CloseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="size-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

function CopyIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={cn("size-3.5", className)}
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
      className="size-3.5"
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

export function PlaygroundCheckIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={cn("size-2.5", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

export function PlaygroundChip({
  selected,
  children,
  onClick,
  className,
  "aria-label": ariaLabel,
}: {
  selected: boolean;
  children: ReactNode;
  onClick: () => void;
  className?: string;
  "aria-label"?: string;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      aria-label={ariaLabel}
      className={cn(
        "inline-flex h-8 shrink-0 cursor-pointer items-center gap-1.5 rounded-md border px-2.5 text-xs font-medium transition-colors",
        focusRing,
        selected
          ? "border-foreground/80 bg-background text-foreground shadow-[inset_0_0_0_1px_var(--foreground)]"
          : "border-border bg-background text-foreground hover:bg-muted",
        className,
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

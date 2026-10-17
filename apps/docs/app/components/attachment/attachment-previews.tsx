"use client";

import type { ControlValues } from "@/components/component-demo";
import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentTitle,
  type AttachmentState,
} from "@/registry/new-york/ui/attachment";
import { Spinner } from "@/registry/new-york/ui/spinner";

function FileCodeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="size-5"
      aria-hidden="true"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
      <path d="M14 2v6h6" />
      <path d="m10 13-2 2 2 2" />
      <path d="m14 17 2-2-2-2" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="size-4"
      aria-hidden="true"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

export function AttachmentPreview({ values }: { values: ControlValues }) {
  const state = (values.state as string) || "done";
  const isLoading = state === "uploading" || state === "processing";

  const description = (() => {
    if (state === "uploading") return "Uploading · 64%";
    if (state === "processing") return "Processing…";
    if (state === "error") return "Upload failed. Try again.";
    return "PDF · 2.4 MB";
  })();

  return (
    <Attachment
      state={values.state as AttachmentState}
      size={values.size as "default" | "sm" | "xs"}
      orientation={values.orientation as "horizontal" | "vertical"}
      className="w-full max-w-sm"
    >
      <AttachmentMedia>
        {isLoading ? <Spinner label="" /> : <FileCodeIcon />}
      </AttachmentMedia>
      <AttachmentContent>
        <AttachmentTitle>
          {state === "uploading" ? "sales-dashboard.pdf" : "document.pdf"}
        </AttachmentTitle>
        <AttachmentDescription>{description}</AttachmentDescription>
      </AttachmentContent>
      <AttachmentActions>
        <AttachmentAction aria-label={isLoading ? "Cancel" : "Remove"}>
          <XIcon />
        </AttachmentAction>
      </AttachmentActions>
    </Attachment>
  );
}

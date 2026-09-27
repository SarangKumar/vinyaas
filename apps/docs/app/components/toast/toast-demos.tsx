"use client";

import { Button } from "@/registry/new-york/ui/button/button";
import { toast } from "@/registry/new-york/ui/toast/toast";

export function DefaultToastDemo() {
  return (
    <Button type="button" onClick={() => toast.add({ title: "Note saved" })}>
      Show toast
    </Button>
  );
}

export function SuccessToastDemo() {
  return (
    <Button
      type="button"
      onClick={() =>
        toast.add({
          title: "Changes saved",
          description: "The profile is up to date.",
          type: "success",
        })
      }
    >
      Save profile
    </Button>
  );
}

export function InfoToastDemo() {
  return (
    <Button
      type="button"
      onClick={() => toast.add({ title: "Draft stored", type: "info" })}
    >
      Show info
    </Button>
  );
}

export function WarningToastDemo() {
  return (
    <Button
      type="button"
      onClick={() => toast.add({ title: "Unsaved changes", type: "warning" })}
    >
      Show warning
    </Button>
  );
}

export function ErrorToastDemo() {
  return (
    <Button
      type="button"
      variant="destructive"
      onClick={() =>
        toast.add({
          title: "Could not save",
          description: "Check the connection and try again.",
          type: "error",
        })
      }
    >
      Save and fail
    </Button>
  );
}

export function LoadingToastDemo() {
  return (
    <Button
      type="button"
      onClick={() => toast.add({ title: "Uploading", type: "loading" })}
    >
      Show loading
    </Button>
  );
}

export function ActionToastDemo() {
  return (
    <Button
      type="button"
      onClick={() =>
        toast.add({
          title: "File deleted",
          description: "notes.md was removed.",
          actionProps: {
            children: "Undo",
            onClick() {},
          },
        })
      }
    >
      Delete file
    </Button>
  );
}

export function PromiseToastDemo() {
  return (
    <Button
      type="button"
      onClick={() =>
        toast.promise(new Promise((resolve) => setTimeout(resolve, 400)), {
          loading: { title: "Saving" },
          success: { title: "Saved" },
          error: { title: "Could not save" },
        })
      }
    >
      Show promise
    </Button>
  );
}

export function MultipleToastDemo() {
  return (
    <Button
      type="button"
      onClick={() => {
        toast.add({ title: "First" });
        toast.add({ title: "Second", type: "info" });
      }}
    >
      Show two
    </Button>
  );
}

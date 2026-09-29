"use client";

import { Button } from "@/registry/new-york/ui/button";
import { Input } from "@/registry/new-york/ui/input";
import { Label } from "@/registry/new-york/ui/label";
import { toast } from "@/registry/new-york/ui/toast";

export function TypesToastDemo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <Button
        type="button"
        variant="outline"
        onClick={() => toast.add({ title: "Note saved" })}
      >
        Default
      </Button>
      <Button
        type="button"
        variant="outline"
        onClick={() =>
          toast.add({
            title: "Changes saved",
            description: "The profile is up to date.",
            type: "success",
          })
        }
      >
        Success
      </Button>
      <Button
        type="button"
        variant="outline"
        onClick={() => toast.add({ title: "Draft stored", type: "info" })}
      >
        Info
      </Button>
      <Button
        type="button"
        variant="outline"
        onClick={() => toast.add({ title: "Unsaved changes", type: "warning" })}
      >
        Warning
      </Button>
      <Button
        type="button"
        variant="outline"
        onClick={() =>
          toast.add({
            title: "Could not save",
            description: "Check the connection and try again.",
            type: "error",
          })
        }
      >
        Error
      </Button>
      <Button
        type="button"
        variant="outline"
        onClick={() => toast.add({ title: "Uploading", type: "loading" })}
      >
        Loading
      </Button>
    </div>
  );
}

export function DefaultToastDemo() {
  return (
    <Button type="button" onClick={() => toast.add({ title: "Note saved" })}>
      Show toast
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

export function FormSaveToastDemo() {
  return (
    <form
      className="grid w-full max-w-sm gap-4 text-left"
      onSubmit={(event) => {
        event.preventDefault();
        toast.add({
          title: "Changes saved",
          description: "Your workspace profile is up to date.",
          type: "success",
        });
      }}
    >
      <div className="grid gap-2">
        <Label htmlFor="toast-display-name">Display name</Label>
        <Input id="toast-display-name" defaultValue="Sarang Kumar" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="toast-workspace">Workspace</Label>
        <Input id="toast-workspace" defaultValue="vinyaas" />
      </div>
      <Button type="submit" className="mt-1">
        Save changes
      </Button>
    </form>
  );
}

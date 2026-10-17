"use client";

import type { ControlValues } from "@/components/component-demo";
import { Button } from "@/registry/new-york/ui/button";
import { Toaster, toast, type ToastType } from "@/registry/new-york/ui/toast";

export function ToastPreview({ values }: { values: ControlValues }) {
  function handleAdd() {
    toast.add({
      title:
        values.type === "error"
          ? "Something went wrong"
          : values.type === "success"
            ? "Changes saved"
            : values.type === "warning"
              ? "Check your inputs"
              : values.type === "info"
                ? "New update available"
                : values.type === "loading"
                  ? "Uploading…"
                  : "Action completed",
      type: values.type as ToastType,
      duration: values.duration as number,
    });
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <Button type="button" onClick={handleAdd}>
        Show toast
      </Button>
      <Toaster position="bottom-center" />
    </div>
  );
}

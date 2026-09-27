"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { cn } from "@/lib/utils";

export type ToastType =
  "default" | "success" | "info" | "warning" | "error" | "loading";

export type ToastPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

export type ToastAction = {
  children: React.ReactNode;
  onClick: () => void;
};

export type ToastInput = {
  title: string;
  description?: string;
  type?: ToastType;
  duration?: number;
  actionProps?: ToastAction;
};

type ToastRecord = ToastInput & {
  id: string;
  type: ToastType;
};

type ToastListener = (toasts: readonly ToastRecord[]) => void;

const listeners = new Set<ToastListener>();
const timers = new Map<string, ReturnType<typeof setTimeout>>();
let records: ToastRecord[] = [];
let nextId = 0;

function emit() {
  for (const listener of listeners) {
    listener(records);
  }
}

function clearTimer(id: string) {
  const timer = timers.get(id);

  if (timer) {
    clearTimeout(timer);
    timers.delete(id);
  }
}

function schedule(id: string) {
  clearTimer(id);
  const item = records.find((entry) => entry.id === id);

  if (!item || item.type === "loading") {
    return;
  }

  const duration = item.duration ?? 5000;

  if (!Number.isFinite(duration)) {
    return;
  }

  timers.set(
    id,
    setTimeout(() => {
      dismiss(id);
    }, duration),
  );
}

function dismiss(id?: string) {
  if (!id) {
    for (const entry of records) {
      clearTimer(entry.id);
    }

    records = [];
    emit();
    return;
  }

  clearTimer(id);
  records = records.filter((entry) => entry.id !== id);
  emit();
}

function update(id: string, patch: ToastInput) {
  records = records.map((entry) =>
    entry.id === id
      ? {
          ...entry,
          ...patch,
          type: patch.type ?? entry.type,
        }
      : entry,
  );
  emit();
  schedule(id);
}

function subscribe(listener: ToastListener) {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

function pause(id: string) {
  clearTimer(id);
}

function resume(id: string) {
  schedule(id);
}

export const toast = {
  add(input: ToastInput) {
    const id = `toast-${nextId++}`;
    const record: ToastRecord = {
      ...input,
      id,
      type: input.type ?? "default",
    };

    records = [...records, record];
    emit();
    schedule(id);
    return id;
  },
  dismiss,
  update,
  promise<T>(
    promise: Promise<T>,
    messages: {
      loading: ToastInput;
      success: ToastInput;
      error: ToastInput;
    },
  ) {
    const id = toast.add({ ...messages.loading, type: "loading" });

    promise.then(
      () => {
        update(id, { ...messages.success, type: "success" });
      },
      () => {
        update(id, { ...messages.error, type: "error" });
      },
    );

    return id;
  },
};

const positionClass: Record<ToastPosition, string> = {
  "top-left": "top-4 left-4 items-start",
  "top-center": "top-4 left-1/2 -translate-x-1/2 items-center",
  "top-right": "top-4 right-4 items-end",
  "bottom-left": "bottom-4 left-4 items-start",
  "bottom-center": "bottom-4 left-1/2 -translate-x-1/2 items-center",
  "bottom-right": "bottom-4 right-4 items-end",
};

const typeClass: Record<ToastType, string> = {
  default: "border-border bg-background text-foreground",
  success: "border-foreground bg-foreground text-background",
  info: "border-border bg-muted text-foreground",
  warning: "border-foreground bg-background text-foreground",
  error: "border-destructive bg-destructive text-destructive-foreground",
  loading: "border-border bg-background text-foreground",
};

export function Toaster({
  position = "bottom-right",
}: {
  position?: ToastPosition;
}) {
  const [items, setItems] = useState<readonly ToastRecord[]>([]);
  const [mounted, setMounted] = useState(() => typeof document !== "undefined");

  useEffect(() => {
    const timeout = setTimeout(() => setMounted(true), 0);
    const unsubscribe = subscribe(setItems);

    return () => {
      clearTimeout(timeout);
      unsubscribe();
    };
  }, []);

  if (!mounted) {
    return null;
  }

  const fromTop = position.startsWith("top");

  return createPortal(
    <div
      data-toaster=""
      data-position={position}
      className={cn(
        "pointer-events-none fixed z-50 flex w-80 max-w-[calc(100vw-2rem)] gap-2",
        fromTop ? "flex-col" : "flex-col-reverse",
        positionClass[position],
      )}
    >
      {items.map((item) => (
        <div
          key={item.id}
          role={item.type === "error" ? "alert" : "status"}
          data-type={item.type}
          aria-busy={item.type === "loading" ? true : undefined}
          className={cn(
            "pointer-events-auto grid w-full gap-1 rounded-md border px-3 py-3 text-sm",
            typeClass[item.type],
          )}
          onMouseEnter={() => pause(item.id)}
          onMouseLeave={() => resume(item.id)}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              event.stopPropagation();
              dismiss(item.id);
            }
          }}
        >
          <div className="flex items-start justify-between gap-3">
            <p className="font-medium">{item.title}</p>
            <button
              type="button"
              aria-label="Dismiss"
              className="focus-visible:ring-ring focus-visible:ring-offset-background cursor-pointer rounded-md px-1 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
              onClick={() => dismiss(item.id)}
            >
              ×
            </button>
          </div>
          {item.description ? <p>{item.description}</p> : null}
          {item.actionProps ? (
            <button
              type="button"
              className="focus-visible:ring-ring focus-visible:ring-offset-background mt-1 w-fit cursor-pointer rounded-md underline focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
              onClick={item.actionProps.onClick}
            >
              {item.actionProps.children}
            </button>
          ) : null}
        </div>
      ))}
    </div>,
    document.body,
  );
}

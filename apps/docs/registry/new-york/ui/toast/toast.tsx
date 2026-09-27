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
  exiting?: boolean;
};

type ToastListener = (toasts: readonly ToastRecord[]) => void;

const listeners = new Set<ToastListener>();
const timers = new Map<string, ReturnType<typeof setTimeout>>();
const exits = new Map<string, ReturnType<typeof setTimeout>>();
const exitDuration = 160;
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

function removeNow(id?: string) {
  if (!id) {
    for (const entry of records) {
      clearTimer(entry.id);
    }

    for (const timer of exits.values()) {
      clearTimeout(timer);
    }

    exits.clear();
    records = [];
    emit();
    return;
  }

  clearTimer(id);
  const exit = exits.get(id);

  if (exit) {
    clearTimeout(exit);
    exits.delete(id);
  }

  records = records.filter((entry) => entry.id !== id);
  emit();
}

function dismiss(id?: string) {
  if (!id) {
    removeNow();
    return;
  }

  const item = records.find((entry) => entry.id === id);

  if (!item || item.exiting) {
    return;
  }

  clearTimer(id);
  records = records.map((entry) =>
    entry.id === id ? { ...entry, exiting: true } : entry,
  );
  emit();
  exits.set(
    id,
    setTimeout(() => {
      exits.delete(id);
      removeNow(id);
    }, exitDuration),
  );
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

function reducedMotion() {
  return (
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function ToastIcon({ type }: { type: ToastType }) {
  return (
    <svg
      viewBox="0 0 16 16"
      aria-hidden="true"
      className={cn(
        "mt-0.5 size-4 shrink-0",
        type === "loading" && "animate-spin motion-reduce:animate-none",
      )}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      {type === "success" ? <path d="M3 8.5 6.2 12 13 4" /> : null}
      {type === "error" ? (
        <path d="M5 5l6 6M11 5l-6 6M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13Z" />
      ) : null}
      {type === "warning" ? (
        <path d="M8 2.5 14.5 13.5h-13L8 2.5ZM8 7v3M8 12h.01" />
      ) : null}
      {type === "info" ? (
        <path d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13ZM8 7.2V11M8 5h.01" />
      ) : null}
      {type === "loading" ? (
        <path d="M8 2.5a5.5 5.5 0 1 1-4.8 2.8" strokeLinecap="round" />
      ) : null}
      {type === "default" ? (
        <circle cx="8" cy="8" r="3" fill="currentColor" />
      ) : null}
    </svg>
  );
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
    <>
      <style>
        {`@keyframes vinyaas-toast-in { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
@keyframes vinyaas-toast-out { from { opacity: 1; transform: none; } to { opacity: 0; transform: translateY(6px); } }`}
      </style>
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
            data-exiting={item.exiting ? "true" : undefined}
            aria-busy={item.type === "loading" ? true : undefined}
            style={{
              animation: reducedMotion()
                ? undefined
                : item.exiting
                  ? "vinyaas-toast-out 160ms ease-in forwards"
                  : "vinyaas-toast-in 180ms ease-out",
            }}
            className={cn(
              "pointer-events-auto flex w-full items-start gap-3 rounded-md border px-3 py-3 text-sm",
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
            <ToastIcon type={item.type} />
            <div className="grid min-w-0 flex-1 gap-1">
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
          </div>
        ))}
      </div>
    </>,
    document.body,
  );
}

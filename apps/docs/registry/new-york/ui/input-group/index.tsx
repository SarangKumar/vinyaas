"use client";

import React from "react";

import { cn } from "@/lib/utils";

export type InputGroupProps = React.ComponentProps<"div">;

export function InputGroup({ className, ...props }: InputGroupProps) {
  return (
    <div
      className={cn(
        "border-input bg-background focus-within:ring-ring focus-within:ring-offset-background flex w-full items-center gap-2 rounded-md border px-3 focus-within:ring-2 focus-within:ring-offset-2",
        "has-[textarea]:items-start has-[textarea]:py-2",
        className,
      )}
      {...props}
    />
  );
}

export type InputGroupAddonProps = React.ComponentProps<"span">;

export function InputGroupAddon({ className, ...props }: InputGroupAddonProps) {
  return (
    <span
      className={cn(
        "text-muted-foreground inline-flex shrink-0 items-center gap-1 text-sm [&_svg]:pointer-events-none [&_svg]:size-4",
        className,
      )}
      {...props}
    />
  );
}

export type InputGroupTextProps = React.ComponentProps<"span">;

export function InputGroupText({ className, ...props }: InputGroupTextProps) {
  return (
    <span
      className={cn("text-muted-foreground shrink-0 text-sm", className)}
      {...props}
    />
  );
}

export type InputGroupInputProps = React.ComponentProps<"input">;

export function InputGroupInput({ className, ...props }: InputGroupInputProps) {
  return (
    <input
      className={cn(
        "text-foreground placeholder:text-muted-foreground h-9 min-w-0 flex-1 bg-transparent text-sm outline-none disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export type InputGroupTextareaProps = React.ComponentProps<"textarea">;

export function InputGroupTextarea({
  className,
  ...props
}: InputGroupTextareaProps) {
  return (
    <textarea
      className={cn(
        "text-foreground placeholder:text-muted-foreground min-h-20 min-w-0 flex-1 resize-y bg-transparent py-1 text-sm outline-none disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export type InputGroupButtonProps = React.ComponentProps<"button">;

export function InputGroupButton({
  className,
  type = "button",
  ...props
}: InputGroupButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "text-foreground hover:bg-accent focus-visible:ring-ring focus-visible:ring-offset-background inline-flex h-7 shrink-0 cursor-pointer items-center rounded-md px-2 text-sm font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

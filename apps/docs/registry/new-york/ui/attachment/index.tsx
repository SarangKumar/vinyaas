import React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { Button, type ButtonProps } from "../button";

const attachmentVariants = cva(
  "group/attachment relative flex w-fit max-w-full min-w-0 shrink-0 flex-wrap rounded-md border border-border bg-card text-card-foreground transition-colors focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background has-[>a,>button]:hover:bg-accent data-[state=error]:border-destructive/50 data-[state=idle]:border-dashed",
  {
    variants: {
      size: {
        default:
          "gap-2 text-sm has-data-[slot=attachment-content]:px-2.5 has-data-[slot=attachment-content]:py-2 has-data-[slot=attachment-media]:p-2",
        sm: "gap-2 text-xs has-data-[slot=attachment-content]:px-2 has-data-[slot=attachment-content]:py-1.5 has-data-[slot=attachment-media]:p-1.5",
        xs: "gap-1.5 text-xs has-data-[slot=attachment-content]:px-1.5 has-data-[slot=attachment-content]:py-1 has-data-[slot=attachment-media]:p-1",
      },
      orientation: {
        horizontal: "min-w-40 items-center",
        vertical: "w-24 flex-col has-data-[slot=attachment-content]:w-30",
      },
    },
    defaultVariants: {
      size: "default",
      orientation: "horizontal",
    },
  },
);

export type AttachmentState =
  "idle" | "uploading" | "processing" | "error" | "done";

export type AttachmentProps = React.ComponentProps<"div"> &
  VariantProps<typeof attachmentVariants> & {
    state?: AttachmentState;
  };

export function Attachment({
  className,
  state = "done",
  size = "default",
  orientation = "horizontal",
  ...props
}: AttachmentProps) {
  return (
    <div
      data-slot="attachment"
      data-state={state}
      data-size={size}
      data-orientation={orientation}
      className={cn(attachmentVariants({ size, orientation }), className)}
      {...props}
    />
  );
}

const attachmentMediaVariants = cva(
  "relative flex aspect-square w-10 shrink-0 items-center justify-center overflow-hidden rounded-md border border-border bg-muted text-muted-foreground group-data-[orientation=vertical]/attachment:w-full group-data-[size=sm]/attachment:w-8 group-data-[size=xs]/attachment:w-7 group-data-[state=error]/attachment:border-destructive/40 group-data-[state=error]/attachment:bg-destructive/10 group-data-[state=error]/attachment:text-destructive [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 group-data-[orientation=vertical]/attachment:[&_svg:not([class*='size-'])]:size-6 group-data-[size=xs]/attachment:[&_svg:not([class*='size-'])]:size-3.5",
  {
    variants: {
      variant: {
        icon: "",
        image:
          "border-transparent bg-transparent opacity-80 group-data-[state=done]/attachment:opacity-100 group-data-[state=idle]/attachment:opacity-100 *:[img]:aspect-square *:[img]:size-full *:[img]:rounded-md *:[img]:object-cover",
      },
    },
    defaultVariants: {
      variant: "icon",
    },
  },
);

export type AttachmentMediaProps = React.ComponentProps<"div"> &
  VariantProps<typeof attachmentMediaVariants>;

export function AttachmentMedia({
  className,
  variant = "icon",
  ...props
}: AttachmentMediaProps) {
  return (
    <div
      data-slot="attachment-media"
      data-variant={variant}
      className={cn(attachmentMediaVariants({ variant }), className)}
      {...props}
    />
  );
}

export function AttachmentContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="attachment-content"
      className={cn(
        "max-w-full min-w-0 flex-1 leading-tight group-data-[orientation=vertical]/attachment:px-1",
        className,
      )}
      {...props}
    />
  );
}

export function AttachmentTitle({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="attachment-title"
      className={cn(
        "block max-w-full min-w-0 truncate font-medium group-data-[state=processing]/attachment:animate-pulse group-data-[state=uploading]/attachment:animate-pulse",
        className,
      )}
      {...props}
    />
  );
}

export function AttachmentDescription({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="attachment-description"
      className={cn(
        "text-muted-foreground group-data-[state=error]/attachment:text-destructive/80 mt-0.5 block max-w-full min-w-0 truncate text-xs",
        className,
      )}
      {...props}
    />
  );
}

export function AttachmentActions({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="attachment-actions"
      className={cn(
        "relative z-20 flex shrink-0 items-center group-data-[orientation=vertical]/attachment:absolute group-data-[orientation=vertical]/attachment:top-2 group-data-[orientation=vertical]/attachment:right-2 group-data-[orientation=vertical]/attachment:gap-1",
        className,
      )}
      {...props}
    />
  );
}

export function AttachmentAction({
  className,
  variant = "ghost",
  size = "icon-xs",
  ...props
}: ButtonProps) {
  return (
    <Button
      data-slot="attachment-action"
      variant={variant}
      size={size}
      className={cn(
        "text-muted-foreground hover:text-foreground [&_svg:not([class*='size-'])]:size-3",
        className,
      )}
      {...props}
    />
  );
}

export function AttachmentTrigger({
  className,
  type = "button",
  ...props
}: React.ComponentProps<"button">) {
  return (
    <button
      data-slot="attachment-trigger"
      type={type}
      className={cn("absolute inset-0 z-10 outline-none", className)}
      {...props}
    />
  );
}

export function AttachmentGroup({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="attachment-group"
      className={cn(
        "flex min-w-0 snap-x snap-mandatory gap-2 overflow-x-auto overscroll-x-contain py-1 *:data-[slot=attachment]:flex-none *:data-[slot=attachment]:snap-start",
        className,
      )}
      {...props}
    />
  );
}

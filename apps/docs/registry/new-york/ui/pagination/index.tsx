import React from "react";
import { type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { buttonVariants } from "../button";

export type PaginationProps = React.ComponentProps<"nav">;

export function Pagination({ className, ...props }: PaginationProps) {
  return (
    <nav
      role="navigation"
      aria-label="Pagination"
      data-slot="pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
      {...props}
    />
  );
}

export type PaginationContentProps = React.ComponentProps<"ul">;

export function PaginationContent({
  className,
  ...props
}: PaginationContentProps) {
  return (
    <ul
      data-slot="pagination-content"
      className={cn(
        "flex flex-row flex-wrap items-center justify-center gap-1",
        className,
      )}
      {...props}
    />
  );
}

export type PaginationItemProps = React.ComponentProps<"li">;

export function PaginationItem({ className, ...props }: PaginationItemProps) {
  return (
    <li data-slot="pagination-item" className={cn("", className)} {...props} />
  );
}

type PaginationLinkShared = {
  isActive?: boolean;
  size?: VariantProps<typeof buttonVariants>["size"];
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
  /** When set, renders an anchor. When omitted, renders a button. */
  href?: string;
};

export type PaginationLinkProps = PaginationLinkShared &
  Omit<
    React.AnchorHTMLAttributes<HTMLAnchorElement> &
      React.ButtonHTMLAttributes<HTMLButtonElement>,
    "href" | "disabled" | "className" | "children" | "type" | "aria-current"
  >;

/**
 * Page control. Pass `href` for link navigation, or omit it for a button
 * the consumer wires with onClick / routing.
 */
export function PaginationLink({
  className,
  isActive = false,
  size = "icon",
  disabled = false,
  href,
  children,
  ...props
}: PaginationLinkProps) {
  const classes = cn(
    buttonVariants({
      variant: isActive ? "outline" : "ghost",
      size,
    }),
    isActive && "pointer-events-none",
    className,
  );

  if (typeof href === "string") {
    const { onClick, ...anchorProps } =
      props as React.AnchorHTMLAttributes<HTMLAnchorElement>;

    return (
      <a
        href={href}
        aria-current={isActive ? "page" : undefined}
        aria-disabled={disabled || undefined}
        tabIndex={disabled ? -1 : undefined}
        data-slot="pagination-link"
        data-active={isActive ? "" : undefined}
        className={cn(classes, disabled && "pointer-events-none opacity-50")}
        {...anchorProps}
        onClick={(event) => {
          if (disabled) {
            event.preventDefault();
            return;
          }

          onClick?.(event);
        }}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      type="button"
      disabled={disabled}
      aria-current={isActive ? "page" : undefined}
      data-slot="pagination-link"
      data-active={isActive ? "" : undefined}
      className={classes}
      {...props}
    >
      {children}
    </button>
  );
}

export type PaginationPreviousProps = PaginationLinkProps;

export function PaginationPrevious({
  className,
  size = "default",
  ...props
}: PaginationPreviousProps) {
  return (
    <PaginationLink
      aria-label="Go to previous page"
      size={size}
      className={cn("gap-1 px-2.5 sm:pl-2.5", className)}
      {...props}
    >
      <ChevronLeftIcon className="size-4" />
      <span className="hidden sm:inline">Previous</span>
    </PaginationLink>
  );
}

export type PaginationNextProps = PaginationLinkProps;

export function PaginationNext({
  className,
  size = "default",
  ...props
}: PaginationNextProps) {
  return (
    <PaginationLink
      aria-label="Go to next page"
      size={size}
      className={cn("gap-1 px-2.5 sm:pr-2.5", className)}
      {...props}
    >
      <span className="hidden sm:inline">Next</span>
      <ChevronRightIcon className="size-4" />
    </PaginationLink>
  );
}

export type PaginationEllipsisProps = React.ComponentProps<"span">;

export function PaginationEllipsis({
  className,
  ...props
}: PaginationEllipsisProps) {
  return (
    <span
      data-slot="pagination-ellipsis"
      className={cn(
        "text-muted-foreground flex size-9 items-center justify-center",
        className,
      )}
      {...props}
    >
      <span aria-hidden="true" className="text-sm tracking-widest">
        …
      </span>
      <span className="sr-only">More pages</span>
    </span>
  );
}

function ChevronLeftIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="m15 6-6 6 6 6" />
    </svg>
  );
}

function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="m9 6 6 6-6 6" />
    </svg>
  );
}

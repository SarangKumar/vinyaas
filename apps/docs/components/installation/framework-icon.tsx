import type { ReactNode } from "react";

import type { InstallationFrameworkId } from "@/lib/installation/frameworks";
import { cn } from "@/lib/utils";

export function FrameworkIcon({
  id,
  className,
}: {
  id: InstallationFrameworkId;
  className?: string;
}) {
  switch (id) {
    case "nextjs":
      return <NextJsIcon className={className} />;
    case "vite":
      return <ViteIcon className={className} />;
    case "react":
      return <ReactIcon className={className} />;
  }
}

function NextJsIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={cn("size-6", className)}
      fill="currentColor"
    >
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c2.02 0 3.9-.6 5.47-1.63L8.4 9.13v6.62H6.75V6.75h1.5l9.2 12.38A9.95 9.95 0 0 0 22 12c0-5.52-4.48-10-10-10Zm4.25 12.55V6.75H17.9v9.8h-1.65Z" />
    </svg>
  );
}

function ViteIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={cn("size-6", className)}
      fill="none"
    >
      <path
        d="M12.9 2.2 21.4 6.4c.4.2.5.7.3 1.1L13.4 21.4c-.2.4-.8.4-1 0L2.3 7.5c-.2-.4-.1-.9.3-1.1L10.9 2.2c.6-.3 1.4-.3 2 0Z"
        fill="currentColor"
        opacity="0.2"
      />
      <path
        d="m8.2 10.8 3.3-7.1c.1-.3.6-.3.8 0l7.5 15.2c.1.3-.1.6-.4.6h-3.2L8.2 10.8Z"
        fill="currentColor"
      />
      <path
        d="M8.2 10.8 4.4 19.5c-.2.3.1.7.4.7h6.5L8.2 10.8Z"
        fill="currentColor"
        opacity="0.7"
      />
    </svg>
  );
}

function ReactIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={cn("size-6", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <circle cx="12" cy="12" r="2.2" fill="currentColor" stroke="none" />
      <ellipse cx="12" cy="12" rx="9" ry="3.6" />
      <ellipse cx="12" cy="12" rx="9" ry="3.6" transform="rotate(60 12 12)" />
      <ellipse cx="12" cy="12" rx="9" ry="3.6" transform="rotate(120 12 12)" />
    </svg>
  );
}

export function FrameworkIconBadge({
  id,
  children,
}: {
  id: InstallationFrameworkId;
  children?: ReactNode;
}) {
  return (
    <span className="border-border bg-muted text-foreground inline-flex size-12 shrink-0 items-center justify-center rounded-lg border">
      {children ?? <FrameworkIcon id={id} />}
    </span>
  );
}

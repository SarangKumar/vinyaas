import type { ReactNode } from "react";

function Icon({ children }: { children: ReactNode }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  );
}

export function BoldIcon() {
  return (
    <Icon>
      <path d="M6 4h8a4 4 0 0 1 0 8H6zM6 12h9a4 4 0 0 1 0 8H6z" />
    </Icon>
  );
}

export function ItalicIcon() {
  return (
    <Icon>
      <path d="M19 4h-9M14 20H5M15 4 9 20" />
    </Icon>
  );
}

export function UnderlineIcon() {
  return (
    <Icon>
      <path d="M6 4v6a6 6 0 0 0 12 0V4M4 20h16" />
    </Icon>
  );
}

export function AlignLeftIcon() {
  return (
    <Icon>
      <path d="M3 6h18M3 12h12M3 18h16" />
    </Icon>
  );
}

export function AlignCenterIcon() {
  return (
    <Icon>
      <path d="M3 6h18M7 12h10M5 18h14" />
    </Icon>
  );
}

export function AlignRightIcon() {
  return (
    <Icon>
      <path d="M3 6h18M9 12h12M5 18h16" />
    </Icon>
  );
}

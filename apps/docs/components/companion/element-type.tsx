import type { CompanionElementType } from "@/components/companion/progression";
import { cn } from "@/lib/utils";

type ElementVisual = {
  label: string;
  /** Soft badge surface matching the element. */
  badgeClass: string;
  /** Circular mark overlaid on the companion preview. */
  markClass: string;
};

export const ELEMENT_VISUALS: Record<CompanionElementType, ElementVisual> = {
  fire: {
    label: "Fire",
    badgeClass:
      "border-[#e8a86a]/55 bg-[#fff1e4] text-[#c45c26] dark:border-[#e8a86a]/35 dark:bg-[#3a2418] dark:text-[#f0b27a]",
    markClass:
      "border-[#e8a86a] bg-[#fff1e4] text-[#c45c26] dark:bg-[#3a2418] dark:text-[#f0b27a]",
  },
  grass: {
    label: "Grass",
    badgeClass:
      "border-[#7db88a]/55 bg-[#eef8f0] text-[#2f7a45] dark:border-[#7db88a]/35 dark:bg-[#1c2e22] dark:text-[#9fd4ad]",
    markClass:
      "border-[#7db88a] bg-[#eef8f0] text-[#2f7a45] dark:bg-[#1c2e22] dark:text-[#9fd4ad]",
  },
  water: {
    label: "Water",
    badgeClass:
      "border-[#7aa8d4]/55 bg-[#eef5fb] text-[#2f6f9a] dark:border-[#7aa8d4]/35 dark:bg-[#1a2836] dark:text-[#9ec5e8]",
    markClass:
      "border-[#7aa8d4] bg-[#eef5fb] text-[#2f6f9a] dark:bg-[#1a2836] dark:text-[#9ec5e8]",
  },
  rock: {
    label: "Rock",
    badgeClass:
      "border-[#b59a7a]/55 bg-[#f6f0e8] text-[#6e5538] dark:border-[#b59a7a]/35 dark:bg-[#2c261f] dark:text-[#d2b896]",
    markClass:
      "border-[#b59a7a] bg-[#f6f0e8] text-[#6e5538] dark:bg-[#2c261f] dark:text-[#d2b896]",
  },
  dragon: {
    label: "Dragon",
    badgeClass:
      "border-[#c48a6a]/55 bg-[#f8efe9] text-[#8a4b2e] dark:border-[#c48a6a]/35 dark:bg-[#32241c] dark:text-[#e0b099]",
    markClass:
      "border-[#c48a6a] bg-[#f8efe9] text-[#8a4b2e] dark:bg-[#32241c] dark:text-[#e0b099]",
  },
  psychic: {
    label: "Psychic",
    badgeClass:
      "border-[#c49ab0]/55 bg-[#f8eef3] text-[#8a4466] dark:border-[#c49ab0]/35 dark:bg-[#2e1f27] dark:text-[#e0b4c6]",
    markClass:
      "border-[#c49ab0] bg-[#f8eef3] text-[#8a4466] dark:bg-[#2e1f27] dark:text-[#e0b4c6]",
  },
  ghost: {
    label: "Ghost",
    badgeClass:
      "border-[#9aa0b8]/55 bg-[#f0f1f6] text-[#4a5168] dark:border-[#9aa0b8]/35 dark:bg-[#222633] dark:text-[#c2c7d8]",
    markClass:
      "border-[#9aa0b8] bg-[#f0f1f6] text-[#4a5168] dark:bg-[#222633] dark:text-[#c2c7d8]",
  },
  electric: {
    label: "Electric",
    badgeClass:
      "border-[#d4b85a]/55 bg-[#fbf6e4] text-[#8a6f14] dark:border-[#d4b85a]/35 dark:bg-[#2e2918] dark:text-[#e8d48a]",
    markClass:
      "border-[#d4b85a] bg-[#fbf6e4] text-[#8a6f14] dark:bg-[#2e2918] dark:text-[#e8d48a]",
  },
  ice: {
    label: "Ice",
    badgeClass:
      "border-[#8ec5d8]/55 bg-[#eef8fb] text-[#2f6f86] dark:border-[#8ec5d8]/35 dark:bg-[#1a2c33] dark:text-[#a8d8e8]",
    markClass:
      "border-[#8ec5d8] bg-[#eef8fb] text-[#2f6f86] dark:bg-[#1a2c33] dark:text-[#a8d8e8]",
  },
  fighting: {
    label: "Fighting",
    badgeClass:
      "border-[#d48a7a]/55 bg-[#fbf0ed] text-[#9a3f2e] dark:border-[#d48a7a]/35 dark:bg-[#33201c] dark:text-[#e8b0a0]",
    markClass:
      "border-[#d48a7a] bg-[#fbf0ed] text-[#9a3f2e] dark:bg-[#33201c] dark:text-[#e8b0a0]",
  },
};

export function ElementTypeIcon({
  type,
  className,
}: {
  type: CompanionElementType;
  className?: string;
}) {
  const common = cn("size-3.5 shrink-0", className);
  switch (type) {
    case "fire":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className={common} fill="currentColor">
          <path d="M12 2c.4 3.2-1.6 5.2-3.2 7.1C7 11 6 12.6 6 15a6 6 0 0 0 12 0c0-2.6-1.2-4.4-2.6-6.2C13.8 6.8 12.8 5 12 2Zm0 18a4 4 0 0 1-4-4c0-1.4.6-2.5 1.6-3.8.4.9 1.2 1.6 2.4 1.6 1.5 0 2.5-1 2.9-2.2.8 1.2 1.1 2.4 1.1 4.4a4 4 0 0 1-4 4Z" />
        </svg>
      );
    case "grass":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className={common} fill="currentColor">
          <path d="M12 3c4.5 1.2 7 4.4 7 9.2 0 .4-.3.7-.7.6-2.8-.6-4.7-1.4-6.3-3.1V20h-1V9.7C9.4 11.4 7.5 12.2 4.7 12.8c-.4.1-.7-.2-.7-.6C4 7.4 6.5 4.2 11 3h1Z" />
        </svg>
      );
    case "water":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className={common} fill="currentColor">
          <path d="M12 3c3.8 4.2 6 7.4 6 10.2A6 6 0 0 1 6 13.2C6 10.4 8.2 7.2 12 3Zm0 16.5a4.5 4.5 0 0 0 4.5-4.3c0-1.7-1.2-3.8-3.3-6.2-.4 1.4-1.3 2.3-2.7 2.3s-2.3-.9-2.7-2.3C6.7 11.4 5.5 13.5 5.5 15.2A4.5 4.5 0 0 0 12 19.5Z" />
        </svg>
      );
    case "rock":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className={common} fill="currentColor">
          <path d="M8.2 4.5h7.1L20 10.2l-3.2 9.3H7.1L4 10.2 8.2 4.5Zm1.1 1.8L6.3 10.5l2.2 6.5h7l2.2-6.5-3-4.2H9.3Z" />
        </svg>
      );
    case "dragon":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className={common} fill="currentColor">
          <path d="M4 8.5 8 5l2.2 2.5L14 4l2.5 3.2L20 6v5.5c0 4.2-2.8 7.5-8 9.5-5.2-2-8-5.3-8-9.5V8.5Zm3.2 1.2V12c0 2.6 1.5 4.7 4.8 6.3 3.3-1.6 4.8-3.7 4.8-6.3V9.2l-1.7.7-2.1-2.7-2.5 2.2L8.4 7.3 7.2 9.7Z" />
        </svg>
      );
    case "psychic":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className={common} fill="currentColor">
          <path d="M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18Zm0 2a7 7 0 1 0 0 14 7 7 0 0 0 0-14Zm0 2.5a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9Zm0 2a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Z" />
        </svg>
      );
    case "ghost":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className={common} fill="currentColor">
          <path d="M12 3c4.4 0 7 3 7 7.5V20l-2.2-1.6L14.5 20 12 18.3 9.5 20 7.2 18.4 5 20v-9.5C5 6 7.6 3 12 3Zm-2.5 7a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4Zm5 0a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4Z" />
        </svg>
      );
    case "electric":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className={common} fill="currentColor">
          <path d="M13.2 2 6 13.2h4.2L9.4 22 18 10.8h-4.3L13.2 2Z" />
        </svg>
      );
    case "ice":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className={common} fill="currentColor">
          <path d="M12 2v20M4.5 6.5l15 11M19.5 6.5l-15 11M12 2l3 4h-6l3-4Zm0 20-3-4h6l-3 4ZM4.5 6.5l4 1.2-1.2 4-2.8-5.2Zm15 0-4 1.2 1.2 4 2.8-5.2ZM4.5 17.5l4-1.2-1.2-4-2.8 5.2Zm15 0-4-1.2 1.2-4 2.8 5.2Z" />
        </svg>
      );
    case "fighting":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className={common} fill="currentColor">
          <path d="M8 3h3v4H8V3Zm5 0h3v4h-3V3ZM6 8h12v3.5c0 2.2-1.2 4.1-3.2 5.2L14 21h-4l-.8-4.3C7.2 15.6 6 13.7 6 11.5V8Zm2 2v1.5c0 1.4.7 2.6 1.9 3.3l.6.3.5 2.9h2l.5-2.9.6-.3c1.2-.7 1.9-1.9 1.9-3.3V10H8Z" />
        </svg>
      );
  }
}

/** Pill: [icon] Fire — color matched to element. */
export function ElementTypeBadge({
  type,
  className,
}: {
  type: CompanionElementType;
  className?: string;
}) {
  const visual = ELEMENT_VISUALS[type];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[0.7rem] font-medium tracking-wide uppercase",
        visual.badgeClass,
        className,
      )}
    >
      <ElementTypeIcon type={type} className="size-3" />
      {visual.label}
    </span>
  );
}

/** Circular type mark for companion preview (foot / corner). */
export function ElementTypeMark({
  type,
  className,
  size = 28,
}: {
  type: CompanionElementType;
  className?: string;
  size?: number;
}) {
  const visual = ELEMENT_VISUALS[type];
  return (
    <span
      title={visual.label}
      aria-label={`${visual.label} type`}
      className={cn(
        "inline-flex items-center justify-center rounded-full border-2 shadow-sm",
        visual.markClass,
        className,
      )}
      style={{ width: size, height: size }}
    >
      <ElementTypeIcon type={type} className="size-3.5" />
    </span>
  );
}

export function SpawnIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={cn("size-3.5", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 5.5v13l11-6.5L8 5.5Z" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function BookIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={cn("size-3.5", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5V5.5Z" />
      <path d="M4 19a2.5 2.5 0 0 1 2.5-2.5H20" />
    </svg>
  );
}

export function LockIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={cn("size-3.5", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

export function UnlockIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={cn("size-3.5", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 7.2-2.4" />
    </svg>
  );
}

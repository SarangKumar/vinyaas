import { cn } from "@/lib/utils";

export interface UserCursorProps {
  /** Display name shown on the label. */
  name: string;
  /** Accent color used for both the cursor and the label background. */
  color?: string;
  /** Hide the name label; useful when only the pointer is needed. */
  labelHidden?: boolean;
  className?: string;
}

/**
 * A collaborative cursor matching the style from Figma and cursor.chat:
 * a thin, sharp arrow pointer with a rounded-rectangle name tag anchored
 * to its tip. Both the arrow and the label share the `color` prop.
 */
export function UserCursor({
  name,
  color = "var(--primary)",
  labelHidden = false,
  className,
}: UserCursorProps) {
  return (
    <div
      data-slot="user-cursor"
      className={cn("inline-flex items-start select-none", className)}
    >
      {/*
        Thin angular arrow — matches the cursor.chat / Figma style.
        The path draws a clean pointer: no white outline, no bottom serif.
        Coordinates: origin at tip (0,0), grows down-right.
      */}
      <svg
        aria-hidden
        width="13"
        height="17"
        viewBox="0 0 13 17"
        fill="none"
        className="shrink-0"
      >
        {/* Subtle dark outline so the cursor is visible on any background */}
        <path
          d="M1.5 1.5L1.5 13L4.5 10L6.8 15.5L8.5 14.8L6.2 9.3L11 9.3Z"
          fill="rgba(0,0,0,0.25)"
          transform="translate(0.5, 0.5)"
        />
        <path
          d="M1.5 1.5L1.5 13L4.5 10L6.8 15.5L8.5 14.8L6.2 9.3L11 9.3Z"
          fill={color}
        />
      </svg>

      {!labelHidden && (
        <span
          data-slot="user-cursor-label"
          className="mt-3 -ml-0.5 max-w-[160px] truncate rounded-md px-2.5 py-1 text-xs leading-none font-semibold text-white shadow-sm"
          style={{ backgroundColor: color }}
        >
          {name}
        </span>
      )}
    </div>
  );
}

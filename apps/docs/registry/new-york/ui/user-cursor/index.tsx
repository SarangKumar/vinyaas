import { cn } from "@/lib/utils";

export type LabelVariant = "rounded" | "pill" | "bubble" | "square";

export interface UserCursorProps {
  /** Display name shown on the label. */
  name: string;
  /** Accent color used for both the cursor and the label background. */
  color?: string;
  /** Hide the name label; useful when only the pointer is needed. */
  labelHidden?: boolean;
  /**
   * Visual style of the name label.
   * - `"rounded"` — compact rectangle with rounded corners (default)
   * - `"pill"` — fully capsule-shaped
   * - `"bubble"` — speech-bubble with a small tail pointing toward the cursor tip
   * - `"square"` — flat rectangle, no rounding
   */
  labelVariant?: LabelVariant;
  className?: string;
}

/**
 * A collaborative cursor matching the style from Figma and cursor.chat:
 * a thin, sharp arrow pointer with a name tag anchored to its tip.
 * The label shape is controlled by `labelVariant`.
 */
export function UserCursor({
  name,
  color = "var(--primary)",
  labelHidden = false,
  labelVariant = "rounded",
  className,
}: UserCursorProps) {
  return (
    <div
      data-slot="user-cursor"
      className={cn("inline-flex items-start select-none", className)}
    >
      {/*
        Thin angular arrow — matches the cursor.chat / Figma style.
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
          data-variant={labelVariant}
          className={cn(
            "relative mt-3 -ml-0.5 max-w-[160px] truncate px-2.5 py-1 text-xs leading-none font-semibold text-white shadow-sm",
            labelVariant === "rounded" && "rounded-md",
            labelVariant === "pill" && "rounded-full px-3",
            labelVariant === "bubble" && "mt-4 rounded-xl",
            labelVariant === "square" && "rounded-none",
          )}
          style={{ backgroundColor: color }}
        >
          {labelVariant === "bubble" && (
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -top-[5px] left-2"
              style={{
                width: 0,
                height: 0,
                borderLeft: "4px solid transparent",
                borderRight: "4px solid transparent",
                borderBottom: `5px solid ${color}`,
              }}
            />
          )}
          {name}
        </span>
      )}
    </div>
  );
}

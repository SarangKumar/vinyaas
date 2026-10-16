import { cn } from "@/lib/utils";

export type LabelVariant = "rounded" | "pill" | "bubble" | "chat" | "square";
export type CursorVariant = "default" | "minimal";

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
   * - `"pill"` — fully capsule-shaped tag
   * - `"bubble"` — speech-bubble with a prominent triangular tail at bottom-left
   * - `"chat"` — chat message bubble; one corner near the cursor is flat
   * - `"square"` — flat rectangle, no rounding
   */
  labelVariant?: LabelVariant;
  /**
   * Shape of the cursor arrow.
   * - `"default"` — full arrow with a diagonal stem (cursor.chat / classic style)
   * - `"minimal"` — clean triangular arrow without the stem (Figma-style)
   */
  cursorVariant?: CursorVariant;
  className?: string;
}

/**
 * A collaborative cursor with a name tag anchored to its tip.
 * The label shape is controlled by `labelVariant`;
 * the cursor arrow shape is controlled by `cursorVariant`.
 */
export function UserCursor({
  name,
  color = "var(--primary)",
  labelHidden = false,
  labelVariant = "rounded",
  cursorVariant = "default",
  className,
}: UserCursorProps) {
  return (
    <div
      data-slot="user-cursor"
      className={cn("inline-flex items-start select-none", className)}
    >
      <svg
        aria-hidden
        width="14"
        height="18"
        viewBox="0 0 14 18"
        fill="none"
        className="shrink-0"
      >
        {cursorVariant === "minimal" ? (
          /* Figma-style: clean arrow head only, no diagonal stem */
          <>
            <path
              d="M2 2L2 14L6 10.5L12 9.5Z"
              fill="rgba(0,0,0,0.18)"
              transform="translate(0.4, 0.4)"
            />
            <path d="M2 2L2 14L6 10.5L12 9.5Z" fill={color} />
          </>
        ) : (
          /* Default: arrow with diagonal stem (cursor.chat style) */
          <>
            <path
              d="M2 2L2 13.5L5 10.5L7.2 16L9 15.3L6.8 9.8L12 9.8Z"
              fill="rgba(0,0,0,0.2)"
              transform="translate(0.4, 0.4)"
            />
            <path
              d="M2 2L2 13.5L5 10.5L7.2 16L9 15.3L6.8 9.8L12 9.8Z"
              fill={color}
            />
          </>
        )}
      </svg>

      {!labelHidden && (
        <span
          data-slot="user-cursor-label"
          data-variant={labelVariant}
          className={cn(
            "relative mt-3 -ml-0.5 max-w-40 truncate px-2.5 py-1 text-xs leading-none font-semibold text-white shadow-sm",
            labelVariant === "rounded" && "rounded-md",
            labelVariant === "pill" && "rounded-full px-4",
            labelVariant === "bubble" && "mt-7 rounded-lg",
            labelVariant === "chat" && "mt-2 rounded-lg rounded-tl-none",
            labelVariant === "square" && "rounded-none",
          )}
          style={{ backgroundColor: color }}
        >
          {labelVariant === "bubble" && (
            /* Triangle tail pointing up-left toward the cursor tip */
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -top-1.75 left-0"
              style={{
                width: 0,
                height: 0,
                borderRight: "7px solid transparent",
                borderBottom: `7px solid ${color}`,
              }}
            />
          )}
          {name}
        </span>
      )}
    </div>
  );
}

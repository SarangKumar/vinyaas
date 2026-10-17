"use client";

import React, { useId, useRef, useState } from "react";

import { cn } from "@/lib/utils";

/** Splits on literal strings so callers never have to escape regex syntax. */
function splitValues(text: string, separators: readonly string[]) {
  let parts = [text];

  for (const separator of separators) {
    if (!separator) {
      continue;
    }

    parts = parts.flatMap((part) => part.split(separator));
  }

  return parts;
}

export type MultiInputProps = Omit<
  React.ComponentProps<"div">,
  "onChange" | "defaultValue"
> & {
  value?: readonly string[];
  defaultValue?: readonly string[];
  onValueChange?: (values: string[]) => void;
  /**
   * Characters that end an entry while typing or pasting. Enter and blur
   * always commit the text in the field.
   */
  separators?: readonly string[];
  placeholder?: string;
  /** Maximum number of values. Extra entries stay in the field. */
  max?: number;
  disabled?: boolean;
  invalid?: boolean;
  allowDuplicates?: boolean;
  /** Return false to keep an entry in the field instead of committing it. */
  validate?: (value: string) => boolean;
  /** Submits one hidden input per value so the field works in a native form. */
  name?: string;
  /** Applied to the inner text input so a Label can point at it. */
  id?: string;
  "aria-label"?: string;
  /** Forwarded to the inner text input, so Form messages describe the field. */
  "aria-describedby"?: string;
};

export function MultiInput({
  value,
  defaultValue = [],
  onValueChange,
  separators = [","],
  placeholder,
  max,
  disabled = false,
  invalid = false,
  allowDuplicates = false,
  validate,
  name,
  id,
  className,
  "aria-label": ariaLabel,
  "aria-describedby": ariaDescribedBy,
  "aria-invalid": ariaInvalid,
  ...props
}: MultiInputProps) {
  const [uncontrolled, setUncontrolled] = useState<string[]>([...defaultValue]);
  const [draft, setDraft] = useState("");
  const [rejected, setRejected] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const values = value ? [...value] : uncontrolled;
  const primarySeparator = separators.find(Boolean) ?? ",";
  // FormControl clones its child with aria-invalid, so honor it like `invalid`.
  const showsInvalid =
    invalid ||
    rejected ||
    (ariaInvalid !== undefined &&
      ariaInvalid !== false &&
      ariaInvalid !== "false");

  function commit(next: string[]) {
    if (value === undefined) {
      setUncontrolled(next);
    }

    onValueChange?.(next);
  }

  /**
   * Commits the complete entries in `text` left to right and stops at the
   * first one `validate` rejects or that would exceed `max`. Returns the text
   * that stays in the field — rejoined with the primary separator so nothing
   * typed or pasted is lost.
   */
  function commitText(text: string, includeLast: boolean) {
    const parts = splitValues(text, separators);
    const end = includeLast ? parts.length : parts.length - 1;
    const next = [...values];

    for (let index = 0; index < end; index += 1) {
      const entry = parts[index]!.trim();

      if (!entry) {
        continue;
      }

      const blocked =
        (max !== undefined && next.length >= max) ||
        validate?.(entry) === false;

      if (blocked) {
        if (next.length !== values.length) {
          commit(next);
        }

        setRejected(true);
        return parts.slice(index).join(primarySeparator);
      }

      if (allowDuplicates || !next.includes(entry)) {
        next.push(entry);
      }
    }

    if (next.length !== values.length) {
      commit(next);
    }

    setRejected(false);
    return parts.slice(end).join(primarySeparator);
  }

  function remove(index: number) {
    if (disabled) {
      return;
    }

    commit(values.filter((_, position) => position !== index));
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      // Committing an entry must not also submit the surrounding form.
      event.preventDefault();

      if (draft.trim()) {
        setDraft(commitText(draft, true));
      }

      return;
    }

    if (event.key === "Backspace" && !draft && values.length > 0) {
      remove(values.length - 1);
    }
  }

  return (
    <div
      data-slot="multi-input"
      data-disabled={disabled ? "true" : undefined}
      onPointerDown={(event) => {
        // Clicking the padding focuses the field; clicking a remove button
        // must keep its own behavior.
        if (event.target === event.currentTarget) {
          event.preventDefault();
          inputRef.current?.focus();
        }
      }}
      className={cn(
        "border-input bg-background text-foreground focus-within:ring-ring focus-within:ring-offset-background flex min-h-9 w-full flex-wrap items-center gap-1.5 rounded-md border px-1.5 py-1 text-sm focus-within:ring-2 focus-within:ring-offset-2",
        showsInvalid && "border-destructive ring-destructive/20",
        disabled && "cursor-not-allowed opacity-50",
        className,
      )}
      {...props}
    >
      {values.map((entry, index) => (
        <span
          key={`${entry}-${index}`}
          data-slot="multi-input-value"
          className="border-border bg-secondary text-secondary-foreground inline-flex max-w-full items-center gap-1 rounded-md border py-0.5 pr-0.5 pl-2 text-xs font-medium"
        >
          <span className="min-w-0 truncate">{entry}</span>
          <button
            type="button"
            disabled={disabled}
            aria-label={`Remove ${entry}`}
            onClick={() => remove(index)}
            className="text-muted-foreground hover:text-foreground focus-visible:ring-ring inline-flex size-4 shrink-0 items-center justify-center rounded-sm focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
              className="size-3"
            >
              <path
                d="M6 6l12 12M18 6 6 18"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </span>
      ))}
      <input
        ref={inputRef}
        id={inputId}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
        aria-invalid={showsInvalid || undefined}
        disabled={disabled}
        value={draft}
        placeholder={values.length === 0 ? placeholder : undefined}
        onChange={(event) => {
          const text = event.currentTarget.value;

          if (splitValues(text, separators).length === 1) {
            setDraft(text);
            setRejected(false);
            return;
          }

          setDraft(commitText(text, false));
        }}
        onKeyDown={handleKeyDown}
        onBlur={() => {
          if (draft.trim()) {
            setDraft(commitText(draft, true));
          }
        }}
        className="placeholder:text-muted-foreground h-6 min-w-24 flex-1 bg-transparent px-1 leading-none focus-visible:outline-none disabled:cursor-not-allowed"
      />
      {name
        ? values.map((entry, index) => (
            <input
              key={`${name}-${index}`}
              type="hidden"
              name={name}
              value={entry}
            />
          ))
        : null}
    </div>
  );
}

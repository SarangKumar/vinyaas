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

export type MultiInputOption = {
  value: string;
  /** Shown in the list and on the chip. Defaults to `value`. */
  label?: string;
  disabled?: boolean;
};

type ResolvedOption = Required<Pick<MultiInputOption, "value">> &
  Omit<MultiInputOption, "value">;

function normalizeOptions(
  options: readonly (string | MultiInputOption)[],
): ResolvedOption[] {
  return options.map((option) =>
    typeof option === "string" ? { value: option } : option,
  );
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
  /**
   * Turns the field into a multi-select: typing filters this list and the
   * field offers it in a dropdown.
   */
  options?: readonly (string | MultiInputOption)[];
  /**
   * With `options`, set false to accept listed values only. Typed text that
   * matches no option is rejected instead of committed.
   */
  allowCustomValues?: boolean;
  /** Shown when the dropdown has nothing left to offer. */
  emptyMessage?: string;
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
  options,
  allowCustomValues = true,
  emptyMessage = "No matches.",
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
  const [open, setOpen] = useState(false);
  const [activeValue, setActiveValue] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const listId = `${inputId}-list`;
  const values = value ? [...value] : uncontrolled;
  const primarySeparator = separators.find(Boolean) ?? ",";
  const hasOptions = options !== undefined;
  const allOptions = hasOptions ? normalizeOptions(options) : [];
  const atMax = max !== undefined && values.length >= max;
  // FormControl clones its child with aria-invalid, so honor it like `invalid`.
  const showsInvalid =
    invalid ||
    rejected ||
    (ariaInvalid !== undefined &&
      ariaInvalid !== false &&
      ariaInvalid !== "false");

  const query = draft.trim().toLowerCase();
  const matches = allOptions.filter((option) => {
    if (!allowDuplicates && values.includes(option.value)) {
      return false;
    }

    if (!query) {
      return true;
    }

    return (
      option.value.toLowerCase().includes(query) ||
      (option.label ?? "").toLowerCase().includes(query)
    );
  });
  const showsList = hasOptions && open && !disabled;

  function labelFor(entry: string) {
    return allOptions.find((option) => option.value === entry)?.label ?? entry;
  }

  /**
   * Maps typed text onto an option by value or label. Returns null when the
   * text matches nothing and the field only accepts listed values.
   */
  function resolveEntry(entry: string) {
    if (!hasOptions) {
      return entry;
    }

    const match = allOptions.find(
      (option) =>
        !option.disabled &&
        (option.value.toLowerCase() === entry.toLowerCase() ||
          (option.label ?? "").toLowerCase() === entry.toLowerCase()),
    );

    if (match) {
      return match.value;
    }

    return allowCustomValues ? entry : null;
  }

  function commit(next: string[]) {
    if (value === undefined) {
      setUncontrolled(next);
    }

    onValueChange?.(next);
  }

  /**
   * Commits the complete entries in `text` left to right and stops at the
   * first one `validate` rejects, that matches no option, or that would
   * exceed `max`. Returns the text that stays in the field — rejoined with
   * the primary separator so nothing typed or pasted is lost.
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

      const resolved = resolveEntry(entry);
      const blocked =
        resolved === null ||
        (max !== undefined && next.length >= max) ||
        validate?.(resolved) === false;

      if (blocked) {
        if (next.length !== values.length) {
          commit(next);
        }

        setRejected(true);
        return parts.slice(index).join(primarySeparator);
      }

      if (allowDuplicates || !next.includes(resolved)) {
        next.push(resolved);
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

  function selectOption(option: ResolvedOption) {
    if (disabled || option.disabled) {
      return;
    }

    if (atMax || validate?.(option.value) === false) {
      setRejected(true);
      return;
    }

    if (allowDuplicates || !values.includes(option.value)) {
      commit([...values, option.value]);
    }

    setDraft("");
    setRejected(false);
    setActiveValue(null);
    inputRef.current?.focus();
  }

  /** Moves the highlight through the enabled matches, wrapping at both ends. */
  function moveActive(direction: 1 | -1) {
    const selectable = matches.filter((option) => !option.disabled);

    if (selectable.length === 0) {
      setActiveValue(null);
      return;
    }

    const current = selectable.findIndex(
      (option) => option.value === activeValue,
    );

    if (current === -1) {
      setActiveValue(
        (direction === 1 ? selectable[0] : selectable[selectable.length - 1])!
          .value,
      );
      return;
    }

    const next = (current + direction + selectable.length) % selectable.length;
    setActiveValue(selectable[next]!.value);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (hasOptions && (event.key === "ArrowDown" || event.key === "ArrowUp")) {
      event.preventDefault();

      if (!open) {
        setOpen(true);
      }

      moveActive(event.key === "ArrowDown" ? 1 : -1);
      return;
    }

    if (hasOptions && event.key === "Escape" && open) {
      // Stop the close from also reaching a surrounding dialog or popover.
      event.preventDefault();
      event.stopPropagation();
      setOpen(false);
      setActiveValue(null);
      return;
    }

    if (event.key === "Enter") {
      // Committing an entry must not also submit the surrounding form.
      event.preventDefault();

      const active = showsList
        ? matches.find(
            (option) => option.value === activeValue && !option.disabled,
          )
        : undefined;

      if (active) {
        selectOption(active);
        return;
      }

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
        "border-input bg-background text-foreground focus-within:ring-ring focus-within:ring-offset-background relative flex min-h-9 w-full flex-wrap items-center gap-1.5 rounded-md border px-1.5 py-1 text-sm focus-within:ring-2 focus-within:ring-offset-2",
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
          <span className="min-w-0 truncate">{labelFor(entry)}</span>
          <button
            type="button"
            disabled={disabled}
            aria-label={`Remove ${labelFor(entry)}`}
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
        role={hasOptions ? "combobox" : undefined}
        aria-expanded={hasOptions ? showsList : undefined}
        aria-controls={showsList ? listId : undefined}
        aria-autocomplete={hasOptions ? "list" : undefined}
        aria-activedescendant={
          showsList && activeValue
            ? `${listId}-${matches.findIndex(
                (option) => option.value === activeValue,
              )}`
            : undefined
        }
        disabled={disabled}
        value={draft}
        placeholder={values.length === 0 ? placeholder : undefined}
        onChange={(event) => {
          const text = event.currentTarget.value;

          if (hasOptions) {
            setOpen(true);
            setActiveValue(null);
          }

          if (splitValues(text, separators).length === 1) {
            setDraft(text);
            setRejected(false);
            return;
          }

          setDraft(commitText(text, false));
        }}
        onKeyDown={handleKeyDown}
        onFocus={() => {
          if (hasOptions) {
            setOpen(true);
          }
        }}
        onBlur={() => {
          setOpen(false);
          setActiveValue(null);

          if (draft.trim()) {
            setDraft(commitText(draft, true));
          }
        }}
        className="placeholder:text-muted-foreground h-6 min-w-24 flex-1 bg-transparent px-1 leading-none focus-visible:outline-none disabled:cursor-not-allowed"
      />
      {showsList ? (
        <div
          data-slot="multi-input-list"
          id={listId}
          role="listbox"
          aria-label={ariaLabel}
          aria-multiselectable
          className="border-border/80 bg-popover text-popover-foreground absolute top-full right-0 left-0 z-50 mt-1 max-h-60 overflow-y-auto overscroll-contain rounded-xl border p-1.5 shadow-md dark:shadow-[0_14px_32px_-10px_oklch(0_0_0/0.4)]"
        >
          {matches.length === 0 ? (
            <p className="text-muted-foreground px-2 py-1.5 text-sm">
              {emptyMessage}
            </p>
          ) : (
            matches.map((option, index) => {
              const unavailable = option.disabled === true || atMax;

              return (
                <button
                  key={option.value}
                  id={`${listId}-${index}`}
                  type="button"
                  role="option"
                  tabIndex={-1}
                  aria-selected={option.value === activeValue}
                  disabled={unavailable}
                  data-selected={option.value === activeValue ? "" : undefined}
                  // Keep focus in the text input so blur never commits the
                  // draft out from under the click.
                  onMouseDown={(event) => event.preventDefault()}
                  onMouseEnter={() => {
                    if (!unavailable) {
                      setActiveValue(option.value);
                    }
                  }}
                  onClick={() => selectOption(option)}
                  className="text-foreground data-selected:bg-accent data-selected:text-accent-foreground hover:bg-accent hover:text-accent-foreground flex w-full cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm outline-none disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <span className="min-w-0 truncate">
                    {option.label ?? option.value}
                  </span>
                </button>
              );
            })
          )}
        </div>
      ) : null}
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

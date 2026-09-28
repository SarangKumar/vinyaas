"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useId,
  useState,
} from "react";

import { cn } from "@/lib/utils";

type CommandContextValue = {
  query: string;
  setQuery: (query: string) => void;
  listId: string;
  inputId: string;
  activeId: string;
  setActiveId: (id: string) => void;
};

const CommandContext = createContext<CommandContextValue | null>(null);

function useCommand() {
  const context = useContext(CommandContext);

  if (!context) {
    throw new Error("Command parts must render inside Command.");
  }

  return context;
}

function visibleOptions(list: HTMLElement | null) {
  return [
    ...(list?.querySelectorAll<HTMLElement>(
      '[role="option"]:not([aria-disabled="true"])',
    ) ?? []),
  ];
}

export type CommandProps = React.ComponentProps<"div"> & {
  onQueryChange?: (query: string) => void;
};

export function Command({
  className,
  children,
  onQueryChange,
  ...props
}: CommandProps) {
  const [query, setQueryState] = useState("");
  const [activeId, setActiveId] = useState("");
  const listId = useId();
  const inputId = useId();

  function setQuery(next: string) {
    setQueryState(next);
    onQueryChange?.(next);
  }

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const first = visibleOptions(document.getElementById(listId))[0];

      setActiveId(first?.id ?? "");
    }, 0);

    return () => window.clearTimeout(timeout);
  }, [query, listId]);

  return (
    <CommandContext.Provider
      value={{
        query,
        setQuery,
        listId,
        inputId,
        activeId,
        setActiveId,
      }}
    >
      <div
        className={cn(
          "border-border bg-background text-foreground flex w-full flex-col overflow-hidden rounded-lg border",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </CommandContext.Provider>
  );
}

export type CommandInputProps = React.ComponentProps<"input">;

export function CommandInput({ className, ...props }: CommandInputProps) {
  const command = useCommand();

  function move(direction: 1 | -1) {
    const options = visibleOptions(document.getElementById(command.listId));
    const index = options.findIndex((option) => option.id === command.activeId);
    const next =
      options[index + direction] ??
      options[direction === 1 ? 0 : options.length - 1];

    if (next) {
      command.setActiveId(next.id);
    }
  }

  return (
    <div className="border-border flex items-center gap-2 border-b px-3">
      <SearchGlyph />
      <input
        {...props}
        id={command.inputId}
        role="combobox"
        aria-expanded="true"
        aria-controls={command.listId}
        aria-autocomplete="list"
        aria-activedescendant={command.activeId || undefined}
        value={command.query}
        className={cn(
          "placeholder:text-muted-foreground h-11 w-full min-w-0 bg-transparent text-sm outline-none",
          className,
        )}
        onChange={(event) => {
          command.setQuery(event.currentTarget.value);
          props.onChange?.(event);
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown") {
            event.preventDefault();
            move(1);
          }

          if (event.key === "ArrowUp") {
            event.preventDefault();
            move(-1);
          }

          if (event.key === "Enter" && command.activeId) {
            event.preventDefault();
            visibleOptions(document.getElementById(command.listId))
              .find((option) => option.id === command.activeId)
              ?.click();
          }

          props.onKeyDown?.(event);
        }}
      />
    </div>
  );
}

function SearchGlyph() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="text-muted-foreground size-4 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

export type CommandListProps = React.ComponentProps<"div">;

export function CommandList({ className, ...props }: CommandListProps) {
  const command = useCommand();

  return (
    <div
      {...props}
      id={command.listId}
      role="listbox"
      aria-labelledby={command.inputId}
      className={cn(
        "max-h-80 overflow-y-auto overscroll-contain p-1.5",
        className,
      )}
    />
  );
}

export type CommandEmptyProps = React.ComponentProps<"p">;

export function CommandEmpty({ className, ...props }: CommandEmptyProps) {
  const command = useCommand();
  const [empty, setEmpty] = useState(false);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setEmpty(
        visibleOptions(document.getElementById(command.listId)).length === 0,
      );
    }, 0);

    return () => window.clearTimeout(timeout);
  }, [command]);

  if (!empty) {
    return null;
  }

  return (
    <p
      className={cn(
        "text-muted-foreground px-3 py-6 text-center text-sm",
        className,
      )}
      {...props}
    />
  );
}

export type CommandGroupProps = React.ComponentProps<"div"> & {
  heading: string;
};

export function CommandGroup({
  heading,
  className,
  children,
  ...props
}: CommandGroupProps) {
  return (
    <div
      role="group"
      aria-label={heading}
      className={cn(
        "grid gap-0.5 py-1 [:not(:has([role=option]))]:hidden",
        className,
      )}
      {...props}
    >
      <p className="text-muted-foreground px-2 pt-2 pb-1 text-xs font-medium">
        {heading}
      </p>
      {children}
    </div>
  );
}

export type CommandItemProps = Omit<React.ComponentProps<"button">, "value"> & {
  value: string;
};

export function CommandItem({
  value,
  className,
  disabled,
  children,
  ...props
}: CommandItemProps) {
  const command = useCommand();
  const id = useId();
  const visible = value
    .toLowerCase()
    .includes(command.query.trim().toLowerCase());

  if (!visible) {
    return null;
  }

  return (
    <button
      {...props}
      id={id}
      type="button"
      role="option"
      aria-selected={command.activeId === id}
      aria-disabled={disabled || undefined}
      disabled={disabled}
      className={cn(
        "hover:bg-accent hover:text-accent-foreground aria-selected:bg-accent aria-selected:text-accent-foreground focus-visible:bg-accent focus-visible:text-accent-foreground flex w-full cursor-pointer items-start gap-2 rounded-md px-2 py-1.5 text-left text-sm outline-none disabled:cursor-not-allowed disabled:opacity-50 [&>svg]:mt-0.5 [&>svg]:shrink-0",
        className,
      )}
      onMouseEnter={() => {
        if (!disabled) {
          command.setActiveId(id);
        }
      }}
    >
      {children}
    </button>
  );
}

export type CommandShortcutProps = React.ComponentProps<"span">;

export function CommandShortcut({ className, ...props }: CommandShortcutProps) {
  return (
    <span
      className={cn(
        "bg-muted text-muted-foreground mt-0.5 ml-auto shrink-0 rounded px-1.5 py-0.5 font-mono text-[0.6875rem] leading-none",
        className,
      )}
      {...props}
    />
  );
}

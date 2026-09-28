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

export type CommandProps = React.ComponentProps<"div">;

export function Command({ className, children, ...props }: CommandProps) {
  const [query, setQuery] = useState("");
  const [activeId, setActiveId] = useState("");
  const listId = useId();
  const inputId = useId();

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
          "bg-muted text-foreground flex w-full flex-col overflow-hidden rounded-md border",
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
        "placeholder:text-muted-foreground h-9 border-b bg-transparent px-3 text-sm outline-none",
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
      className={cn("max-h-72 overflow-y-auto p-1", className)}
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
      className={cn("grid gap-1", className)}
      {...props}
    >
      <p className="text-subtle-foreground px-2 py-1 text-xs font-medium">
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
        "hover:bg-accent aria-selected:bg-accent flex w-full cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm disabled:cursor-not-allowed disabled:opacity-50",
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
      className={cn("text-muted-foreground ml-auto text-xs", className)}
      {...props}
    />
  );
}

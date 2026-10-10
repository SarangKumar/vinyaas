"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { Button } from "../button";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "../command";
import { Popover, PopoverContent, PopoverTrigger } from "../popover";

type ComboboxContextValue = {
  value: string | undefined;
  setValue: (next: string | undefined) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  disabled: boolean;
  labelFor: (value: string | undefined) => string | undefined;
  registerLabel: (value: string, label: string) => void;
  unregisterLabel: (value: string) => void;
};

const ComboboxContext = React.createContext<ComboboxContextValue | null>(null);

function useCombobox() {
  const context = React.useContext(ComboboxContext);

  if (!context) {
    throw new Error("Combobox parts must render inside Combobox.");
  }

  return context;
}

function textContent(node: React.ReactNode): string {
  if (node === null || node === undefined || typeof node === "boolean") {
    return "";
  }

  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }

  if (Array.isArray(node)) {
    return node.map(textContent).join("");
  }

  if (React.isValidElement<{ children?: React.ReactNode }>(node)) {
    return textContent(node.props.children);
  }

  return "";
}

export type ComboboxProps = {
  children: React.ReactNode;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string | undefined) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
};

/**
 * Searchable selection built from Popover + Command.
 * Distinct from Select: typing filters options while the popup is open.
 */
export function Combobox({
  children,
  value,
  defaultValue,
  onValueChange,
  open,
  defaultOpen = false,
  onOpenChange,
  disabled = false,
}: ComboboxProps) {
  const [uncontrolled, setUncontrolled] = React.useState(defaultValue);
  const isControlled = value !== undefined;
  const selected = isControlled ? value : uncontrolled;

  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
  const isOpenControlled = open !== undefined;
  const isOpen = isOpenControlled ? open : uncontrolledOpen;

  const [labels, setLabels] = React.useState(() => new Map<string, string>());

  const setValue = React.useCallback(
    (next: string | undefined) => {
      if (!isControlled) {
        setUncontrolled(next);
      }
      onValueChange?.(next);
    },
    [isControlled, onValueChange],
  );

  const setOpen = React.useCallback(
    (next: boolean) => {
      if (!isOpenControlled) {
        setUncontrolledOpen(next);
      }
      onOpenChange?.(next);
    },
    [isOpenControlled, onOpenChange],
  );

  const registerLabel = React.useCallback(
    (itemValue: string, label: string) => {
      setLabels((prev) => {
        if (prev.get(itemValue) === label) {
          return prev;
        }
        const next = new Map(prev);
        next.set(itemValue, label);
        return next;
      });
    },
    [],
  );

  const unregisterLabel = React.useCallback((itemValue: string) => {
    setLabels((prev) => {
      if (!prev.has(itemValue)) {
        return prev;
      }
      const next = new Map(prev);
      next.delete(itemValue);
      return next;
    });
  }, []);

  const labelFor = React.useCallback(
    (itemValue: string | undefined) => {
      if (!itemValue) {
        return undefined;
      }
      return labels.get(itemValue);
    },
    [labels],
  );

  const context = React.useMemo(
    () => ({
      value: selected,
      setValue,
      open: isOpen,
      setOpen,
      disabled,
      labelFor,
      registerLabel,
      unregisterLabel,
    }),
    [
      selected,
      setValue,
      isOpen,
      setOpen,
      disabled,
      labelFor,
      registerLabel,
      unregisterLabel,
    ],
  );

  return (
    <ComboboxContext.Provider value={context}>
      <Popover open={isOpen} onOpenChange={setOpen}>
        {children}
      </Popover>
    </ComboboxContext.Provider>
  );
}

export type ComboboxTriggerProps = React.ComponentProps<typeof Button> & {
  placeholder?: string;
};

export function ComboboxTrigger({
  className,
  placeholder = "Select option…",
  children,
  "aria-label": ariaLabel,
  disabled: disabledProp,
  ...props
}: ComboboxTriggerProps) {
  const combobox = useCombobox();
  const label = combobox.labelFor(combobox.value);
  const display = children ?? label ?? placeholder;
  const accessibleName =
    ariaLabel ??
    (typeof display === "string" || typeof display === "number"
      ? String(display)
      : placeholder);

  return (
    <PopoverTrigger>
      <Button
        type="button"
        variant="outline"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={combobox.open}
        aria-label={accessibleName}
        disabled={combobox.disabled || disabledProp}
        data-empty={!combobox.value ? "" : undefined}
        className={cn(
          "inline-flex w-full min-w-0 items-center justify-between gap-2 font-normal",
          !combobox.value && "text-muted-foreground",
          className,
        )}
        {...props}
      >
        <span className="truncate">{display}</span>
        <ChevronDownIcon className="text-muted-foreground size-4 shrink-0 opacity-70" />
      </Button>
    </PopoverTrigger>
  );
}

export type ComboboxContentProps = {
  children: React.ReactNode;
  className?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  align?: "start" | "center" | "end";
};

function collectComboboxItems(nodes: React.ReactNode): Array<{
  value: string;
  label: string;
}> {
  const items: Array<{ value: string; label: string }> = [];

  React.Children.forEach(nodes, (child) => {
    if (
      !React.isValidElement<{ value?: unknown; children?: React.ReactNode }>(
        child,
      )
    ) {
      return;
    }

    if (typeof child.props.value !== "string") {
      return;
    }

    items.push({
      value: child.props.value,
      label: textContent(child.props.children),
    });
  });

  return items;
}

export function ComboboxContent({
  children,
  className,
  searchPlaceholder = "Search…",
  emptyMessage = "No results found.",
  align = "start",
}: ComboboxContentProps) {
  const { registerLabel } = useCombobox();

  React.useLayoutEffect(() => {
    for (const item of collectComboboxItems(children)) {
      registerLabel(item.value, item.label);
    }
  }, [children, registerLabel]);

  return (
    <PopoverContent
      align={align}
      // Same width as the trigger, like Select; 18rem until it is measured.
      className={cn("w-[var(--popover-trigger-width,18rem)] p-0", className)}
    >
      <Command className="rounded-md border-0 shadow-none">
        <CommandInput
          placeholder={searchPlaceholder}
          aria-label={searchPlaceholder}
        />
        <CommandList>
          <CommandEmpty>{emptyMessage}</CommandEmpty>
          {children}
        </CommandList>
      </Command>
    </PopoverContent>
  );
}

export type ComboboxItemProps = {
  value: string;
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
  keywords?: string[];
};

export function ComboboxItem({
  value,
  children,
  disabled,
  className,
  keywords,
}: ComboboxItemProps) {
  const combobox = useCombobox();
  const { registerLabel } = combobox;
  const label = textContent(children);

  React.useEffect(() => {
    registerLabel(value, label);
    // Keep labels after unmount so a closed trigger can still show the selection.
  }, [registerLabel, value, label]);

  const selected = combobox.value === value;

  return (
    <CommandItem
      value={[value, label, ...(keywords ?? [])].join(" ")}
      disabled={disabled}
      aria-selected={selected}
      data-checked={selected ? "" : undefined}
      className={cn("gap-2", className)}
      onClick={() => {
        if (disabled) {
          return;
        }
        combobox.setValue(selected ? undefined : value);
        combobox.setOpen(false);
      }}
    >
      <CheckIcon
        className={cn(
          "size-4 shrink-0",
          selected ? "opacity-100" : "opacity-0",
        )}
      />
      <span className="min-w-0 truncate">{children}</span>
    </CommandItem>
  );
}

function ChevronDownIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function CheckIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

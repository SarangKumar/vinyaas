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

  const labelsRef = React.useRef(new Map<string, string>());
  const [, bump] = React.useState(0);

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
      if (labelsRef.current.get(itemValue) === label) {
        return;
      }
      labelsRef.current.set(itemValue, label);
      bump((n) => n + 1);
    },
    [],
  );

  const unregisterLabel = React.useCallback((itemValue: string) => {
    if (!labelsRef.current.has(itemValue)) {
      return;
    }
    labelsRef.current.delete(itemValue);
    bump((n) => n + 1);
  }, []);

  const labelFor = React.useCallback((itemValue: string | undefined) => {
    if (!itemValue) {
      return undefined;
    }
    return labelsRef.current.get(itemValue);
  }, []);

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
  ...props
}: ComboboxTriggerProps) {
  const combobox = useCombobox();
  const label = combobox.labelFor(combobox.value);
  const display = children ?? label ?? placeholder;
  const accessibleName =
    typeof display === "string" || typeof display === "number"
      ? String(display)
      : placeholder;

  return (
    <PopoverTrigger>
      <Button
        type="button"
        variant="outline"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={combobox.open}
        aria-label={props["aria-label"] ?? accessibleName}
        disabled={combobox.disabled || props.disabled}
        data-empty={!combobox.value ? "" : undefined}
        className={cn(
          "w-full min-w-0 justify-between font-normal",
          !combobox.value && "text-muted-foreground",
          className,
        )}
        {...props}
      >
        <span className="truncate">{display}</span>
        <ChevronDownIcon className="text-muted-foreground ml-2 size-4 shrink-0 opacity-70" />
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

export function ComboboxContent({
  children,
  className,
  searchPlaceholder = "Search…",
  emptyMessage = "No results found.",
  align = "start",
}: ComboboxContentProps) {
  return (
    <PopoverContent
      align={align}
      className={cn("w-72 min-w-[12rem] p-0", className)}
    >
      <Command className="rounded-md border-0 shadow-none">
        <CommandInput placeholder={searchPlaceholder} />
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
  const label = textContent(children);

  React.useEffect(() => {
    combobox.registerLabel(value, label);
    return () => combobox.unregisterLabel(value);
  }, [combobox.registerLabel, combobox.unregisterLabel, value, label]);

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

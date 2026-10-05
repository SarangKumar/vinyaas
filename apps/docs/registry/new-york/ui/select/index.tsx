"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

import { cn } from "@/lib/utils";

type Align = "start" | "center" | "end";
type Side = "top" | "bottom";

type SelectContextValue = {
  value: string | undefined;
  setValue: (next: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  disabled: boolean;
  triggerRef: React.RefObject<HTMLElement | null>;
  contentId: string;
  listboxId: string;
  searchId: string;
  query: string;
  setQuery: (query: string) => void;
  activeValue: string | undefined;
  setActiveValue: (value: string | undefined) => void;
  registerLabel: (value: string, label: string) => void;
  unregisterLabel: (value: string) => void;
  labelFor: (value: string | undefined) => string | undefined;
  name?: string;
};

const SelectContext = createContext<SelectContextValue | null>(null);

function assignRef(
  ref: React.Ref<HTMLElement> | undefined,
  node: HTMLElement | null,
) {
  if (typeof ref === "function") {
    ref(node);
    return;
  }

  if (ref) {
    ref.current = node;
  }
}

function useSelect() {
  const context = useContext(SelectContext);

  if (!context) {
    throw new Error("Select components must render inside Select.");
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

function SelectChevron({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      data-slot="select-icon"
      className={cn(
        "pointer-events-none absolute inset-y-0 right-0 flex w-9 items-center justify-center",
        className,
      )}
    >
      <svg
        viewBox="0 0 24 24"
        className="text-muted-foreground size-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </span>
  );
}

export function Select({
  children,
  value,
  defaultValue,
  onValueChange,
  open,
  defaultOpen = false,
  onOpenChange,
  disabled = false,
  name,
}: {
  children: React.ReactNode;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
  /** Optional form field name (hidden input). */
  name?: string;
}) {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const [query, setQuery] = useState("");
  const [activeValue, setActiveValue] = useState<string | undefined>();
  const labelsRef = useRef(new Map<string, string>());
  const triggerRef = useRef<HTMLElement>(null);
  const contentId = useId();
  const listboxId = useId();
  const searchId = useId();

  const isValueControlled = value !== undefined;
  const selectedValue = isValueControlled ? value : uncontrolledValue;
  const isOpenControlled = open !== undefined;
  const isOpen = isOpenControlled ? open : uncontrolledOpen;

  const setValue = useCallback(
    (next: string) => {
      if (!isValueControlled) {
        setUncontrolledValue(next);
      }

      onValueChange?.(next);
    },
    [isValueControlled, onValueChange],
  );

  const setOpen = useCallback(
    (next: boolean) => {
      if (!isOpenControlled) {
        setUncontrolledOpen(next);
      }

      onOpenChange?.(next);

      if (!next) {
        setQuery("");
        setActiveValue(undefined);
        triggerRef.current?.focus();
      }
    },
    [isOpenControlled, onOpenChange],
  );

  const registerLabel = useCallback((itemValue: string, label: string) => {
    labelsRef.current.set(itemValue, label);
  }, []);

  const unregisterLabel = useCallback((itemValue: string) => {
    labelsRef.current.delete(itemValue);
  }, []);

  const labelFor = useCallback((itemValue: string | undefined) => {
    if (!itemValue) {
      return undefined;
    }

    return labelsRef.current.get(itemValue);
  }, []);

  const context = useMemo(
    () => ({
      value: selectedValue,
      setValue,
      open: isOpen,
      setOpen,
      disabled,
      triggerRef,
      contentId,
      listboxId,
      searchId,
      query,
      setQuery,
      activeValue,
      setActiveValue,
      registerLabel,
      unregisterLabel,
      labelFor,
      name,
    }),
    [
      selectedValue,
      setValue,
      isOpen,
      setOpen,
      disabled,
      contentId,
      listboxId,
      searchId,
      query,
      activeValue,
      registerLabel,
      unregisterLabel,
      labelFor,
      name,
    ],
  );

  return (
    <SelectContext.Provider value={context}>
      {name ? (
        <input type="hidden" name={name} value={selectedValue ?? ""} readOnly />
      ) : null}
      {children}
    </SelectContext.Provider>
  );
}

type TriggerProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  ref?: React.Ref<HTMLButtonElement>;
};

export function SelectTrigger({
  className,
  children,
  ref,
  ...props
}: TriggerProps) {
  const {
    open,
    setOpen,
    disabled,
    triggerRef,
    contentId,
    listboxId,
    value,
    labelFor,
  } = useSelect();
  const selectedLabel = labelFor(value);

  return (
    <button
      type="button"
      role="combobox"
      aria-expanded={open}
      aria-controls={open ? listboxId : undefined}
      aria-haspopup="listbox"
      aria-autocomplete="list"
      disabled={disabled}
      data-slot="select-trigger"
      className={cn(
        "border-input bg-background text-foreground focus-visible:ring-ring focus-visible:ring-offset-background relative flex h-10 w-full min-w-0 items-center justify-between rounded-md border py-2 pr-9 pl-3 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      ref={(node) => {
        triggerRef.current = node;
        assignRef(ref, node);
      }}
      onClick={(event) => {
        props.onClick?.(event);

        if (!event.defaultPrevented && !disabled) {
          setOpen(!open);
        }
      }}
      onKeyDown={(event) => {
        props.onKeyDown?.(event);

        if (event.defaultPrevented || disabled) {
          return;
        }

        if (
          event.key === "ArrowDown" ||
          event.key === "Enter" ||
          event.key === " "
        ) {
          event.preventDefault();
          setOpen(true);
        }
      }}
      {...props}
    >
      <span className="flex min-w-0 flex-1 items-center truncate text-left">
        {children}
      </span>
      <SelectChevron />
      <span className="sr-only">
        {selectedLabel ? `Selected ${selectedLabel}` : "No value selected"}
      </span>
      <span id={contentId} className="sr-only">
        Select listbox
      </span>
    </button>
  );
}

export function SelectValue({
  placeholder,
  className,
}: {
  placeholder?: string;
  className?: string;
}) {
  const { value, labelFor } = useSelect();
  const label = labelFor(value);

  return (
    <span
      data-slot="select-value"
      className={cn("truncate", !label && "text-muted-foreground", className)}
    >
      {label ?? placeholder}
    </span>
  );
}

function matchesQuery(label: string, query: string) {
  if (!query.trim()) {
    return true;
  }

  return label.toLowerCase().includes(query.trim().toLowerCase());
}

function filterSelectChildren(
  children: React.ReactNode,
  query: string,
): React.ReactNode {
  const nodes = React.Children.toArray(children);
  const next: React.ReactNode[] = [];

  for (const child of nodes) {
    if (!React.isValidElement(child)) {
      next.push(child);
      continue;
    }

    if (child.type === SelectGroup) {
      const filtered = stripOrphanLabels(
        filterSelectChildren(
          (child.props as { children?: React.ReactNode }).children,
          query,
        ),
      );

      if (React.Children.count(filtered) === 0) {
        continue;
      }

      next.push(React.cloneElement(child, {}, filtered));
      continue;
    }

    if (child.type === SelectItem) {
      const itemProps = child.props as SelectItemProps;
      const label = textContent(itemProps.children);

      if (matchesQuery(label, query)) {
        next.push(child);
      }

      continue;
    }

    if (child.type === SelectLabel || child.type === SelectSeparator) {
      next.push(child);
      continue;
    }

    next.push(child);
  }

  return next;
}

function collectSelectItems(nodes: React.ReactNode): Array<{
  value: string;
  label: string;
  disabled?: boolean;
}> {
  const items: Array<{ value: string; label: string; disabled?: boolean }> = [];

  React.Children.forEach(nodes, (child) => {
    if (!React.isValidElement(child)) {
      return;
    }

    if (child.type === SelectItem) {
      const props = child.props as SelectItemProps;
      items.push({
        value: props.value,
        label: textContent(props.children),
        disabled: props.disabled,
      });
      return;
    }

    if (child.type === SelectGroup) {
      items.push(
        ...collectSelectItems(
          (child.props as { children?: React.ReactNode }).children,
        ),
      );
    }
  });

  return items;
}

function stripOrphanLabels(nodes: React.ReactNode): React.ReactNode {
  const list = React.Children.toArray(nodes);
  const result: React.ReactNode[] = [];
  let pendingLabel: React.ReactElement | null = null;

  for (const node of list) {
    if (React.isValidElement(node) && node.type === SelectLabel) {
      pendingLabel = node;
      continue;
    }

    if (
      React.isValidElement(node) &&
      (node.type === SelectItem || node.type === SelectGroup)
    ) {
      if (pendingLabel) {
        result.push(pendingLabel);
        pendingLabel = null;
      }

      result.push(node);
      continue;
    }

    if (pendingLabel) {
      pendingLabel = null;
    }

    result.push(node);
  }

  return result;
}

type SelectItemProps = {
  value: string;
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
};

export function SelectContent({
  children,
  className,
  align = "start",
  side = "bottom",
  searchPlaceholder = "Search…",
}: {
  children: React.ReactNode;
  className?: string;
  align?: Align;
  side?: Side;
  searchPlaceholder?: string;
}) {
  const select = useSelect();
  const contentRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const wasOpen = useRef(false);
  const [point, setPoint] = useState<{
    top: number;
    left: number;
    width: number;
  } | null>(null);

  useLayoutEffect(() => {
    for (const item of collectSelectItems(children)) {
      select.registerLabel(item.value, item.label);
    }
  }, [children, select]);

  const filteredChildren = useMemo(() => {
    const filtered = filterSelectChildren(children, select.query);
    return stripOrphanLabels(filtered);
  }, [children, select.query]);

  const hasVisibleItems =
    React.Children.toArray(filteredChildren).some(
      (node) => React.isValidElement(node) && node.type === SelectItem,
    ) ||
    React.Children.toArray(filteredChildren).some(
      (node) =>
        React.isValidElement(node) &&
        node.type === SelectGroup &&
        React.Children.toArray(
          (node.props as { children?: React.ReactNode }).children,
        ).some(
          (child) => React.isValidElement(child) && child.type === SelectItem,
        ),
    );

  useLayoutEffect(() => {
    if (!select.open) {
      return;
    }

    function place() {
      const triggerNode = select.triggerRef.current;
      const contentNode = contentRef.current;

      if (!triggerNode || !contentNode) {
        return;
      }

      const trigger = triggerNode.getBoundingClientRect();
      const content = contentNode.getBoundingClientRect();
      const gap = 4;
      let top =
        side === "top"
          ? trigger.top - content.height - gap
          : trigger.bottom + gap;
      let left = trigger.left;
      const width = trigger.width;

      if (align === "center") {
        left = trigger.left + trigger.width / 2 - content.width / 2;
      }

      if (align === "end") {
        left = trigger.right - content.width;
      }

      const fitsBelow =
        trigger.bottom + content.height + gap < window.innerHeight;
      const fitsAbove = trigger.top - content.height - gap > 0;

      if (side === "bottom" && !fitsBelow && fitsAbove) {
        top = trigger.top - content.height - gap;
      }

      if (side === "top" && !fitsAbove && fitsBelow) {
        top = trigger.bottom + gap;
      }

      left = Math.min(
        Math.max(8, left),
        Math.max(8, window.innerWidth - content.width - 8),
      );
      top = Math.min(
        Math.max(8, top),
        Math.max(8, window.innerHeight - content.height - 8),
      );
      setPoint({ top, left, width });
    }

    place();
    const scrollers: EventTarget[] = [window];
    let parent = select.triggerRef.current?.parentElement ?? null;

    while (parent) {
      const style = getComputedStyle(parent);
      const overflow = `${style.overflow}${style.overflowX}${style.overflowY}`;

      if (/(auto|scroll)/.test(overflow)) {
        scrollers.push(parent);
      }

      parent = parent.parentElement;
    }

    for (const scroller of scrollers) {
      scroller.addEventListener("scroll", place);
    }

    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);

    return () => {
      for (const scroller of scrollers) {
        scroller.removeEventListener("scroll", place);
      }

      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place, true);
    };
  }, [select.open, align, side, select.triggerRef, select.query, children]);

  useEffect(() => {
    if (wasOpen.current && !select.open) {
      select.triggerRef.current?.focus();
    }

    wasOpen.current = select.open;

    if (!select.open || select.disabled) {
      return;
    }

    const timeout = window.setTimeout(() => {
      searchRef.current?.focus();
    }, 0);

    function options() {
      return [
        ...(contentRef.current?.querySelectorAll<HTMLElement>(
          '[role="option"]:not([aria-disabled="true"])',
        ) ?? []),
      ];
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" || event.key === "Tab") {
        event.preventDefault();
        select.setOpen(false);
        return;
      }

      const list = options();
      const active = list.find(
        (option) => option.dataset.value === select.activeValue,
      );
      const index = active ? list.indexOf(active) : -1;

      if (event.key === "ArrowDown") {
        event.preventDefault();
        const next = list[index + 1] ?? list[0];
        select.setActiveValue(next?.dataset.value);
        next?.scrollIntoView?.({ block: "nearest" });
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        const next = list[index - 1] ?? list[list.length - 1];
        select.setActiveValue(next?.dataset.value);
        next?.scrollIntoView?.({ block: "nearest" });
      }

      if (event.key === "Enter" && select.activeValue) {
        event.preventDefault();
        select.setValue(select.activeValue);
        select.setOpen(false);
      }
    }

    function onPointerDown(event: PointerEvent) {
      const target = event.target;

      if (!(target instanceof Node)) {
        return;
      }

      if (
        contentRef.current?.contains(target) ||
        select.triggerRef.current?.contains(target)
      ) {
        return;
      }

      select.setOpen(false);
    }

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);

    return () => {
      window.clearTimeout(timeout);
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [select]);

  if (!select.open || select.disabled) {
    return null;
  }

  return createPortal(
    <div
      ref={contentRef}
      id={select.contentId}
      data-slot="select-content"
      style={{
        position: "fixed",
        top: point?.top ?? -9999,
        left: point?.left ?? -9999,
        width: point?.width,
        minWidth: point?.width,
      }}
      className={cn(
        "border-border bg-popover text-popover-foreground z-50 flex max-h-[min(20rem,calc(100dvh-2rem))] flex-col overflow-hidden rounded-md border p-0 text-sm shadow-md motion-reduce:transition-none",
        className,
      )}
    >
      <div className="border-border border-b px-3 py-2">
        <label htmlFor={select.searchId} className="sr-only">
          {searchPlaceholder}
        </label>
        <input
          ref={searchRef}
          id={select.searchId}
          type="search"
          autoComplete="off"
          placeholder={searchPlaceholder}
          value={select.query}
          onChange={(event) => select.setQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "ArrowDown") {
              event.preventDefault();
              const first = contentRef.current?.querySelector<HTMLElement>(
                '[role="option"]:not([aria-disabled="true"])',
              );
              select.setActiveValue(first?.dataset.value);
              first?.focus();
            }
          }}
          className="border-input bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-ring h-9 w-full rounded-md border px-3 text-sm focus-visible:ring-2 focus-visible:outline-none"
        />
      </div>
      <div
        id={select.listboxId}
        role="listbox"
        aria-label="Options"
        className="overflow-y-auto overscroll-contain p-1"
      >
        {hasVisibleItems ? (
          filteredChildren
        ) : (
          <p className="text-muted-foreground px-2 py-6 text-center text-sm">
            No results found.
          </p>
        )}
      </div>
    </div>,
    document.body,
  );
}

export function SelectGroup({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div role="group" className={cn("py-1", className)}>
      {children}
    </div>
  );
}

export function SelectLabel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "text-foreground px-2 py-1.5 text-xs font-semibold tracking-wide",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function SelectSeparator({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      role="separator"
      className={cn("bg-border -mx-1 my-1 h-px", className)}
      {...props}
    />
  );
}

export function SelectItem({
  value,
  disabled,
  children,
  className,
}: SelectItemProps) {
  const select = useSelect();
  const label = textContent(children);
  const selected = select.value === value;
  const highlighted = select.activeValue === value;

  useLayoutEffect(() => {
    select.registerLabel(value, label);
  }, [select, value, label]);

  useEffect(() => {
    if (select.open && !select.activeValue && !disabled) {
      const first = !select.query && selected;
      if (first) {
        select.setActiveValue(value);
      }
    }
  }, [select, value, disabled, selected]);

  return (
    <div
      role="option"
      tabIndex={-1}
      data-value={value}
      aria-selected={selected}
      aria-disabled={disabled || undefined}
      data-highlighted={highlighted ? "" : undefined}
      className={cn(
        "hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground relative flex w-full cursor-default items-center rounded-sm py-2 pr-8 pl-2 text-sm outline-none select-none",
        disabled && "pointer-events-none opacity-50",
        className,
      )}
      onMouseEnter={() => {
        if (!disabled) {
          select.setActiveValue(value);
        }
      }}
      onClick={() => {
        if (disabled) {
          return;
        }

        select.setValue(value);
        select.setOpen(false);
      }}
    >
      <span className="truncate">{children}</span>
      {selected ? (
        <span className="absolute right-2 flex size-4 items-center justify-center">
          <svg
            viewBox="0 0 24 24"
            className="size-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </span>
      ) : null}
    </div>
  );
}

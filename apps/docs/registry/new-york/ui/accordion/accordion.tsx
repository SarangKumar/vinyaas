"use client";

import React, { useContext, useEffect, useId, useRef, useState } from "react";

import { cn } from "@/lib/utils";

type AccordionContextValue = {
  type: "single" | "multiple";
  openValues: readonly string[];
  collapsible: boolean;
  disabled: boolean;
  toggle: (value: string) => void;
};

const AccordionContext = React.createContext<AccordionContextValue | null>(
  null,
);

type ItemContextValue = {
  value: string;
  contentId: string;
  open: boolean;
  disabled: boolean;
};

const ItemContext = React.createContext<ItemContextValue | null>(null);

function useAccordion() {
  const context = useContext(AccordionContext);

  if (!context) {
    throw new Error("Accordion components must render inside Accordion.");
  }

  return context;
}

function useItem() {
  const context = useContext(ItemContext);

  if (!context) {
    throw new Error("Accordion triggers must render inside AccordionItem.");
  }

  return context;
}

function reducedMotion() {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

type AccordionCommon = {
  className?: string;
  children: React.ReactNode;
  collapsible?: boolean;
  disabled?: boolean;
};

type SingleProps = AccordionCommon & {
  type?: "single";
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string | undefined) => void;
};

type MultipleProps = AccordionCommon & {
  type: "multiple";
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
};

export function Accordion(props: SingleProps): React.JSX.Element;
export function Accordion(props: MultipleProps): React.JSX.Element;
export function Accordion({
  className,
  children,
  collapsible = true,
  disabled = false,
  ...props
}: SingleProps | MultipleProps) {
  const type = props.type ?? "single";
  const controlled = props.value !== undefined;
  const initial =
    props.type === "multiple"
      ? (props.defaultValue ?? [])
      : props.defaultValue
        ? [props.defaultValue]
        : [];
  const [uncontrolled, setUncontrolled] = useState<string[]>(initial);
  const openValues =
    props.type === "multiple"
      ? controlled
        ? (props.value ?? [])
        : uncontrolled
      : controlled
        ? props.value
          ? [props.value]
          : []
        : uncontrolled;
  const rootRef = useRef<HTMLDivElement>(null);

  function toggle(item: string) {
    if (props.type === "multiple") {
      const current = openValues;
      const next = current.includes(item)
        ? current.filter((value) => value !== item)
        : [...current, item];

      if (!controlled) {
        setUncontrolled(next);
      }

      props.onValueChange?.(next);
      return;
    }

    const current = openValues[0];
    const next = current === item && collapsible ? undefined : item;

    if (!controlled) {
      setUncontrolled(next ? [next] : []);
    }

    props.onValueChange?.(next);
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    const key = event.key;

    if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(key)) {
      return;
    }

    const triggers = [
      ...(rootRef.current?.querySelectorAll<HTMLButtonElement>(
        "[data-accordion-trigger]",
      ) ?? []),
    ].filter((trigger) => !trigger.disabled);
    const index = triggers.indexOf(document.activeElement as HTMLButtonElement);

    if (index < 0 || triggers.length === 0) {
      return;
    }

    event.preventDefault();
    const next =
      key === "Home"
        ? 0
        : key === "End"
          ? triggers.length - 1
          : key === "ArrowDown"
            ? (index + 1) % triggers.length
            : (index - 1 + triggers.length) % triggers.length;

    triggers[next]?.focus();
  }

  return (
    <AccordionContext.Provider
      value={{ type, openValues, collapsible, disabled, toggle }}
    >
      <div
        ref={rootRef}
        data-type={type}
        className={cn(
          "border-border divide-border divide-y border-y",
          className,
        )}
        onKeyDown={onKeyDown}
      >
        {children}
      </div>
    </AccordionContext.Provider>
  );
}

export function AccordionItem({
  value,
  disabled = false,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  value: string;
  disabled?: boolean;
}) {
  const accordion = useAccordion();
  const contentId = useId();
  const open = accordion.openValues.includes(value);

  return (
    <ItemContext.Provider
      value={{
        value,
        contentId,
        open,
        disabled: disabled || accordion.disabled,
      }}
    >
      <div
        data-state={open ? "open" : "closed"}
        className={className}
        {...props}
      />
    </ItemContext.Provider>
  );
}

export function AccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<"button">) {
  const { toggle } = useAccordion();
  const item = useItem();

  return (
    <button
      type="button"
      data-accordion-trigger=""
      data-state={item.open ? "open" : "closed"}
      aria-expanded={item.open}
      aria-controls={item.contentId}
      className={cn(
        "flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-sm font-medium focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
      disabled={item.disabled || props.disabled}
      onClick={(event) => {
        props.onClick?.(event);

        if (event.defaultPrevented || item.disabled || props.disabled) {
          return;
        }

        toggle(item.value);
      }}
    >
      {children}
      <svg
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        className={cn(
          "size-4 shrink-0 transition-transform duration-200 ease-out motion-reduce:transition-none",
          item.open && "rotate-180",
        )}
      >
        <path
          d="m6 9 6 6 6-6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

export function AccordionContent({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const item = useItem();
  const [shown, setShown] = useState(item.open);

  useEffect(() => {
    if (item.open) {
      const timeout = window.setTimeout(() => setShown(true), 0);

      return () => window.clearTimeout(timeout);
    }

    const timeout = window.setTimeout(
      () => setShown(false),
      reducedMotion() ? 0 : 200,
    );

    return () => window.clearTimeout(timeout);
  }, [item.open]);

  return (
    <div
      id={item.contentId}
      data-accordion-panel=""
      data-state={item.open ? "open" : "closed"}
      hidden={!shown && !item.open}
      className={cn(
        "grid overflow-hidden px-3 text-sm motion-reduce:transition-none",
        item.open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        className,
      )}
      style={
        reducedMotion()
          ? undefined
          : { transition: "grid-template-rows 200ms ease" }
      }
      {...props}
    >
      <div className={cn("min-h-0 overflow-hidden", item.open && "pb-3")}>
        {children}
      </div>
    </div>
  );
}

"use client";

import React, {
  useCallback,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

import { cn } from "@/lib/utils";

import "./navigation-menu.css";

type NavigationMenuContextValue = {
  value: string | null;
  setValue: (value: string | null) => void;
  baseId: string;
  viewportNode: HTMLDivElement | null;
  setViewportNode: (node: HTMLDivElement | null) => void;
  rootRef: React.RefObject<HTMLElement | null>;
  registerTrigger: (value: string, node: HTMLElement | null) => void;
  getTriggers: () => HTMLElement[];
};

type ItemContextValue = {
  value: string;
  triggerId: string;
  contentId: string;
};

const NavigationMenuContext =
  React.createContext<NavigationMenuContextValue | null>(null);
const ItemContext = React.createContext<ItemContextValue | null>(null);

function reducedMotion() {
  return (
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function useNavigationMenu() {
  const context = useContext(NavigationMenuContext);

  if (!context) {
    throw new Error(
      "Navigation menu components must render inside NavigationMenu.",
    );
  }

  return context;
}

function useItem() {
  const context = useContext(ItemContext);

  if (!context) {
    throw new Error(
      "Navigation menu item parts must render inside NavigationMenuItem.",
    );
  }

  return context;
}

function focusables(root: HTMLElement | null) {
  if (!root) {
    return [];
  }

  return [
    ...root.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ),
  ].filter(
    (node) =>
      !node.hasAttribute("disabled") &&
      node.getAttribute("aria-disabled") !== "true",
  );
}

export function NavigationMenu({
  children,
  className,
  value,
  defaultValue = null,
  onValueChange,
  ...props
}: Omit<React.ComponentProps<"nav">, "defaultValue"> & {
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string | null) => void;
}) {
  const [uncontrolled, setUncontrolled] = useState<string | null>(defaultValue);
  const isControlled = value !== undefined;
  const active = isControlled ? value : uncontrolled;
  const baseId = useId();
  const [viewportNode, setViewportNode] = useState<HTMLDivElement | null>(null);
  const rootRef = useRef<HTMLElement>(null);
  const triggersRef = useRef(new Map<string, HTMLElement>());
  const closeTimer = useRef<number | null>(null);

  const setValue = useCallback(
    (next: string | null) => {
      if (!isControlled) {
        setUncontrolled(next);
      }

      onValueChange?.(next);
    },
    [isControlled, onValueChange],
  );

  const clearCloseTimer = useCallback(() => {
    if (closeTimer.current != null) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }, []);

  const scheduleClose = useCallback(() => {
    clearCloseTimer();
    closeTimer.current = window.setTimeout(() => {
      setValue(null);
      closeTimer.current = null;
    }, 120);
  }, [clearCloseTimer, setValue]);

  const registerTrigger = useCallback(
    (itemValue: string, node: HTMLElement | null) => {
      if (node) {
        triggersRef.current.set(itemValue, node);
        return;
      }

      triggersRef.current.delete(itemValue);
    },
    [],
  );

  const getTriggers = useCallback(() => {
    return [...triggersRef.current.values()].filter(Boolean);
  }, []);

  useEffect(() => {
    return () => clearCloseTimer();
  }, [clearCloseTimer]);

  useEffect(() => {
    if (!active) {
      return;
    }

    function onPointerDown(event: PointerEvent) {
      const target = event.target as Node | null;
      const root = rootRef.current;

      if (!root || !target || root.contains(target)) {
        return;
      }

      setValue(null);
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        const activeTrigger = triggersRef.current.get(active ?? "");
        setValue(null);
        activeTrigger?.focus();
      }
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [active, setValue]);

  return (
    <NavigationMenuContext.Provider
      value={{
        value: active,
        setValue,
        baseId,
        viewportNode,
        setViewportNode,
        rootRef,
        registerTrigger,
        getTriggers,
      }}
    >
      <nav
        {...props}
        ref={rootRef}
        data-slot="navigation-menu"
        className={cn("relative z-40 flex max-w-max flex-col", className)}
        onMouseEnter={clearCloseTimer}
        onMouseLeave={scheduleClose}
        onFocusCapture={clearCloseTimer}
      >
        {children}
      </nav>
    </NavigationMenuContext.Provider>
  );
}

export function NavigationMenuList({
  className,
  ...props
}: React.ComponentProps<"ul">) {
  const { getTriggers, value } = useNavigationMenu();

  return (
    <ul
      {...props}
      data-slot="navigation-menu-list"
      className={cn(
        "group flex flex-1 list-none items-center justify-center gap-1",
        className,
      )}
      onKeyDown={(event) => {
        props.onKeyDown?.(event);

        if (event.defaultPrevented) {
          return;
        }

        const triggers = getTriggers();
        const currentIndex = triggers.findIndex(
          (node) => node === document.activeElement,
        );

        if (
          currentIndex < 0 &&
          !event.currentTarget.contains(document.activeElement)
        ) {
          return;
        }

        const focusAt = (index: number) => {
          const node = triggers[index];
          node?.focus();
        };

        if (event.key === "ArrowRight") {
          event.preventDefault();
          const next =
            currentIndex < 0 ? 0 : (currentIndex + 1) % triggers.length;
          focusAt(next);
          return;
        }

        if (event.key === "ArrowLeft") {
          event.preventDefault();
          const next =
            currentIndex < 0
              ? triggers.length - 1
              : (currentIndex - 1 + triggers.length) % triggers.length;
          focusAt(next);
          return;
        }

        if (event.key === "Home") {
          event.preventDefault();
          focusAt(0);
          return;
        }

        if (event.key === "End") {
          event.preventDefault();
          focusAt(triggers.length - 1);
          return;
        }

        if (event.key === "ArrowDown" && value) {
          const viewport = document.querySelector<HTMLElement>(
            '[data-slot="navigation-menu-viewport"]',
          );
          const first = focusables(viewport)[0];

          if (first) {
            event.preventDefault();
            first.focus();
          }
        }
      }}
    />
  );
}

export function NavigationMenuItem({
  children,
  className,
  value: valueProp,
  ...props
}: React.ComponentProps<"li"> & {
  value?: string;
}) {
  const autoId = useId();
  const value = valueProp ?? autoId;
  const { baseId } = useNavigationMenu();

  return (
    <ItemContext.Provider
      value={{
        value,
        triggerId: `${baseId}-trigger-${value}`,
        contentId: `${baseId}-content-${value}`,
      }}
    >
      <li
        {...props}
        data-slot="navigation-menu-item"
        data-value={value}
        className={cn("relative", className)}
      >
        {children}
      </li>
    </ItemContext.Provider>
  );
}

export function NavigationMenuTrigger({
  children,
  className,
  ...props
}: React.ComponentProps<"button">) {
  const { value: active, setValue, registerTrigger } = useNavigationMenu();
  const { value, triggerId, contentId } = useItem();
  const open = active === value;
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    registerTrigger(value, buttonRef.current);
    return () => registerTrigger(value, null);
  }, [registerTrigger, value]);

  return (
    <button
      {...props}
      ref={buttonRef}
      type="button"
      id={triggerId}
      data-slot="navigation-menu-trigger"
      data-state={open ? "open" : "closed"}
      aria-expanded={open}
      aria-controls={contentId}
      className={cn(
        "bg-background text-foreground hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring inline-flex h-9 items-center justify-center gap-1.5 rounded-md px-3 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
        open && "bg-accent text-accent-foreground",
        className,
      )}
      onClick={(event) => {
        props.onClick?.(event);

        if (!event.defaultPrevented) {
          setValue(open ? null : value);
        }
      }}
      onMouseEnter={() => setValue(value)}
      onKeyDown={(event) => {
        props.onKeyDown?.(event);

        if (event.defaultPrevented) {
          return;
        }

        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          setValue(open ? null : value);
          return;
        }

        if (event.key === "ArrowDown") {
          event.preventDefault();
          setValue(value);

          const tryFocus = (attempts = 0) => {
            const viewport = document.querySelector<HTMLElement>(
              '[data-slot="navigation-menu-viewport"]',
            );
            const first = focusables(viewport)[0];

            if (first) {
              first.focus();
              return;
            }

            if (attempts < 12) {
              window.setTimeout(() => tryFocus(attempts + 1), 0);
            }
          };

          window.setTimeout(() => tryFocus(), 0);
        }
      }}
    >
      {children}
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className={cn(
          "size-3.5 opacity-70 transition-transform",
          open && "rotate-180",
        )}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </button>
  );
}

export function NavigationMenuContent({
  children,
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { value: active, viewportNode } = useNavigationMenu();
  const { value, triggerId, contentId } = useItem();
  const open = active === value;
  const [present, setPresent] = useState(open);
  const [exiting, setExiting] = useState(false);
  const presentRef = useRef(open);

  useEffect(() => {
    if (open) {
      const timeout = window.setTimeout(() => {
        presentRef.current = true;
        setPresent(true);
        setExiting(false);
      }, 0);

      return () => window.clearTimeout(timeout);
    }

    if (!presentRef.current) {
      return;
    }

    // Another panel took over — unmount immediately so panels never stack.
    if (active != null && active !== value) {
      const timeout = window.setTimeout(() => {
        presentRef.current = false;
        setPresent(false);
        setExiting(false);
      }, 0);

      return () => window.clearTimeout(timeout);
    }

    const hide = window.setTimeout(
      () => {
        presentRef.current = false;
        setPresent(false);
        setExiting(false);
      },
      reducedMotion() ? 0 : 120,
    );
    const mark = window.setTimeout(() => setExiting(true), 0);

    return () => {
      window.clearTimeout(hide);
      window.clearTimeout(mark);
    };
  }, [open, active, value]);

  if (!present || typeof document === "undefined" || !viewportNode) {
    return null;
  }

  return createPortal(
    <div
      {...props}
      id={contentId}
      role="region"
      aria-labelledby={triggerId}
      data-slot="navigation-menu-content"
      data-state={exiting ? "closed" : "open"}
      className={cn(
        "w-max p-3 sm:p-4",
        exiting ? "vinyaas-navigation-menu-out" : "vinyaas-navigation-menu-in",
        className,
      )}
      onKeyDown={(event) => {
        props.onKeyDown?.(event);

        if (event.defaultPrevented) {
          return;
        }

        const nodes = focusables(event.currentTarget);
        const index = nodes.findIndex(
          (node) => node === document.activeElement,
        );

        if (event.key === "ArrowDown") {
          if (index >= 0 && index < nodes.length - 1) {
            event.preventDefault();
            nodes[index + 1]?.focus();
          }
          return;
        }

        if (event.key === "ArrowUp") {
          event.preventDefault();

          if (index > 0) {
            nodes[index - 1]?.focus();
            return;
          }

          document.getElementById(triggerId)?.focus();
        }
      }}
    >
      {children}
    </div>,
    viewportNode,
  );
}

export function NavigationMenuLink({
  className,
  active,
  ...props
}: React.ComponentProps<"a"> & {
  active?: boolean;
}) {
  return (
    <a
      {...props}
      data-slot="navigation-menu-link"
      data-active={active ? "true" : undefined}
      className={cn(
        "hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring inline-flex h-9 items-center rounded-md px-3 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
        active && "bg-accent text-accent-foreground",
        className,
      )}
    />
  );
}

export function NavigationMenuIndicator({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { value, getTriggers, rootRef } = useNavigationMenu();
  const [style, setStyle] = useState<{ left: number; width: number } | null>(
    null,
  );

  useLayoutEffect(() => {
    if (!value || !rootRef.current) {
      setStyle(null);
      return;
    }

    const trigger = getTriggers().find((node) =>
      node.getAttribute("aria-controls")?.includes(value),
    );

    const item = rootRef.current.querySelector<HTMLElement>(
      `[data-slot="navigation-menu-item"][data-value="${value}"]`,
    );
    const button =
      item?.querySelector<HTMLElement>(
        '[data-slot="navigation-menu-trigger"]',
      ) ?? trigger;

    if (!button || !rootRef.current) {
      setStyle(null);
      return;
    }

    const rootRect = rootRef.current.getBoundingClientRect();
    const buttonRect = button.getBoundingClientRect();
    setStyle({
      left: buttonRect.left - rootRect.left,
      width: buttonRect.width,
    });
  }, [value, getTriggers, rootRef]);

  if (!style) {
    return null;
  }

  return (
    <div
      {...props}
      data-slot="navigation-menu-indicator"
      aria-hidden="true"
      className={cn(
        "bg-border absolute top-full z-10 h-0.5 overflow-hidden rounded-full",
        className,
      )}
      style={{ left: style.left, width: style.width }}
    />
  );
}

export function NavigationMenuViewport({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { value, setViewportNode } = useNavigationMenu();
  const open = value != null;

  return (
    <div
      className={cn(
        // Padding (not margin) keeps the pointer inside the nav while moving
        // from a trigger into the panel, which avoids open/close flicker.
        "absolute top-full left-0 z-50 flex justify-center pt-1.5",
        className,
      )}
    >
      <div
        {...props}
        ref={setViewportNode}
        data-slot="navigation-menu-viewport"
        data-state={open ? "open" : "closed"}
        className={cn(
          "border-border bg-popover text-popover-foreground relative w-max origin-top rounded-md border shadow-md",
          !open && "invisible border-0 shadow-none",
        )}
      />
    </div>
  );
}

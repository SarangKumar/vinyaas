"use client";

import * as React from "react";
import { DayPicker, type DayPickerProps } from "react-day-picker";

import { cn } from "@/lib/utils";
import { buttonVariants } from "../button";

export type CalendarProps = DayPickerProps;

/**
 * Accessible month calendar built on react-day-picker.
 * Styles use Vinyaas tokens; DayPicker owns grid/keyboard behavior.
 */
export function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  components,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("bg-background w-fit p-3", className)}
      classNames={{
        root: cn("w-fit", classNames?.root),
        months: cn(
          "relative flex flex-col gap-4 sm:flex-row",
          classNames?.months,
        ),
        month: cn("flex w-full flex-col gap-4", classNames?.month),
        month_caption: cn(
          "relative flex h-8 w-full items-center justify-center px-10",
          classNames?.month_caption,
        ),
        caption_label: cn("text-sm font-medium", classNames?.caption_label),
        nav: cn(
          "absolute inset-x-0 top-0 flex items-center justify-between",
          classNames?.nav,
        ),
        button_previous: cn(
          buttonVariants({ variant: "outline", size: "icon-sm" }),
          "size-8",
          classNames?.button_previous,
        ),
        button_next: cn(
          buttonVariants({ variant: "outline", size: "icon-sm" }),
          "size-8",
          classNames?.button_next,
        ),
        month_grid: cn("w-full border-collapse", classNames?.month_grid),
        weekdays: cn("flex", classNames?.weekdays),
        weekday: cn(
          "text-muted-foreground w-8 rounded-md text-[0.8rem] font-normal",
          classNames?.weekday,
        ),
        week: cn("mt-2 flex w-full", classNames?.week),
        day: cn(
          "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:rounded-md",
          classNames?.day,
        ),
        day_button: cn(
          buttonVariants({ variant: "ghost", size: "icon-sm" }),
          "size-8 font-normal aria-selected:opacity-100",
          classNames?.day_button,
        ),
        selected: cn(
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground rounded-md",
          classNames?.selected,
        ),
        today: cn(
          "bg-accent text-accent-foreground rounded-md",
          classNames?.today,
        ),
        outside: cn(
          "text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
          classNames?.outside,
        ),
        disabled: cn("text-muted-foreground opacity-50", classNames?.disabled),
        hidden: cn("invisible", classNames?.hidden),
        focused: cn("relative z-10", classNames?.focused),
      }}
      components={{
        Chevron: ({
          orientation,
          className: chevronClassName,
          ...chevronProps
        }) => {
          if (orientation === "left") {
            return (
              <ChevronLeftIcon
                className={cn("size-4", chevronClassName)}
                {...chevronProps}
              />
            );
          }

          if (orientation === "right") {
            return (
              <ChevronRightIcon
                className={cn("size-4", chevronClassName)}
                {...chevronProps}
              />
            );
          }

          return (
            <ChevronDownIcon
              className={cn("size-4", chevronClassName)}
              {...chevronProps}
            />
          );
        },
        ...components,
      }}
      {...props}
    />
  );
}

function ChevronLeftIcon(props: React.ComponentProps<"svg">) {
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
      <path d="m15 6-6 6 6 6" />
    </svg>
  );
}

function ChevronRightIcon(props: React.ComponentProps<"svg">) {
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
      <path d="m9 6 6 6-6 6" />
    </svg>
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

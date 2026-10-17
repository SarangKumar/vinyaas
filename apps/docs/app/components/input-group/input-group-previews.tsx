"use client";

import type { ControlValues } from "@/components/component-demo";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
} from "@/registry/new-york/ui/input-group";

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="size-4">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
      <path
        d="m20 20-3.5-3.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function InputGroupPreview({ values }: { values: ControlValues }) {
  const variant = (values.variant as string) || "icon";

  return (
    <InputGroup className="max-w-sm">
      {variant === "icon" && (
        <InputGroupAddon>
          <SearchIcon />
        </InputGroupAddon>
      )}
      {variant === "text" && <InputGroupText>https://</InputGroupText>}
      {variant === "currency" && <InputGroupText>$</InputGroupText>}
      <InputGroupInput
        aria-label={variant === "currency" ? "Amount" : "Search"}
        placeholder={
          variant === "currency"
            ? "0.00"
            : variant === "text"
              ? "vinyaas.dev"
              : (values.placeholder as string) || "Search…"
        }
        disabled={values.disabled as boolean}
      />
      {variant === "currency" && <InputGroupText>USD</InputGroupText>}
      {variant === "action" && (
        <InputGroupButton disabled={values.disabled as boolean}>
          Submit
        </InputGroupButton>
      )}
    </InputGroup>
  );
}

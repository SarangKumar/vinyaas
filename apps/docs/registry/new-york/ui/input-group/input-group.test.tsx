import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupTextarea,
} from "./input-group";

describe("Input Group", () => {
  it("renders a field, addon, and action", () => {
    render(
      <InputGroup className="max-w-sm">
        <InputGroupAddon>https://</InputGroupAddon>
        <InputGroupInput aria-label="Website" placeholder="example.com" />
        <InputGroupButton>Copy</InputGroupButton>
      </InputGroup>,
    );

    expect(screen.getByRole("textbox", { name: "Website" })).toBeInstanceOf(
      HTMLInputElement,
    );
    expect(screen.getByRole("button", { name: "Copy" })).toHaveClass("h-7");
    expect(screen.getByText("https://").parentElement).toHaveClass("max-w-sm");
  });

  it("renders a textarea and merges className", () => {
    render(
      <InputGroup>
        <InputGroupTextarea aria-label="Notes" className="min-h-24" />
      </InputGroup>,
    );

    expect(screen.getByRole("textbox", { name: "Notes" })).toHaveClass(
      "min-h-24",
      "bg-transparent",
    );
  });
});

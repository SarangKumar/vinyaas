import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./command";

function Menu({ onSelect = () => undefined }: { onSelect?: () => void }) {
  return (
    <Command>
      <CommandInput aria-label="Search" />
      <CommandList>
        <CommandEmpty>No matching pages.</CommandEmpty>
        <CommandGroup heading="Components">
          <CommandItem value="Button" onClick={onSelect}>
            Button
          </CommandItem>
          <CommandItem value="Input" disabled>
            Input
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  );
}

describe("Command", () => {
  it("filters items and announces an empty list", async () => {
    render(<Menu />);
    const input = screen.getByRole("combobox", { name: "Search" });

    expect(input).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("option", { name: "Button" })).toBeInTheDocument();

    fireEvent.change(input, { target: { value: "missing" } });

    expect(screen.queryByRole("option", { name: "Button" })).toBeNull();
    expect(await screen.findByText("No matching pages.")).toBeInTheDocument();
  });

  it("moves with the arrow keys and activates the item", () => {
    const calls: string[] = [];

    render(<Menu onSelect={() => calls.push("button")} />);
    const input = screen.getByRole("combobox", { name: "Search" });

    fireEvent.keyDown(input, { key: "ArrowDown" });
    fireEvent.keyDown(input, { key: "Enter" });

    expect(calls).toEqual(["button"]);
    expect(screen.getByRole("option", { name: "Input" })).toBeDisabled();
  });

  it("merges className", () => {
    render(
      <Command className="max-w-sm">
        <CommandInput aria-label="Search" />
        <CommandList>
          <CommandItem value="Button">Button</CommandItem>
        </CommandList>
      </Command>,
    );

    expect(
      screen.getByRole("combobox", { name: "Search" }).parentElement,
    ).toHaveClass("max-w-sm");
  });
});

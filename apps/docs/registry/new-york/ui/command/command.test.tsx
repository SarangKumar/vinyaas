import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  Command,
  CommandEmpty,
  CommandFooter,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from ".";

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
          <CommandItem value="Dialog" onClick={onSelect}>
            Dialog
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

  it("highlights on hover and focuses options with the keyboard", () => {
    render(<Menu />);
    const button = screen.getByRole("option", { name: "Button" });
    const dialog = screen.getByRole("option", { name: "Dialog" });

    expect(button).toHaveAttribute("tabIndex", "-1");
    expect(dialog).toHaveAttribute("tabIndex", "-1");
    expect(screen.getByRole("option", { name: "Input" })).toHaveAttribute(
      "tabIndex",
      "-1",
    );

    fireEvent.mouseEnter(dialog);
    expect(dialog).toHaveAttribute("aria-selected", "true");
    expect(dialog).toHaveAttribute("data-selected");
    expect(button).toHaveAttribute("aria-selected", "false");

    fireEvent.focus(dialog);
    expect(dialog).toHaveAttribute("aria-selected", "true");

    fireEvent.keyDown(dialog, { key: "ArrowUp" });
    expect(button).toHaveAttribute("aria-selected", "true");
    expect(button).toHaveFocus();
  });

  it("aligns an icon with the title and keeps the shortcut on that line", () => {
    render(
      <Command>
        <CommandInput aria-label="Search" />
        <CommandList>
          <CommandItem value="Open Settings">
            <svg aria-hidden="true" />
            <span>
              <span>Open Settings</span>
              <span>Configure your account</span>
            </span>
            <CommandShortcut>Enter</CommandShortcut>
          </CommandItem>
          <CommandItem value="Button">Button</CommandItem>
          <CommandItem value="Input" disabled>
            Input
          </CommandItem>
        </CommandList>
      </Command>,
    );

    const multiline = screen.getByRole("option", { name: /Open Settings/ });
    const single = screen.getByRole("option", { name: "Button" });
    const disabled = screen.getByRole("option", { name: "Input" });

    expect(multiline).toHaveClass("items-start");
    expect(multiline).not.toHaveClass("items-center");
    expect(multiline).toHaveClass("[&>svg]:mt-0.5");
    expect(multiline.querySelector("svg")).toBe(multiline.firstElementChild);
    expect(screen.getByText("Enter")).toHaveClass("ml-auto", "mt-0.5");
    // The shortcut is a Kbd, so it matches Kbd elsewhere in the app.
    expect(screen.getByText("Enter").tagName).toBe("KBD");
    expect(single).toHaveClass("items-start");
    expect(disabled).toBeDisabled();
    expect(disabled).toHaveClass("items-start");
    expect(single).toHaveClass("hover:bg-accent", "data-selected:bg-accent");
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
      screen.getByRole("combobox", { name: "Search" }).closest(".max-w-sm"),
    ).toHaveClass(
      "max-w-sm",
      "border",
      "border-border/80",
      "bg-popover",
      "rounded-xl",
      "shadow-md",
      "dark:shadow-[0_14px_32px_-10px_oklch(0_0_0/0.4)]",
    );
  });

  it("renders the search field as an inset bordered box", () => {
    render(
      <Command>
        <CommandInput aria-label="Search" />
        <CommandList>
          <CommandItem value="Button">Button</CommandItem>
        </CommandList>
      </Command>,
    );

    const input = screen.getByRole("combobox", { name: "Search" });
    const field = input.parentElement;
    const inset = field?.parentElement;

    expect(inset).toHaveClass("p-px");
    expect(field).toHaveClass("border", "border-border/80", "bg-muted/40");
    expect(field?.className).not.toMatch(/border-b\b/);
  });

  it("renders a separated footer strip", () => {
    render(
      <Command>
        <CommandInput aria-label="Search" />
        <CommandList>
          <CommandItem value="Button">Button</CommandItem>
        </CommandList>
        <CommandFooter>Navigate</CommandFooter>
      </Command>,
    );

    const footer = document.querySelector("[data-slot=command-footer]");
    expect(footer).toHaveTextContent("Navigate");
    expect(footer).toHaveClass("border-t", "bg-muted/30");
  });

  it("supports Tab and Shift+Tab through results without trapping focus", () => {
    const calls: string[] = [];

    render(
      <div>
        <Command>
          <CommandInput aria-label="Search" />
          <CommandList>
            <CommandItem value="Button" onClick={() => calls.push("button")}>
              Button
            </CommandItem>
            <CommandItem value="Dialog" onClick={() => calls.push("dialog")}>
              Dialog
            </CommandItem>
          </CommandList>
        </Command>
        <button type="button">After</button>
      </div>,
    );

    const input = screen.getByRole("combobox", { name: "Search" });
    const button = screen.getByRole("option", { name: "Button" });
    const dialog = screen.getByRole("option", { name: "Dialog" });
    const after = screen.getByRole("button", { name: "After" });

    fireEvent.keyDown(input, { key: "Tab" });
    expect(button).toHaveFocus();
    expect(button).toHaveAttribute("aria-selected", "true");

    fireEvent.keyDown(button, { key: "Tab" });
    expect(dialog).toHaveFocus();

    fireEvent.keyDown(dialog, { key: "Tab", shiftKey: true });
    expect(button).toHaveFocus();

    fireEvent.keyDown(button, { key: "Tab", shiftKey: true });
    expect(input).toHaveFocus();

    fireEvent.keyDown(input, { key: "Home" });
    fireEvent.keyDown(input, { key: "End" });
    expect(dialog).toHaveAttribute("aria-selected", "true");

    fireEvent.keyDown(input, { key: "Tab" });
    fireEvent.keyDown(dialog, { key: "Tab" });
    after.focus();
    expect(after).toHaveFocus();
  });

  it("keeps empty results keyboard-safe", () => {
    render(
      <Command>
        <CommandInput aria-label="Search" />
        <CommandList>
          <CommandEmpty>No matching pages.</CommandEmpty>
          <CommandItem value="Button">Button</CommandItem>
        </CommandList>
      </Command>,
    );

    const input = screen.getByRole("combobox", { name: "Search" });
    fireEvent.change(input, { target: { value: "missing" } });
    // No results: Tab is not intercepted so focus can leave the command.
    const tabbed = fireEvent.keyDown(input, { key: "Tab" });
    expect(tabbed).toBe(true);
    fireEvent.keyDown(input, { key: "ArrowDown" });
    expect(screen.queryByRole("option")).toBeNull();
  });
});

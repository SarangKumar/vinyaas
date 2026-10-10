import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Combobox, ComboboxContent, ComboboxItem, ComboboxTrigger } from ".";

function Example({
  onValueChange,
  defaultOpen = false,
  defaultValue,
}: {
  onValueChange?: (value: string | undefined) => void;
  defaultOpen?: boolean;
  defaultValue?: string;
}) {
  return (
    <Combobox
      defaultOpen={defaultOpen}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
    >
      <ComboboxTrigger placeholder="Select framework" />
      <ComboboxContent searchPlaceholder="Search frameworks…">
        <ComboboxItem value="next">Next.js</ComboboxItem>
        <ComboboxItem value="vite">Vite</ComboboxItem>
        <ComboboxItem value="remix" disabled>
          Remix
        </ComboboxItem>
      </ComboboxContent>
    </Combobox>
  );
}

describe("Combobox", () => {
  it("opens from the trigger with combobox semantics", () => {
    render(<Example />);
    const trigger = screen.getByRole("combobox", { name: /select framework/i });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger).toHaveAttribute("aria-haspopup", "listbox");

    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(trigger).toHaveAttribute("aria-controls");
    expect(screen.getByLabelText(/search frameworks/i)).toBeInTheDocument();
  });

  it("labels the search field accessibly", () => {
    render(<Example defaultOpen />);
    const input = screen.getByLabelText(/search frameworks/i);
    expect(input).toHaveAttribute("aria-label", "Search frameworks…");
    expect(input).toHaveAttribute("role", "combobox");
  });

  it("filters options and selects with ArrowDown + Enter", () => {
    const onValueChange = vi.fn();
    render(<Example defaultOpen onValueChange={onValueChange} />);

    const input = screen.getByLabelText(/search frameworks/i);
    fireEvent.change(input, { target: { value: "vit" } });
    expect(screen.getByRole("option", { name: /vite/i })).toBeInTheDocument();
    expect(
      screen.queryByRole("option", { name: /next/i }),
    ).not.toBeInTheDocument();

    fireEvent.keyDown(input, { key: "ArrowDown" });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(onValueChange).toHaveBeenCalledWith("vite");
  });

  it("moves highlight with ArrowUp and ArrowDown", () => {
    render(<Example defaultOpen />);
    const input = screen.getByLabelText(/search frameworks/i);

    fireEvent.keyDown(input, { key: "ArrowDown" });
    expect(screen.getByRole("option", { name: /next/i })).toHaveAttribute(
      "data-selected",
    );

    fireEvent.keyDown(input, { key: "ArrowDown" });
    expect(screen.getByRole("option", { name: /vite/i })).toHaveAttribute(
      "data-selected",
    );

    fireEvent.keyDown(input, { key: "ArrowUp" });
    expect(screen.getByRole("option", { name: /next/i })).toHaveAttribute(
      "data-selected",
    );
  });

  it("closes on Escape", () => {
    render(<Example defaultOpen />);
    fireEvent.keyDown(document, { key: "Escape" });
    expect(
      screen.getByRole("combobox", { name: /select framework/i }),
    ).toHaveAttribute("aria-expanded", "false");
  });

  it("does not select disabled options", () => {
    const onValueChange = vi.fn();
    render(<Example defaultOpen onValueChange={onValueChange} />);
    const remix = screen.getByRole("option", { name: /remix/i });
    expect(remix).toHaveAttribute("aria-disabled", "true");
    fireEvent.click(remix);
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("exposes the selected option via data-checked", () => {
    render(<Example defaultOpen defaultValue="next" />);
    const next = screen.getByRole("option", { name: /next/i });
    expect(next).toHaveAttribute("data-checked");
  });

  it("shows the selected label on the closed trigger", () => {
    render(<Example defaultValue="next" />);
    expect(
      screen.getByRole("combobox", { name: /next\.js/i }),
    ).toHaveTextContent("Next.js");
  });

  it("shows empty results for unmatched queries", async () => {
    render(<Example defaultOpen />);
    fireEvent.change(screen.getByLabelText(/search frameworks/i), {
      target: { value: "zzz" },
    });
    expect(await screen.findByText(/no results found/i)).toBeInTheDocument();
  });

  it("sizes the dropdown to the trigger width", () => {
    render(<Example />);
    const trigger = screen.getByRole("combobox", { name: /select framework/i });
    vi.spyOn(trigger, "getBoundingClientRect").mockReturnValue({
      x: 0,
      y: 0,
      top: 0,
      left: 0,
      right: 240,
      bottom: 36,
      width: 240,
      height: 36,
      toJSON: () => ({}),
    });

    fireEvent.click(trigger);

    const panel = screen.getByRole("dialog");

    expect(panel).toHaveClass("w-[var(--popover-trigger-width,18rem)]");
    expect(panel.style.getPropertyValue("--popover-trigger-width")).toBe(
      "240px",
    );
  });
});

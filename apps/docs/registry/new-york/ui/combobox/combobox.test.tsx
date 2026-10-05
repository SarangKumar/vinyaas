import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Combobox, ComboboxContent, ComboboxItem, ComboboxTrigger } from ".";

function Example({
  onValueChange,
  defaultOpen = false,
}: {
  onValueChange?: (value: string | undefined) => void;
  defaultOpen?: boolean;
}) {
  return (
    <Combobox defaultOpen={defaultOpen} onValueChange={onValueChange}>
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
    expect(
      screen.getByPlaceholderText(/search frameworks/i),
    ).toBeInTheDocument();
  });

  it("filters options and selects with Enter", () => {
    const onValueChange = vi.fn();
    render(<Example defaultOpen onValueChange={onValueChange} />);

    const input = screen.getByPlaceholderText(/search frameworks/i);
    fireEvent.change(input, { target: { value: "vit" } });
    expect(screen.getByRole("option", { name: /vite/i })).toBeInTheDocument();
    expect(
      screen.queryByRole("option", { name: /next/i }),
    ).not.toBeInTheDocument();

    fireEvent.keyDown(input, { key: "ArrowDown" });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(onValueChange).toHaveBeenCalledWith("vite");
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

  it("shows empty results for unmatched queries", async () => {
    render(<Example defaultOpen />);
    fireEvent.change(screen.getByPlaceholderText(/search frameworks/i), {
      target: { value: "zzz" },
    });
    expect(await screen.findByText(/no results found/i)).toBeInTheDocument();
  });
});

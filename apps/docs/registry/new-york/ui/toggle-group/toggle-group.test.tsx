import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { ToggleGroup, ToggleGroupItem } from ".";

function Group(props: Partial<React.ComponentProps<typeof ToggleGroup>>) {
  return (
    <ToggleGroup aria-label="Text style" {...props}>
      <ToggleGroupItem value="bold">Bold</ToggleGroupItem>
      <ToggleGroupItem value="italic">Italic</ToggleGroupItem>
      <ToggleGroupItem value="underline">Underline</ToggleGroupItem>
    </ToggleGroup>
  );
}

describe("ToggleGroup", () => {
  it("renders a labelled group of toggle buttons", () => {
    render(<Group />);

    expect(
      screen.getByRole("group", { name: "Text style" }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("button")).toHaveLength(3);

    for (const button of screen.getAllByRole("button")) {
      expect(button).toHaveAttribute("aria-pressed", "false");
    }
  });

  it("allows one pressed item at a time by default and can turn it off", () => {
    const onValueChange = vi.fn();

    render(<Group onValueChange={onValueChange} />);
    fireEvent.click(screen.getByRole("button", { name: "Bold" }));
    expect(onValueChange).toHaveBeenLastCalledWith(["bold"]);

    fireEvent.click(screen.getByRole("button", { name: "Italic" }));
    expect(onValueChange).toHaveBeenLastCalledWith(["italic"]);
    expect(screen.getByRole("button", { name: "Bold" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
    expect(screen.getByRole("button", { name: "Italic" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );

    fireEvent.click(screen.getByRole("button", { name: "Italic" }));
    expect(onValueChange).toHaveBeenLastCalledWith([]);
  });

  it("allows several pressed items with multiple", () => {
    render(<Group multiple defaultValue={["bold"]} />);

    fireEvent.click(screen.getByRole("button", { name: "Underline" }));

    expect(screen.getByRole("button", { name: "Bold" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("button", { name: "Underline" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("follows a controlled value", () => {
    const onValueChange = vi.fn();
    const { rerender } = render(
      <Group value={["bold"]} onValueChange={onValueChange} />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Italic" }));
    expect(onValueChange).toHaveBeenCalledWith(["italic"]);
    expect(screen.getByRole("button", { name: "Italic" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );

    rerender(<Group value={["italic"]} onValueChange={onValueChange} />);
    expect(screen.getByRole("button", { name: "Italic" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("disables every item with the group disabled prop and one item on its own", () => {
    const { rerender } = render(<Group disabled />);

    for (const button of screen.getAllByRole("button")) {
      expect(button).toBeDisabled();
    }

    rerender(
      <ToggleGroup aria-label="Text style">
        <ToggleGroupItem value="bold">Bold</ToggleGroupItem>
        <ToggleGroupItem value="italic" disabled>
          Italic
        </ToggleGroupItem>
      </ToggleGroup>,
    );

    expect(screen.getByRole("button", { name: "Bold" })).toBeEnabled();
    expect(screen.getByRole("button", { name: "Italic" })).toBeDisabled();
  });

  it("moves focus with arrow keys, Home, and End, skipping disabled items", () => {
    render(
      <ToggleGroup aria-label="Align">
        <ToggleGroupItem value="left">Left</ToggleGroupItem>
        <ToggleGroupItem value="center" disabled>
          Center
        </ToggleGroupItem>
        <ToggleGroupItem value="right">Right</ToggleGroupItem>
      </ToggleGroup>,
    );

    const left = screen.getByRole("button", { name: "Left" });
    const right = screen.getByRole("button", { name: "Right" });

    left.focus();
    fireEvent.keyDown(left, { key: "ArrowRight" });
    expect(right).toHaveFocus();

    fireEvent.keyDown(right, { key: "ArrowRight" });
    expect(left).toHaveFocus();

    fireEvent.keyDown(left, { key: "End" });
    expect(right).toHaveFocus();

    fireEvent.keyDown(right, { key: "Home" });
    expect(left).toHaveFocus();
  });

  it("uses vertical arrow keys for vertical groups", () => {
    render(<Group orientation="vertical" />);

    const bold = screen.getByRole("button", { name: "Bold" });

    bold.focus();
    fireEvent.keyDown(bold, { key: "ArrowRight" });
    expect(bold).toHaveFocus();

    fireEvent.keyDown(bold, { key: "ArrowDown" });
    expect(screen.getByRole("button", { name: "Italic" })).toHaveFocus();
  });

  it("joins items when spacing is 0 and separates them otherwise", () => {
    const { rerender } = render(<Group variant="outline" />);
    const group = screen.getByRole("group", { name: "Text style" });

    expect(group).toHaveAttribute("data-spacing", "0");
    expect(group.className).toContain("first-child]:rounded-s-md");
    expect(group.className).toContain("-ml-px");

    rerender(<Group variant="outline" spacing={2} />);
    expect(group).toHaveAttribute("data-spacing", "2");
    expect(group.className).not.toContain("-ml-px");
    expect(group).toHaveStyle({ gap: "8px" });
  });

  it("passes variant and size to items", () => {
    render(<Group variant="outline" size="lg" />);

    expect(screen.getByRole("button", { name: "Bold" })).toHaveClass(
      "h-10",
      "border-input",
    );
  });

  it("throws a helpful error when an item renders outside a group", () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});

    expect(() =>
      render(<ToggleGroupItem value="bold">Bold</ToggleGroupItem>),
    ).toThrow("ToggleGroupItem must render inside ToggleGroup.");

    error.mockRestore();
  });
});

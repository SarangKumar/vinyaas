import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from ".";

function TimezoneSelect({
  value,
  defaultValue,
  onValueChange,
  disabled,
}: {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
}) {
  return (
    <Select
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      disabled={disabled}
    >
      <SelectTrigger aria-label="Timezone">
        <SelectValue placeholder="Select a timezone" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>North America</SelectLabel>
          <SelectItem value="est">Eastern Standard Time (EST)</SelectItem>
          <SelectItem value="cst">Central Standard Time (CST)</SelectItem>
        </SelectGroup>
        <SelectGroup>
          <SelectLabel>Asia</SelectLabel>
          <SelectItem value="ist">India Standard Time (IST)</SelectItem>
          <SelectItem value="jst">Japan Standard Time (JST)</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

describe("Select", () => {
  it("renders trigger with placeholder", () => {
    render(<TimezoneSelect />);

    const trigger = screen.getByRole("combobox", { name: "Timezone" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger).toHaveClass("h-9", "min-h-9", "max-h-9", "box-border");
    expect(trigger).not.toHaveClass("h-10");
    expect(screen.getByText("Select a timezone")).toBeInTheDocument();
  });

  it("shows the selected label before the list opens", async () => {
    render(<TimezoneSelect value="est" />);

    await waitFor(() => {
      expect(
        screen.getByText("Eastern Standard Time (EST)"),
      ).toBeInTheDocument();
    });
    expect(screen.queryByRole("listbox")).toBeNull();
  });

  it("opens the listbox and focuses the first option", async () => {
    render(<TimezoneSelect />);

    fireEvent.click(screen.getByRole("combobox", { name: "Timezone" }));

    expect(screen.getByRole("listbox")).toBeInTheDocument();
    expect(screen.getByText("North America")).toBeInTheDocument();

    await waitFor(() => {
      expect(
        screen.getByRole("option", { name: /Eastern Standard Time/ }),
      ).toHaveFocus();
    });
  });

  it("selects an option and updates the trigger", async () => {
    render(<TimezoneSelect defaultValue="est" />);

    fireEvent.click(screen.getByRole("combobox", { name: "Timezone" }));
    fireEvent.click(
      screen.getByRole("option", { name: /India Standard Time/ }),
    );

    await waitFor(() => {
      expect(screen.getByText("India Standard Time (IST)")).toBeInTheDocument();
    });
    expect(screen.queryByRole("listbox")).toBeNull();
  });

  it("supports controlled usage", () => {
    const onValueChange = vi.fn();
    const { rerender } = render(
      <TimezoneSelect value="est" onValueChange={onValueChange} />,
    );

    fireEvent.click(screen.getByRole("combobox", { name: "Timezone" }));
    fireEvent.click(
      screen.getByRole("option", { name: /Japan Standard Time/ }),
    );

    expect(onValueChange).toHaveBeenCalledWith("jst");
    expect(screen.getByText("Eastern Standard Time (EST)")).toBeInTheDocument();

    rerender(<TimezoneSelect value="jst" onValueChange={onValueChange} />);
    expect(screen.getByText("Japan Standard Time (JST)")).toBeInTheDocument();
  });

  it("does not select disabled options", () => {
    render(
      <Select defaultValue="a">
        <SelectTrigger aria-label="Pick">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="a">Alpha</SelectItem>
          <SelectItem value="b" disabled>
            Beta
          </SelectItem>
        </SelectContent>
      </Select>,
    );

    fireEvent.click(screen.getByRole("combobox", { name: "Pick" }));
    const disabled = screen.getByRole("option", { name: "Beta" });
    expect(disabled).toHaveAttribute("aria-disabled", "true");
    fireEvent.click(disabled);
    expect(screen.getByRole("combobox", { name: "Pick" })).toHaveTextContent(
      "Alpha",
    );
  });

  it("does not open when disabled", () => {
    render(<TimezoneSelect disabled />);

    fireEvent.click(screen.getByRole("combobox", { name: "Timezone" }));
    expect(screen.queryByRole("listbox")).toBeNull();
  });

  it("closes on Escape and restores focus", async () => {
    render(<TimezoneSelect />);
    const trigger = screen.getByRole("combobox", { name: "Timezone" });

    fireEvent.click(trigger);
    fireEvent.keyDown(document, { key: "Escape" });

    await waitFor(() => {
      expect(screen.queryByRole("listbox")).toBeNull();
      expect(trigger).toHaveFocus();
    });
  });

  it("navigates options with arrow keys", async () => {
    render(<TimezoneSelect />);

    fireEvent.click(screen.getByRole("combobox", { name: "Timezone" }));
    await waitFor(() => {
      expect(
        screen.getByRole("option", { name: /Eastern Standard Time/ }),
      ).toHaveFocus();
    });
    fireEvent.keyDown(document, { key: "ArrowDown" });

    expect(
      screen.getByRole("option", { name: /Central Standard Time/ }),
    ).toHaveAttribute("data-highlighted");
    expect(
      screen.getByRole("option", { name: /Central Standard Time/ }),
    ).toHaveFocus();
  });

  it("is reachable by Tab and opens with keyboard", () => {
    render(
      <div>
        <button type="button">Before</button>
        <TimezoneSelect />
        <button type="button">After</button>
      </div>,
    );

    const trigger = screen.getByRole("combobox", { name: "Timezone" });
    const before = screen.getByRole("button", { name: "Before" });

    before.focus();
    expect(before).toHaveFocus();
    trigger.focus();
    expect(trigger).toHaveFocus();

    fireEvent.keyDown(trigger, { key: "Enter" });
    expect(screen.getByRole("listbox")).toBeInTheDocument();
  });

  it("selects with Enter and restores focus on Escape", async () => {
    render(<TimezoneSelect />);
    const trigger = screen.getByRole("combobox", { name: "Timezone" });

    fireEvent.keyDown(trigger, { key: "ArrowDown" });
    await waitFor(() => {
      expect(
        screen.getByRole("option", { name: /Eastern Standard Time/ }),
      ).toHaveAttribute("data-highlighted");
    });

    fireEvent.keyDown(document, { key: "ArrowDown" });
    await waitFor(() => {
      expect(
        screen.getByRole("option", { name: /Central Standard Time/ }),
      ).toHaveAttribute("data-highlighted");
    });

    fireEvent.keyDown(document, { key: "Enter" });

    await waitFor(() => {
      expect(screen.queryByRole("listbox")).toBeNull();
      expect(
        screen.getByText("Central Standard Time (CST)"),
      ).toBeInTheDocument();
      expect(trigger).toHaveFocus();
    });

    fireEvent.keyDown(trigger, { key: "Enter" });
    await waitFor(() => {
      expect(screen.getByRole("listbox")).toBeInTheDocument();
    });
    fireEvent.keyDown(document, { key: "Escape" });
    await waitFor(() => {
      expect(screen.queryByRole("listbox")).toBeNull();
      expect(trigger).toHaveFocus();
    });
  });

  it("lets Tab leave the select without trapping focus", async () => {
    render(
      <div>
        <TimezoneSelect />
        <button type="button">After</button>
      </div>,
    );

    const trigger = screen.getByRole("combobox", { name: "Timezone" });
    const after = screen.getByRole("button", { name: "After" });

    fireEvent.click(trigger);
    await waitFor(() => {
      expect(
        screen.getByRole("option", { name: /Eastern Standard Time/ }),
      ).toHaveFocus();
    });

    fireEvent.keyDown(document, { key: "Tab" });
    await waitFor(() => {
      expect(
        screen.getByRole("option", { name: /Central Standard Time/ }),
      ).toHaveAttribute("data-highlighted");
    });

    // Advance to the last option, then Tab past it to leave without a trap.
    fireEvent.keyDown(document, { key: "End" });
    await waitFor(() => {
      expect(
        screen.getByRole("option", { name: /Japan Standard Time/ }),
      ).toHaveAttribute("data-highlighted");
    });

    fireEvent.keyDown(document, { key: "Tab" });

    await waitFor(() => {
      expect(screen.queryByRole("listbox")).toBeNull();
    });

    after.focus();
    expect(after).toHaveFocus();
    expect(trigger).not.toHaveFocus();
  });

  it("moves through options with Tab and Shift+Tab while open", async () => {
    render(<TimezoneSelect />);

    fireEvent.click(screen.getByRole("combobox", { name: "Timezone" }));
    await waitFor(() => {
      expect(
        screen.getByRole("option", { name: /Eastern Standard Time/ }),
      ).toHaveFocus();
    });

    fireEvent.keyDown(document, { key: "Tab" });
    await waitFor(() => {
      expect(
        screen.getByRole("option", { name: /Central Standard Time/ }),
      ).toHaveAttribute("data-highlighted");
    });

    fireEvent.keyDown(document, { key: "Tab", shiftKey: true });
    await waitFor(() => {
      expect(
        screen.getByRole("option", { name: /Eastern Standard Time/ }),
      ).toHaveAttribute("data-highlighted");
    });

    fireEvent.keyDown(document, { key: "Home" });
    fireEvent.keyDown(document, { key: "End" });
    await waitFor(() => {
      expect(
        screen.getByRole("option", { name: /Japan Standard Time/ }),
      ).toHaveAttribute("data-highlighted");
    });
  });

  it("renders a scrollable list for long option sets", () => {
    render(
      <Select>
        <SelectTrigger aria-label="Long">
          <SelectValue placeholder="Pick" />
        </SelectTrigger>
        <SelectContent>
          {Array.from({ length: 30 }, (_, index) => (
            <SelectItem key={index} value={`v-${index}`}>
              Option {index + 1}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>,
    );

    fireEvent.click(screen.getByRole("combobox", { name: "Long" }));
    const listbox = screen.getByRole("listbox");
    expect(listbox.className).toMatch(/overflow-y-auto/);
    expect(
      screen.getByRole("option", { name: "Option 30" }),
    ).toBeInTheDocument();
  });
});

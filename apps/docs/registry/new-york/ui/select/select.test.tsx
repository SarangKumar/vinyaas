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
      <SelectContent searchPlaceholder="Search timezones">
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

    expect(screen.getByRole("combobox", { name: "Timezone" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
    expect(screen.getByText("Select a timezone")).toBeInTheDocument();
  });

  it("opens dropdown and shows grouped options", async () => {
    render(<TimezoneSelect />);

    fireEvent.click(screen.getByRole("combobox", { name: "Timezone" }));

    expect(screen.getByRole("combobox")).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    expect(screen.getByRole("listbox")).toBeInTheDocument();
    expect(screen.getByText("North America")).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: /India Standard Time/ }),
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByPlaceholderText("Search timezones")).toHaveFocus();
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

  it("filters options with case-insensitive search", () => {
    render(<TimezoneSelect />);

    fireEvent.click(screen.getByRole("combobox", { name: "Timezone" }));
    fireEvent.change(screen.getByPlaceholderText("Search timezones"), {
      target: { value: "japan" },
    });

    expect(
      screen.getByRole("option", { name: /Japan Standard Time/ }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("option", { name: /Eastern Standard Time/ }),
    ).toBeNull();
    expect(screen.getByText("Asia")).toBeInTheDocument();
    expect(screen.queryByText("North America")).toBeNull();
  });

  it("shows empty state when search matches nothing", () => {
    render(<TimezoneSelect />);

    fireEvent.click(screen.getByRole("combobox", { name: "Timezone" }));
    fireEvent.change(screen.getByPlaceholderText("Search timezones"), {
      target: { value: "zzz" },
    });

    expect(screen.getByText("No results found.")).toBeInTheDocument();
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

  it("navigates options with arrow keys", () => {
    render(<TimezoneSelect />);

    fireEvent.click(screen.getByRole("combobox", { name: "Timezone" }));
    fireEvent.keyDown(document, { key: "ArrowDown" });

    expect(
      screen.getByRole("option", { name: /Eastern Standard Time/ }),
    ).toHaveAttribute("data-highlighted");
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

import { fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";

import { MultiInput } from ".";

function field(name = "Recipients") {
  return screen.getByRole("textbox", { name });
}

describe("Multi Input", () => {
  it("commits an entry on Enter and keeps the field empty", () => {
    const onValueChange = vi.fn();
    render(
      <MultiInput aria-label="Recipients" onValueChange={onValueChange} />,
    );

    fireEvent.change(field(), { target: { value: "design" } });
    fireEvent.keyDown(field(), { key: "Enter" });

    expect(onValueChange).toHaveBeenCalledWith(["design"]);
    expect(screen.getByText("design")).toBeInTheDocument();
    expect(field()).toHaveValue("");
  });

  it("splits separators while typing and pasting, keeping the trailing text", () => {
    render(<MultiInput aria-label="Recipients" />);

    fireEvent.change(field(), { target: { value: "one,two,thr" } });

    expect(screen.getByText("one")).toBeInTheDocument();
    expect(screen.getByText("two")).toBeInTheDocument();
    expect(field()).toHaveValue("thr");
  });

  it("trims entries, drops blanks, and ignores duplicates by default", () => {
    render(<MultiInput aria-label="Recipients" defaultValue={["one"]} />);

    fireEvent.change(field(), { target: { value: " one , , two ," } });

    expect(screen.getAllByText("one")).toHaveLength(1);
    expect(screen.getByText("two")).toBeInTheDocument();
  });

  it("removes the last value on Backspace in an empty field", () => {
    render(
      <MultiInput aria-label="Recipients" defaultValue={["one", "two"]} />,
    );

    fireEvent.keyDown(field(), { key: "Backspace" });

    expect(screen.queryByText("two")).toBeNull();
    expect(screen.getByText("one")).toBeInTheDocument();
  });

  it("removes a value with its remove button", () => {
    render(
      <MultiInput aria-label="Recipients" defaultValue={["one", "two"]} />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Remove one" }));

    expect(screen.queryByText("one")).toBeNull();
    expect(screen.getByText("two")).toBeInTheDocument();
  });

  it("keeps a rejected entry in the field and marks it invalid", () => {
    render(
      <MultiInput
        aria-label="Recipients"
        validate={(value) => value.includes("@")}
      />,
    );

    fireEvent.change(field(), { target: { value: "nope," } });

    expect(screen.queryByText("nope")).toBeNull();
    expect(field()).toHaveValue("nope,");
    expect(field()).toHaveAttribute("aria-invalid", "true");

    fireEvent.change(field(), { target: { value: "ada@vinyaas.dev" } });
    fireEvent.keyDown(field(), { key: "Enter" });

    expect(screen.getByText("ada@vinyaas.dev")).toBeInTheDocument();
    expect(field()).not.toHaveAttribute("aria-invalid");
  });

  it("stops at max and leaves the extra entries in the field", () => {
    render(<MultiInput aria-label="Recipients" max={2} />);

    fireEvent.change(field(), { target: { value: "one,two,three," } });

    expect(screen.getByText("one")).toBeInTheDocument();
    expect(screen.getByText("two")).toBeInTheDocument();
    expect(screen.queryByText("three")).toBeNull();
    expect(field()).toHaveValue("three,");
  });

  it("supports a controlled value", () => {
    function Controlled() {
      const [values, setValues] = useState<string[]>([]);

      return (
        <MultiInput
          aria-label="Recipients"
          value={values}
          onValueChange={setValues}
        />
      );
    }

    render(<Controlled />);

    fireEvent.change(field(), { target: { value: "one," } });

    expect(screen.getByText("one")).toBeInTheDocument();
  });

  it("commits the field on blur", () => {
    render(<MultiInput aria-label="Recipients" />);

    fireEvent.change(field(), { target: { value: "one" } });
    fireEvent.blur(field());

    expect(screen.getByText("one")).toBeInTheDocument();
    expect(field()).toHaveValue("");
  });

  it("submits one hidden input per value when named", () => {
    const { container } = render(
      <MultiInput
        aria-label="Recipients"
        name="recipients"
        defaultValue={["one", "two"]}
      />,
    );

    const hidden = [
      ...container.querySelectorAll<HTMLInputElement>('input[type="hidden"]'),
    ];

    expect(hidden.map((input) => input.value)).toEqual(["one", "two"]);
    expect(hidden.every((input) => input.name === "recipients")).toBe(true);
  });

  it("disables the field and its remove buttons", () => {
    render(
      <MultiInput aria-label="Recipients" defaultValue={["one"]} disabled />,
    );

    expect(field()).toBeDisabled();
    expect(screen.getByRole("button", { name: "Remove one" })).toBeDisabled();
  });

  it("forwards aria-describedby and aria-invalid to the text input", () => {
    render(
      <MultiInput
        aria-label="Recipients"
        aria-describedby="recipients-help"
        aria-invalid
      />,
    );

    expect(field()).toHaveAttribute("aria-describedby", "recipients-help");
    expect(field()).toHaveAttribute("aria-invalid", "true");
  });

  it("allows duplicates when asked", () => {
    render(<MultiInput aria-label="Recipients" allowDuplicates />);

    fireEvent.change(field(), { target: { value: "one,one," } });

    expect(screen.getAllByText("one")).toHaveLength(2);
  });
});

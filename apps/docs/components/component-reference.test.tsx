import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ComponentReference } from "./component-reference";

describe("ComponentReference", () => {
  it("renders the shared documentation sections", () => {
    render(
      <ComponentReference
        title="Input"
        description="A text field."
        install="vinyaas add input"
        usage="<Input />"
        source="export function Input() {}"
      >
        <input aria-label="Email" />
      </ComponentReference>,
    );

    expect(screen.getByRole("heading", { name: "Input" })).toBeInTheDocument();
    expect(screen.getByText("A text field.")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Preview" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Email" })).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Installation" }),
    ).toBeInTheDocument();
    expect(screen.getByText("vinyaas add input")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Usage" })).toBeInTheDocument();
    expect(screen.getByText("<Input />")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Source" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Preview" })).toHaveAttribute(
      "id",
      "preview",
    );
    expect(
      screen.getByRole("heading", { name: "Installation" }),
    ).toHaveAttribute("id", "installation");
    expect(screen.getByRole("heading", { name: "Usage" })).toHaveAttribute(
      "id",
      "usage",
    );
    expect(screen.getByRole("heading", { name: "Source" })).toHaveAttribute(
      "id",
      "source",
    );
  });
});

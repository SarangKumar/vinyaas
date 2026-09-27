import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { CodeBlock } from "./code-block";

const shortCode = "vinyaas add button";
const longCode = Array.from(
  { length: 20 },
  (_, index) => `line ${index + 1}`,
).join("\n");

describe("CodeBlock", () => {
  it("shows short code without a view control", () => {
    render(<CodeBlock code={shortCode} language="bash" />);

    expect(screen.getByText(shortCode)).toBeInTheDocument();
    expect(screen.getByText("bash")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "View code" })).toBeNull();
    expect(
      screen.getByRole("button", { name: "Copy code" }),
    ).toBeInTheDocument();
  });

  it("collapses long code and can expand and collapse it again", () => {
    render(<CodeBlock code={longCode} language="tsx" />);

    expect(screen.getByText("tsx")).toBeInTheDocument();
    expect(screen.getByText(/line 20/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "View code" }));
    expect(screen.getByRole("button", { name: "Hide code" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    fireEvent.click(screen.getByRole("button", { name: "Hide code" }));
    expect(screen.getByRole("button", { name: "View code" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
    expect(screen.getByText(/line 20/)).toBeInTheDocument();
  });
});

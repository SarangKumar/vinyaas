import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { UserCursor } from ".";

describe("UserCursor", () => {
  it("renders the name label by default", () => {
    const { getByText } = render(<UserCursor name="Alice" />);
    expect(getByText("Alice")).toBeTruthy();
  });

  it("hides the label when labelHidden is set", () => {
    const { queryByText } = render(<UserCursor name="Alice" labelHidden />);
    expect(queryByText("Alice")).toBeNull();
  });

  it("applies the color to label and cursor", () => {
    const { container } = render(<UserCursor name="Bob" color="#e11d48" />);
    const label = container.querySelector("[data-slot='user-cursor-label']");
    expect(label).toBeTruthy();
    expect((label as HTMLElement).style.backgroundColor).toBe(
      "rgb(225, 29, 72)",
    );
  });

  it("forwards className to the wrapper", () => {
    const { container } = render(
      <UserCursor name="Carol" className="my-class" />,
    );
    expect(container.querySelector("[data-slot='user-cursor']")).toHaveClass(
      "my-class",
    );
  });

  it("is aria-hidden on the SVG pointer", () => {
    const { container } = render(<UserCursor name="Dan" />);
    expect(container.querySelector("svg")).toHaveAttribute("aria-hidden");
  });

  it("applies data-variant to the label", () => {
    const { container } = render(<UserCursor name="Eve" labelVariant="pill" />);
    const label = container.querySelector("[data-slot='user-cursor-label']");
    expect(label).toHaveAttribute("data-variant", "pill");
  });

  it("renders a bubble tail element for the bubble variant", () => {
    const { container } = render(
      <UserCursor name="Frank" labelVariant="bubble" color="#7c3aed" />,
    );
    const label = container.querySelector("[data-slot='user-cursor-label']");
    // bubble tail is an aria-hidden span inside the label
    const tail = label?.querySelector("[aria-hidden='true']");
    expect(tail).toBeTruthy();
  });

  it("does not render a bubble tail for non-bubble variants", () => {
    const { container } = render(
      <UserCursor name="Grace" labelVariant="pill" />,
    );
    const label = container.querySelector("[data-slot='user-cursor-label']");
    expect(label?.querySelector("[aria-hidden='true']")).toBeNull();
  });
});

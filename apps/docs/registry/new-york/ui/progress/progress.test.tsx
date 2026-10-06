import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Progress } from ".";

describe("Progress", () => {
  it("renders a native progress element with value and max", () => {
    render(<Progress aria-label="Upload" value={40} max={100} />);

    const progress = screen.getByRole("progressbar", { name: "Upload" });

    expect(progress.tagName).toBe("PROGRESS");
    expect(progress).toHaveAttribute("value", "40");
    expect(progress).toHaveAttribute("max", "100");
  });

  it("omits value for the native indeterminate state", () => {
    render(<Progress aria-label="Loading" />);

    const progress = screen.getByRole("progressbar", { name: "Loading" });

    expect(progress).not.toHaveAttribute("value");
    expect(progress).toHaveAttribute("max", "100");
    expect(progress).not.toHaveAttribute("role");
  });

  it("defaults max to 100 so value maps to a fill percentage", () => {
    render(<Progress aria-label="Upload" value={40} />);

    const progress = screen.getByRole("progressbar", { name: "Upload" });
    expect(progress).toHaveAttribute("value", "40");
    expect(progress).toHaveAttribute("max", "100");
  });

  it("stays full-width and shrinkable in flex layouts", () => {
    render(<Progress aria-label="Responsive" value={58} className="min-w-0" />);

    const progress = screen.getByRole("progressbar", { name: "Responsive" });
    expect(progress.className).toMatch(/w-full/);
    expect(progress.className).toMatch(/min-w-0/);
    expect(progress.className).toMatch(/max-w-full/);
    expect(progress.className).toMatch(/block/);
  });

  it("passes through className, id, and a ref", () => {
    const ref = createRef<HTMLProgressElement>();

    render(
      <Progress
        ref={ref}
        id="upload"
        aria-label="Upload"
        value={1}
        max={4}
        className="max-w-sm"
      />,
    );

    expect(ref.current).toBe(screen.getByRole("progressbar"));
    expect(ref.current).toHaveAttribute("id", "upload");
    expect(ref.current).toHaveClass("h-2", "max-w-sm", "bg-muted");
  });

  it("fills with the primary theme token class", () => {
    render(<Progress aria-label="Theme fill" value={60} max={100} />);

    const progress = screen.getByRole("progressbar", { name: "Theme fill" });
    expect(progress.className).toMatch(
      /\[&::-webkit-progress-value\]:bg-primary/,
    );
    expect(progress.className).toMatch(/\[&::-moz-progress-bar\]:bg-primary/);
    expect(progress.className).not.toMatch(/bg-(?:red|blue|green|orange)-\d+/);
  });
});

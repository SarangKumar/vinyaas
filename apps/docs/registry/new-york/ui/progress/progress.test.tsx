import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Progress } from "./progress";

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
    expect(progress).not.toHaveAttribute("role");
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
});

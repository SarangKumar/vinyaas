import { fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { describe, expect, it } from "vitest";

import { RangeSlider, Slider } from ".";

describe("Slider", () => {
  it("renders a native range input", () => {
    render(<Slider aria-label="Volume" defaultValue={40} />);

    const slider = screen.getByRole("slider", { name: "Volume" });

    expect(slider.tagName).toBe("INPUT");
    expect(slider).toHaveAttribute("type", "range");
    expect(slider).toHaveAttribute("min", "0");
    expect(slider).toHaveAttribute("max", "100");
    expect(slider).toHaveValue("40");
    expect(slider).toHaveClass("h-2", "rounded-full");
    expect(slider).toHaveStyle({
      background:
        "linear-gradient(to right, var(--muted) 0%, var(--primary) 0%, var(--primary) 40%, var(--muted) 40%)",
    });
  });

  it("highlights the selected interval of a range", () => {
    render(<RangeSlider aria-label="Price" defaultValue={[20, 80]} />);

    expect(screen.getByRole("slider", { name: "Price start" })).toHaveValue(
      "20",
    );
    expect(screen.getByRole("slider", { name: "Price end" })).toHaveValue("80");
  });

  it("reports the numeric value and merges className", () => {
    function Field() {
      const [value, setValue] = useState(10);

      return (
        <Slider
          aria-label="Volume"
          value={value}
          className="max-w-xs"
          onValueChange={setValue}
        />
      );
    }

    render(<Field />);
    const slider = screen.getByRole("slider", { name: "Volume" });

    fireEvent.change(slider, { target: { value: "64" } });

    expect(slider).toHaveValue("64");
    expect(slider).toHaveClass("max-w-xs");
  });

  it("forwards disabled and native bounds", () => {
    render(<Slider aria-label="Zoom" min={1} max={4} step={1} disabled />);

    const slider = screen.getByRole("slider", { name: "Zoom" });

    expect(slider).toBeDisabled();
    expect(slider).toHaveAttribute("min", "1");
    expect(slider).toHaveAttribute("max", "4");
    expect(slider).toHaveAttribute("step", "1");
  });
});

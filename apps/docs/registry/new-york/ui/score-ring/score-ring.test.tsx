import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ScoreRing } from ".";

function indicator(container: HTMLElement) {
  return container.querySelector(
    "[data-slot='score-ring-indicator']",
  ) as SVGCircleElement;
}

describe("ScoreRing", () => {
  it("exposes the score as a labelled meter and shows it in the middle", () => {
    render(<ScoreRing value={72} label="Performance" />);

    const meter = screen.getByRole("meter", { name: "Performance" });

    expect(meter).toHaveAttribute("aria-valuenow", "72");
    expect(meter).toHaveAttribute("aria-valuemin", "0");
    expect(meter).toHaveAttribute("aria-valuemax", "100");
    expect(meter).toHaveTextContent("72");
  });

  it("fills the ring in proportion to the score", () => {
    const { container, rerender } = render(
      <ScoreRing value={0} label="Score" />,
    );
    const circle = indicator(container);
    const circumference = Number(circle.getAttribute("stroke-dasharray"));

    expect(Number(circle.getAttribute("stroke-dashoffset"))).toBeCloseTo(
      circumference,
    );

    rerender(<ScoreRing value={50} label="Score" />);
    expect(
      Number(indicator(container).getAttribute("stroke-dashoffset")),
    ).toBeCloseTo(circumference / 2);

    rerender(<ScoreRing value={100} label="Score" />);
    expect(
      Number(indicator(container).getAttribute("stroke-dashoffset")),
    ).toBeCloseTo(0);
  });

  it("clamps values outside the range and honors max", () => {
    const { rerender } = render(<ScoreRing value={150} label="Score" />);

    expect(screen.getByRole("meter")).toHaveAttribute("aria-valuenow", "100");

    rerender(<ScoreRing value={-5} label="Score" />);
    expect(screen.getByRole("meter")).toHaveAttribute("aria-valuenow", "0");

    rerender(<ScoreRing value={4} max={5} label="Score" />);
    expect(screen.getByRole("meter")).toHaveAttribute("aria-valuemax", "5");
    expect(screen.getByRole("meter")).toHaveAttribute("aria-valuenow", "4");
  });

  it("defaults to red at 0 and green at 100 and accepts custom colors", () => {
    const { container, rerender } = render(
      <ScoreRing value={0} label="Score" />,
    );

    expect(indicator(container).getAttribute("style")).toContain("red-500");
    expect(indicator(container).getAttribute("style")).toContain("0%");

    rerender(<ScoreRing value={100} label="Score" />);
    expect(indicator(container).getAttribute("style")).toContain("100%");
    expect(indicator(container).getAttribute("style")).toContain("green-500");

    rerender(
      <ScoreRing
        value={40}
        fromColor="#111111"
        toColor="#eeeeee"
        label="Score"
      />,
    );
    const style = indicator(container).getAttribute("style") ?? "";

    // jsdom normalizes hex to rgb().
    expect(style).toContain("rgb(238, 238, 238) 40%");
    expect(style).toContain("rgb(17, 17, 17)");
  });

  it("supports the xs, sm, default, and lg sizes", () => {
    render(
      <>
        <ScoreRing value={10} size="xs" label="xs" />
        <ScoreRing value={10} size="sm" label="sm" />
        <ScoreRing value={10} label="default" />
        <ScoreRing value={10} size="lg" label="lg" />
      </>,
    );

    expect(screen.getByRole("meter", { name: "xs" })).toHaveClass("size-8");
    expect(screen.getByRole("meter", { name: "sm" })).toHaveClass("size-12");
    expect(screen.getByRole("meter", { name: "default" })).toHaveClass(
      "size-16",
    );
    expect(screen.getByRole("meter", { name: "lg" })).toHaveClass("size-24");
  });

  it("can hide the value or replace it with custom content", () => {
    const { rerender } = render(
      <ScoreRing value={72} showValue={false} label="Score" />,
    );

    expect(screen.getByRole("meter")).not.toHaveTextContent("72");

    rerender(
      <ScoreRing value={72} label="Score">
        A
      </ScoreRing>,
    );
    expect(screen.getByRole("meter")).toHaveTextContent("A");
  });

  it("forwards a ref and merges className", () => {
    const ref = createRef<HTMLDivElement>();

    render(<ScoreRing ref={ref} value={10} label="Score" className="mx-2" />);

    expect(ref.current).toBe(screen.getByRole("meter"));
    expect(ref.current).toHaveClass("mx-2");
  });
});

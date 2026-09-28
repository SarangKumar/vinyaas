import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Spinner } from "./spinner";

describe("Spinner", () => {
  it("exposes a label and hides the graphic", () => {
    render(<Spinner />);

    const status = screen.getByRole("status");

    expect(status).toHaveTextContent("Loading");
    expect(status.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
    expect(status.querySelector("svg")).toHaveClass(
      "animate-spin",
      "motion-reduce:animate-none",
      "text-current",
    );
  });

  it("merges className onto the graphic", () => {
    render(<Spinner className="size-6" label="Saving" />);

    expect(screen.getByRole("status")).toHaveTextContent("Saving");
    expect(screen.getByRole("status").querySelector("svg")).toHaveClass(
      "size-6",
    );
  });
});

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import Home from "./page";

describe("homepage", () => {
  it("is an empty placeholder for the future showcase", () => {
    render(<Home />);

    expect(screen.getByRole("article", { name: "Home" })).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", {
        name: "Accessible React components you can own.",
      }),
    ).not.toBeInTheDocument();
    expect(screen.queryByText("Quick start")).not.toBeInTheDocument();
    expect(screen.queryByText("Philosophy")).not.toBeInTheDocument();
  });
});

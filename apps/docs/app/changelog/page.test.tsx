import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import ChangelogPage from "./page";

describe("Changelog", () => {
  it("renders the version headings", () => {
    render(<ChangelogPage />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Changelog" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "v0.1" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "v0.2" })).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Implemented" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Planned" }),
    ).toBeInTheDocument();
  });
});

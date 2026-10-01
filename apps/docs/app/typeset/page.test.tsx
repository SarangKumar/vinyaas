import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import TypesetPage, { metadata } from "./page";

describe("Typeset documentation page", () => {
  it("explains content typography and links to the playground", () => {
    render(<TypesetPage />);

    expect(metadata.title).toBe("Typeset");
    expect(metadata.alternates).toMatchObject({ canonical: "/typeset" });
    expect(
      screen.getByRole("heading", { level: 1, name: "Typeset" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Typography rhythm" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Content width" }),
    ).toBeInTheDocument();
    expect(
      screen.getAllByRole("link", { name: "Typeset playground" })[0],
    ).toHaveAttribute("href", "/typeset/playground");
    expect(document.querySelector("[data-playground-content]")).toBeNull();
  });
});

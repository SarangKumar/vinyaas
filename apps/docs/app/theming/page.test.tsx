import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import ThemingPage, { metadata } from "./page";

describe("Theming documentation page", () => {
  it("documents theme tokens and links to the themes playground", () => {
    render(<ThemingPage />);

    expect(metadata.title).toBe("Theming");
    expect(metadata.alternates).toMatchObject({ canonical: "/theming" });
    expect(
      screen.getByRole("heading", { level: 1, name: "Theming" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "CSS variables" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Theme tokens" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Themes playground" }),
    ).toHaveAttribute("href", "/themes");
    expect(screen.getByRole("link", { name: "Dark Mode" })).toHaveAttribute(
      "href",
      "/dark-mode",
    );
  });
});

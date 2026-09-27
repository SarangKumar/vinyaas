import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import Home from "./page";

describe("homepage", () => {
  it("introduces Vinyaas and links into the docs", () => {
    render(<Home />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Accessible React components you can own.",
      }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Get Started" })).toHaveAttribute(
      "href",
      "/installation",
    );
    expect(screen.getByRole("link", { name: "Get Started" })).toHaveClass(
      "h-8",
    );
    expect(
      screen.getByRole("link", { name: "Browse Components" }),
    ).toHaveAttribute("href", "/components");
    expect(screen.getByText("pnpm dlx @vinyaas/cli init")).toBeInTheDocument();
    expect(
      screen.getByText("pnpm dlx @vinyaas/cli add button"),
    ).toBeInTheDocument();
    expect(screen.getAllByText("bash").length).toBeGreaterThan(0);
    expect(
      screen.getByRole("heading", { name: "Philosophy" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Own your components" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Email" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Button" })).toHaveAttribute(
      "href",
      "/components/button",
    );
    expect(screen.getByRole("link", { name: "Input" })).toHaveAttribute(
      "href",
      "/components/input",
    );
    expect(screen.getByRole("link", { name: "Textarea" })).toHaveAttribute(
      "href",
      "/components/textarea",
    );
    expect(
      screen.getByRole("textbox", { name: "Message" }),
    ).toBeInTheDocument();
  });
});

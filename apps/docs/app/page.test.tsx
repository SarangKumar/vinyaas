import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import Home from "./page";

describe("homepage", () => {
  it("shows distinct working compositions", () => {
    render(<Home />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Build with Vinyaas" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Get Started" })).toHaveAttribute(
      "href",
      "/installation",
    );
    expect(
      screen.getByRole("link", { name: "View Components" }),
    ).toHaveAttribute("href", "/components");
    expect(screen.getByText("Made by Sarang Kumar · 2026")).toBeInTheDocument();
    expect(screen.getByText("Vinyaas v1.0.0")).toBeInTheDocument();

    expect(
      screen.getByRole("heading", { name: "Sign in" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Notifications" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Payment received" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Directory" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Documents" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Verify email" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Jump to" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Reset password" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "March invoice" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Today" })).toBeInTheDocument();
    expect(document.querySelector(".xl\\:columns-5")).not.toBeNull();

    fireEvent.change(screen.getByRole("textbox", { name: "Search people" }), {
      target: { value: "Priya" },
    });
    expect(screen.getByText("1 people")).toBeInTheDocument();
  });
});

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { components } from "@/components/component-meta";

import Home from "./page";

describe("homepage", () => {
  it("showcases the library and links into the docs", () => {
    render(<Home />);

    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Accessible components, installed as source.",
      }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("article", { name: "Home" }),
    ).not.toBeInTheDocument();
    expect(screen.queryByText("Quick start")).not.toBeInTheDocument();
    expect(screen.queryByText("Philosophy")).not.toBeInTheDocument();

    expect(
      screen.getByRole("link", { name: "Browse components" }),
    ).toHaveAttribute("href", "/components");
    expect(screen.getByRole("link", { name: "Installation" })).toHaveAttribute(
      "href",
      "/installation",
    );
    expect(
      screen.getByRole("link", { name: "Open the component catalog" }),
    ).toHaveAttribute("href", "/components");

    expect(
      screen.getByText(
        new RegExp(`catalog has ${components.length} components`),
      ),
    ).toBeInTheDocument();
    expect(screen.getByText("npx @vinyaas/cli add button")).toBeInTheDocument();

    expect(
      screen.getAllByRole("button", { name: "Save" }).length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByRole("button", { name: "Cancel" }).length,
    ).toBeGreaterThan(0);
    expect(screen.getByText("⌘")).toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: "Sarang Kumar" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("progressbar", {
        name: "Components in the v0.2 catalog",
      }),
    ).toBeInTheDocument();

    expect(screen.getByLabelText("Name")).toBeInstanceOf(HTMLInputElement);
    expect(screen.getByLabelText("Note")).toBeInstanceOf(HTMLTextAreaElement);
    expect(screen.getByLabelText("Email")).toBeInstanceOf(HTMLInputElement);
    expect(screen.getByLabelText("Email")).toBeChecked();
    expect(screen.getByLabelText("SMS")).toBeInstanceOf(HTMLInputElement);
    expect(screen.getByLabelText("Send updates")).toBeInstanceOf(
      HTMLInputElement,
    );
    expect(screen.getByLabelText("Send updates")).toHaveAttribute(
      "type",
      "checkbox",
    );
    expect(screen.getByLabelText("Plan")).toBeInstanceOf(HTMLSelectElement);
    expect(screen.getByLabelText("Region")).toBeInstanceOf(HTMLSelectElement);
    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Hint" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Details" })).toHaveAttribute(
      "aria-haspopup",
      "dialog",
    );
    expect(screen.getByRole("button", { name: "Notify" })).toBeInTheDocument();
    expect(screen.getByRole("switch", { name: "Alerts" })).toHaveAttribute(
      "aria-checked",
      "false",
    );

    for (const component of components) {
      expect(
        screen.getByRole("link", { name: component.name }),
      ).toHaveAttribute("href", `/components/${component.slug}`);
    }
  });
});

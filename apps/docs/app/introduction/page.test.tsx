import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { DocsStoreProvider } from "@/lib/store/provider";

import IntroductionPage from "./page";

describe("introduction", () => {
  it("introduces Vinyaas and links into the docs", () => {
    render(
      <DocsStoreProvider>
        <IntroductionPage />
      </DocsStoreProvider>,
    );

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Accessible React components you install as source.",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getAllByRole("link", { name: "Get Started" })[0],
    ).toHaveAttribute("href", "/installation");
    expect(
      screen.getByRole("link", { name: "Browse Components" }),
    ).toHaveAttribute("href", "/components");
    expect(
      screen.getByRole("heading", { name: "What Vinyaas is" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Catalog and releases" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Why it exists" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Core philosophy" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "How the components work" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Installation and usage flow" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Customization" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Registry and CLI model" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Component composition" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: "Accessibility and design principles",
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("npx vinyaas init")).toBeInTheDocument();
    expect(screen.getByText("npx vinyaas add button")).toBeInTheDocument();
    expect(
      screen.getAllByRole("tablist", { name: "Package manager" }).length,
    ).toBeGreaterThan(0);
    expect(
      screen.getByRole("tablist", { name: "Component example language" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Name" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Installation" })).toHaveAttribute(
      "href",
      "/installation",
    );
    expect(
      screen.getByRole("link", { name: "components.json" }),
    ).toHaveAttribute("href", "/components-json");
    expect(screen.getByRole("link", { name: "CLI" })).toHaveAttribute(
      "href",
      "/installation#cli",
    );
    expect(screen.getByRole("link", { name: "Components" })).toHaveAttribute(
      "href",
      "/components",
    );
    expect(screen.getByRole("link", { name: "Themes" })).toHaveAttribute(
      "href",
      "/themes",
    );
    expect(screen.getByRole("link", { name: "Typeset" })).toHaveAttribute(
      "href",
      "/typeset",
    );
    expect(screen.getByRole("link", { name: "Changelog" })).toHaveAttribute(
      "href",
      "/changelog",
    );
  });
});

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { DocsStoreProvider } from "@/lib/store/provider";
import { setCodeLanguage } from "@/lib/store/slices/code-language";
import { store } from "@/lib/store/store";

import DarkModePage, { metadata } from "./page";
import NextJsDarkModePage, { metadata as nextMetadata } from "./nextjs/page";
import ViteDarkModePage from "./vite/page";
import ReactDarkModePage from "./react/page";

function renderWithStore(ui: React.ReactElement) {
  store.dispatch(setCodeLanguage("jsx"));
  return render(<DocsStoreProvider>{ui}</DocsStoreProvider>);
}

describe("dark mode docs", () => {
  it("renders framework selection cards without descriptions", () => {
    renderWithStore(<DarkModePage />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Dark Mode" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Choose Your Framework" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Next.js" })).toHaveAttribute(
      "href",
      "/dark-mode/nextjs",
    );
    expect(screen.getByRole("link", { name: "React + Vite" })).toHaveAttribute(
      "href",
      "/dark-mode/vite",
    );
    expect(screen.getByRole("link", { name: "React" })).toHaveAttribute(
      "href",
      "/dark-mode/react",
    );
    expect(screen.queryByText(/React framework with App Router/i)).toBeNull();
    expect(
      document.querySelector("[data-docs-article] .grid")?.className,
    ).toContain("w-full");
    expect(
      document.querySelector("[data-docs-article] .grid")?.className,
    ).not.toContain("max-w-xl");
    expect(metadata.title).toBe("Dark Mode");
    expect(metadata.alternates).toMatchObject({ canonical: "/dark-mode" });
  });

  it("renders framework-specific dark mode guides", () => {
    const next = renderWithStore(<NextJsDarkModePage />);
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Dark Mode with Next.js",
      }),
    ).toBeInTheDocument();
    expect(document.body.textContent).toContain("suppressHydrationWarning");
    expect(document.body.textContent).toContain('classList.toggle("dark"');
    expect(nextMetadata.title).toBe("Dark Mode with Next.js");
    next.unmount();

    const vite = renderWithStore(<ViteDarkModePage />);
    expect(
      screen.getByRole("heading", { name: "Dark Mode with React + Vite" }),
    ).toBeInTheDocument();
    expect(document.body.textContent).toContain("index.html");
    vite.unmount();

    renderWithStore(<ReactDarkModePage />);
    expect(
      screen.getByRole("heading", { name: "Dark Mode with React" }),
    ).toBeInTheDocument();
    expect(document.body.textContent).toContain("prefers-color-scheme");
  });
});

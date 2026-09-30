import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { DocsStoreProvider } from "@/lib/store/provider";
import { setCodeLanguage } from "@/lib/store/slices/code-language";
import { store } from "@/lib/store/store";

import InstallationPage, { metadata } from "./page";
import NextJsInstallationPage, {
  metadata as nextMetadata,
} from "./nextjs/page";
import ViteInstallationPage, { metadata as viteMetadata } from "./vite/page";
import ReactInstallationPage, { metadata as reactMetadata } from "./react/page";

function renderWithStore(ui: React.ReactElement) {
  store.dispatch(setCodeLanguage("jsx"));
  return render(<DocsStoreProvider>{ui}</DocsStoreProvider>);
}

describe("installation docs", () => {
  it("renders CLI, existing-project, and framework selection sections", () => {
    renderWithStore(<InstallationPage />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Installation" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Use the CLI" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Existing Project" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Choose Your Framework" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Next.js" })).toHaveAttribute(
      "href",
      "/installation/nextjs",
    );
    expect(screen.getByRole("link", { name: "React + Vite" })).toHaveAttribute(
      "href",
      "/installation/vite",
    );
    expect(screen.getByRole("link", { name: "React" })).toHaveAttribute(
      "href",
      "/installation/react",
    );
    expect(screen.queryByText(/Continue/i)).toBeNull();
    expect(screen.queryByText(/React framework with App Router/i)).toBeNull();
    expect(document.body.textContent).toContain("vinyaas init");
    expect(document.body.textContent).toContain("add button");
    expect(document.body.textContent).not.toContain("dist/index.js vinyaas");
    expect(
      screen.getAllByRole("tablist", { name: "Package manager" }).length,
    ).toBeGreaterThan(0);
    expect(
      document.querySelector("[data-docs-article] .grid")?.className,
    ).toContain("sm:grid-cols-2");
    expect(
      document.querySelector("[data-docs-article] .grid")?.className,
    ).toContain("w-full");
    expect(
      document.querySelector("[data-docs-article] .grid")?.className,
    ).not.toContain("max-w-xl");
    expect(
      document.querySelector("[data-docs-article] .grid")?.className,
    ).not.toContain("lg:grid-cols-3");
    expect(document.querySelector("[data-docs-article]")?.className).toContain(
      "max-w-3xl",
    );
    expect(metadata.title).toBe("Installation");
    expect(metadata.alternates).toMatchObject({ canonical: "/installation" });
  });

  it("renders framework guides with project-state setup, add, and discovery", () => {
    const next = renderWithStore(<NextJsInstallationPage />);
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Install Vinyaas with Next.js",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Prerequisites" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Choose your setup" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Fresh project" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Existing project" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Existing shadcn-style project" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Add components" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Import components" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Discover components" }),
    ).toBeInTheDocument();
    expect(document.body.textContent).toContain("create-next-app@latest");
    expect(document.body.textContent).toContain("--typescript");
    expect(document.body.textContent).toContain("vinyaas init");
    expect(document.body.textContent).toContain("add button");
    expect(document.body.textContent).toContain(
      "components/ui/button/index.tsx",
    );
    expect(document.body.textContent).toContain("App Router");
    expect(nextMetadata.title).toBe("Install Vinyaas with Next.js");
    next.unmount();

    const vite = renderWithStore(<ViteInstallationPage />);
    expect(
      screen.getByRole("heading", {
        name: "Install Vinyaas with React + Vite",
      }),
    ).toBeInTheDocument();
    expect(document.body.textContent).toContain("create vite@latest");
    expect(document.body.textContent).toContain("react-ts");
    expect(document.body.textContent).toContain("src/index.css");
    expect(viteMetadata.alternates).toMatchObject({
      canonical: "/installation/vite",
    });
    vite.unmount();

    renderWithStore(<ReactInstallationPage />);
    expect(
      screen.getByRole("heading", { name: "Install Vinyaas with React" }),
    ).toBeInTheDocument();
    expect(document.body.textContent).toContain("neither");
    expect(document.body.textContent).toContain("Choose your setup");
    expect(reactMetadata.description).toMatch(/React projects/i);
  });
});

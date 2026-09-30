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
  it("renders framework selection cards on the landing page", () => {
    renderWithStore(<InstallationPage />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Install Vinyaas" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Choose your framework" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Next\.js/i })).toHaveAttribute(
      "href",
      "/installation/nextjs",
    );
    expect(
      screen.getByRole("link", { name: /React \+ Vite/i }),
    ).toHaveAttribute("href", "/installation/vite");
    expect(
      screen.getByRole("link", { name: /Other React projects/i }),
    ).toHaveAttribute("href", "/installation/react");
    expect(screen.queryByText(/Continue/i)).toBeNull();
    expect(
      document.querySelector("[data-docs-article] .grid")?.className,
    ).toContain("sm:grid-cols-2");
    expect(
      document.querySelector("[data-docs-article] .grid")?.className,
    ).not.toContain("lg:grid-cols-3");

    expect(metadata.title).toBe("Install Vinyaas");
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

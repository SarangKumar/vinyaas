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

    expect(metadata.title).toBe("Install Vinyaas");
    expect(metadata.alternates).toMatchObject({ canonical: "/installation" });
  });

  it("renders framework guides with init, add, and discovery content", () => {
    const { unmount } = renderWithStore(<NextJsInstallationPage />);
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
      screen.getByRole("heading", { name: "Initialize Vinyaas" }),
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
    expect(document.body.textContent).toContain("vinyaas init");
    expect(document.body.textContent).toContain("add button");
    expect(document.body.textContent).toContain(
      "components/ui/button/index.tsx",
    );
    expect(document.body.textContent).toContain("App Router");
    expect(nextMetadata.title).toBe("Install Vinyaas with Next.js");
    unmount();

    renderWithStore(<ViteInstallationPage />);
    expect(
      screen.getByRole("heading", {
        name: "Install Vinyaas with React + Vite",
      }),
    ).toBeInTheDocument();
    expect(document.body.textContent).toContain("src/index.css");
    expect(viteMetadata.alternates).toMatchObject({
      canonical: "/installation/vite",
    });
    unmount();

    renderWithStore(<ReactInstallationPage />);
    expect(
      screen.getByRole("heading", { name: "Install Vinyaas with React" }),
    ).toBeInTheDocument();
    expect(document.body.textContent).toContain("neither");
    expect(reactMetadata.description).toMatch(/React projects/i);
  });
});

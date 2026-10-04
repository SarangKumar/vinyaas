import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { DocsStoreProvider } from "@/lib/store/provider";
import { setCodeLanguage } from "@/lib/store/slices/code-language";
import { store } from "@/lib/store/store";

import CliPage, { metadata } from "./page";

function renderWithStore(ui: React.ReactElement) {
  store.dispatch(setCodeLanguage("jsx"));
  return render(<DocsStoreProvider>{ui}</DocsStoreProvider>);
}

describe("CLI docs", () => {
  it("renders the v1.3.0 CLI guide with setup, install, and discover sections", () => {
    renderWithStore(<CliPage />);

    expect(
      screen.getByRole("heading", { level: 1, name: "CLI" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "What the CLI is" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Install the CLI" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Setup" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "init" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "doctor" })).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Install" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "add" })).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "--force" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "--dry-run" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Catalog installation" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Category installation" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "status" })).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Discover" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "JSON output" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Errors and safety" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Registry" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Version" }),
    ).toBeInTheDocument();

    const body = document.body.textContent ?? "";
    expect(body).toContain("vinyaas init");
    expect(body).toContain("vinyaas doctor");
    expect(body).toContain("theme tokens");
    expect(body).toContain("forms");
    expect(body).toContain("data-display");
    expect(body).toContain("vinyaas add button");
    expect(body).toContain("vinyaas add button card badge");
    expect(body).toContain("vinyaas add button card --yes");
    expect(body).toContain("vinyaas add button --dry-run");
    expect(body).toContain("vinyaas add form");
    expect(body).toContain("vinyaas add dashboard --dry-run");
    expect(body).toContain("vinyaas catalog list");
    expect(body).toContain("vinyaas catalog info form");
    expect(body).toContain("vinyaas add --category forms");
    expect(body).toContain("vinyaas add --category forms --yes");
    expect(body).toContain("vinyaas status");
    expect(body).toContain(".vinyaas/manifest.json");
    expect(body).toContain("not");
    expect(body).toContain("collections");
    expect(body).toContain("vinyaas list");
    expect(body).toContain("vinyaas list --category forms");
    expect(body).toContain("vinyaas search button");
    expect(body).toContain("vinyaas info button");
    expect(body).toContain("REGISTRY_BASE_PATH");
    expect(body).toContain("vinyaas --version");
    expect(body).toContain("v1.3.0");
    expect(body).not.toContain("dist/index.js vinyaas");
    expect(body).not.toMatch(/node packages\/cli\/dist\/index\.js vinyaas/);
    expect(body).not.toContain("vinyaas vinyaas");

    expect(screen.getByRole("link", { name: "Installation" })).toHaveAttribute(
      "href",
      "/installation",
    );
    expect(
      screen.getByRole("link", { name: "components.json" }),
    ).toHaveAttribute("href", "/components-json");
    expect(metadata.title).toBe("CLI");
    expect(metadata.description).toMatch(/v1\.3\.0/);
    expect(metadata.alternates).toMatchObject({ canonical: "/cli" });
  });
});

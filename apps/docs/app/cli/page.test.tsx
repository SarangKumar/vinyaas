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
  it("renders dedicated CLI commands separate from installation", () => {
    renderWithStore(<CliPage />);

    expect(
      screen.getByRole("heading", { level: 1, name: "CLI" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Install" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Setup" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Doctor" })).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Components" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Discovery" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Output" })).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Version" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Local development" }),
    ).toBeInTheDocument();

    const body = document.body.textContent ?? "";
    expect(body).toContain("vinyaas init");
    expect(body).toContain("vinyaas doctor");
    expect(body).toContain("theme tokens");
    expect(body).toContain("forms");
    expect(body).toContain("vinyaas add button");
    expect(body).toContain("vinyaas list");
    expect(body).toContain("vinyaas list --category forms");
    expect(body).toContain("vinyaas search button");
    expect(body).toContain("vinyaas add --category forms");
    expect(body).toContain("vinyaas info button");
    expect(body).toContain("vinyaas --version");
    expect(body).toContain("v1.2.0");
    expect(body).toContain("node packages/cli/dist/index.js init");
    expect(body).not.toContain("dist/index.js vinyaas");
    expect(body).not.toMatch(/node packages\/cli\/dist\/index\.js vinyaas/);

    expect(screen.getByRole("link", { name: "Installation" })).toHaveAttribute(
      "href",
      "/installation",
    );
    expect(metadata.title).toBe("CLI");
    expect(metadata.description).toMatch(/v1\.2\.0/);
    expect(metadata.alternates).toMatchObject({ canonical: "/cli" });
  });
});

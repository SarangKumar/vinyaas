import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { DocsStoreProvider } from "@/lib/store/provider";
import { setCodeLanguage } from "@/lib/store/slices/code-language";
import { store } from "@/lib/store/store";

import InstallationPage from "./page";

describe("installation docs", () => {
  it("documents init, add, discovery, and form installs", () => {
    store.dispatch(setCodeLanguage("jsx"));

    render(
      <DocsStoreProvider>
        <InstallationPage />
      </DocsStoreProvider>,
    );

    expect(screen.getByRole("heading", { name: "init" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "add" })).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Discover" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "list" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "search" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "info" })).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Installed file structure" }),
    ).toBeInTheDocument();
    expect(document.body.textContent).toContain(
      "components/ui/button/index.tsx",
    );
    expect(document.body.textContent).toContain("toast.css");
    expect(document.body.textContent).toContain("--force");
    expect(document.body.textContent).toContain("--json");
    expect(document.body.textContent).toContain("Tailwind CSS v4");
    expect(document.body.textContent).not.toContain(
      "components/ui/button/button.tsx",
    );
    expect(
      screen.getByRole("heading", { name: "Install form components" }),
    ).toBeInTheDocument();
    const command = [...document.querySelectorAll("code")].find((code) =>
      code.textContent?.includes(
        "add button checkbox radio-group input textarea label input-group native-select slider spinner skeleton",
      ),
    );

    expect(command).toBeDefined();
    expect(command).toHaveAttribute("data-language", "bash");
    expect(screen.getByRole("heading", { name: "React" })).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Next.js" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Vite" })).toBeInTheDocument();
    expect(
      command?.parentElement?.parentElement?.querySelector(
        "[data-line-numbers]",
      ),
    ).toBeNull();
    expect(screen.queryByRole("tab", { name: "TSX" })).toBeNull();
    expect(screen.getAllByRole("tab", { name: "npm" }).length).toBeGreaterThan(
      0,
    );
    expect(screen.getByRole("link", { name: "vinyaas" })).toHaveAttribute(
      "href",
      "https://www.npmjs.com/package/vinyaas",
    );
  });
});

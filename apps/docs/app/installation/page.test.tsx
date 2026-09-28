import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { DocsStoreProvider } from "@/lib/store/provider";
import { setCodeLanguage } from "@/lib/store/slices/code-language";
import { store } from "@/lib/store/store";

import InstallationPage from "./page";

describe("installation docs", () => {
  it("shows a bash command for the common form components", () => {
    store.dispatch(setCodeLanguage("jsx"));

    render(
      <DocsStoreProvider>
        <InstallationPage />
      </DocsStoreProvider>,
    );

    expect(
      screen.getByRole("heading", { name: "Install form components" }),
    ).toBeInTheDocument();
    const command = [...document.querySelectorAll("code")].find(
      (code) =>
        code.textContent ===
        "npx @vinyaas/cli add button checkbox radio-group input textarea",
    );

    expect(command).toBeDefined();
    expect(command).toHaveAttribute("data-language", "bash");
    expect(
      command?.parentElement?.parentElement?.querySelector(
        "[data-line-numbers]",
      ),
    ).toBeNull();
    expect(screen.queryByRole("tab", { name: "TSX" })).toBeNull();
    expect(screen.getAllByRole("tab", { name: "npm" }).length).toBeGreaterThan(
      0,
    );
  });
});

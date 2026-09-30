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
    expect(
      screen.getByRole("heading", { name: "Initialize" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Add components" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Discover" }),
    ).toBeInTheDocument();
    expect(document.body.textContent).toContain("vinyaas init");
    expect(document.body.textContent).toContain("add button");
    expect(screen.getByRole("link", { name: "Installation" })).toHaveAttribute(
      "href",
      "/installation",
    );
    expect(metadata.title).toBe("CLI");
    expect(metadata.alternates).toMatchObject({ canonical: "/cli" });
  });
});

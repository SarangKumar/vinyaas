import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { DocsStoreProvider } from "@/lib/store/provider";
import { setCodeLanguage } from "@/lib/store/slices/code-language";
import { store } from "@/lib/store/store";

import PackageImportPage, { metadata } from "./page";

function renderWithStore(ui: React.ReactElement) {
  store.dispatch(setCodeLanguage("jsx"));
  return render(<DocsStoreProvider>{ui}</DocsStoreProvider>);
}

describe("Package Import docs", () => {
  it("explains local source imports and aliases", () => {
    renderWithStore(<PackageImportPage />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Package Import" }),
    ).toBeInTheDocument();
    expect(document.body.textContent).toContain("@/components/ui/button");
    expect(
      screen.getByRole("link", { name: "components.json" }),
    ).toHaveAttribute("href", "/components-json");
    expect(metadata.title).toBe("Package Import");
    expect(metadata.alternates).toMatchObject({
      canonical: "/package-import",
    });
  });
});

import { readFile } from "node:fs/promises";
import path from "node:path";

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import ComponentsJsonPage from "./page";

describe("components.json docs", () => {
  it("explains the local config file", () => {
    render(<ComponentsJsonPage />);

    expect(
      screen.getByRole("heading", { name: "components.json" }),
    ).toBeInTheDocument();
    expect(screen.getByText("What it is")).toBeInTheDocument();
    expect(screen.getByText("Fields")).toBeInTheDocument();
    expect(screen.getByText("Example")).toBeInTheDocument();
    expect(screen.getByText("Registry vs components.json")).toBeInTheDocument();
    expect(document.body.textContent).toContain("json");
    expect(document.body.textContent).toContain('"style": "new-york"');
    expect(document.body.textContent).toContain("aliases");
  });

  it("remains available from documentation search", async () => {
    const source = await readFile(
      path.join(process.cwd(), "components/docs-search.tsx"),
      "utf8",
    );

    expect(source).toContain('title: "components.json"');
    expect(source).toContain('href: "/components-json"');
  });
});

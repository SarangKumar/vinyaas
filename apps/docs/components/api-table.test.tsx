import { render, screen } from "@testing-library/react";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import { ApiTable } from "./api-table";

const globalsCss = readFileSync(
  path.join(path.dirname(fileURLToPath(import.meta.url)), "../app/globals.css"),
  "utf8",
);

describe("ApiTable", () => {
  it("renders prop, type, and default columns at full container width", () => {
    render(
      <ApiTable
        rows={[
          {
            prop: "type",
            type: '"single" | "multiple"',
            defaultValue: '"single"',
            description: "ignored in the table",
          },
          {
            prop: "value",
            type: "string | string[]",
          },
        ]}
      />,
    );

    const wrap = document.querySelector("[data-api-table]");
    const table = screen.getByRole("table");

    expect(wrap).toHaveClass("w-full", "overflow-x-auto");
    expect(table).toHaveClass("w-full", "table-fixed");
    expect(screen.getByRole("columnheader", { name: "Prop" })).toBeTruthy();
    expect(screen.getByRole("columnheader", { name: "Type" })).toBeTruthy();
    expect(screen.getByRole("columnheader", { name: "Default" })).toBeTruthy();
    expect(
      screen.queryByRole("columnheader", { name: "Description" }),
    ).toBeNull();
    expect(screen.getByText("type").closest("th")).toBeTruthy();
    expect(document.querySelectorAll("col")).toHaveLength(3);
  });

  it("keeps docs tables on table layout so w-full columns can span the card", () => {
    expect(globalsCss).toContain("#docs-content table");
    expect(globalsCss).toContain("width: 100%");
    expect(globalsCss).not.toContain(
      `#docs-content table {
  display: block;`,
    );
  });
});

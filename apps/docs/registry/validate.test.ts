import { describe, expect, it } from "vitest";

import { withDefaultDocs } from "./docs";
import { serializeRegistryCatalog } from "./serialize";
import type { RegistryItem } from "./types";
import {
  formatRegistryValidationFailure,
  validateRegistry,
  validateRegistryItem,
} from "./validate";

function validItem(
  overrides: Partial<RegistryItem> & Pick<RegistryItem, "name">,
): RegistryItem {
  return {
    type: "registry:ui",
    description: "A reusable example component for focused tests.",
    dependencies: ["clsx"],
    files: [{ path: `ui/${overrides.name}/index.tsx`, type: "registry:ui" }],
    ...overrides,
  };
}

describe("validateRegistryItem", () => {
  it("accepts a complete registry item", () => {
    expect(
      validateRegistryItem(
        validItem({
          name: "button",
          description: "A composable button component with variants and sizes.",
          dependencies: ["class-variance-authority", "clsx", "tailwind-merge"],
        }),
      ),
    ).toEqual([]);
  });

  it("detects missing metadata", () => {
    const issues = validateRegistryItem({
      name: "plain",
      type: "registry:ui",
      files: [{ path: "ui/plain/plain.tsx" }],
    });

    expect(issues.map((issue) => issue.field).sort()).toEqual([
      "description",
      "files",
      "files",
    ]);
    expect(formatRegistryValidationFailure(issues)).toContain(
      "Registry validation failed:",
    );
    expect(formatRegistryValidationFailure(issues)).toContain("plain:");
    expect(formatRegistryValidationFailure(issues)).toContain(
      "- missing description",
    );
  });

  it("rejects weak descriptions and invalid dependency format", () => {
    const issues = validateRegistryItem(
      validItem({
        name: "card",
        description: "A component.",
        dependencies: ["clsx", "clsx", "NOT VALID"],
        registryDependencies: ["missing"],
      }),
      new Set(["button"]),
    );

    expect(issues.some((issue) => issue.field === "description")).toBe(true);
    expect(issues.some((issue) => issue.field === "dependencies")).toBe(true);
    expect(issues.some((issue) => issue.field === "registryDependencies")).toBe(
      true,
    );
  });

  it("rejects an invalid category", () => {
    const issues = validateRegistryItem(
      validItem({
        name: "button",
        // @ts-expect-error intentional invalid category for validation
        category: "random",
      }),
    );

    expect(issues).toEqual([
      {
        name: "button",
        field: "category",
        message: 'invalid category "random"',
      },
    ]);
    expect(formatRegistryValidationFailure(issues)).toContain(
      'invalid category "random"',
    );
  });

  it("accepts a valid category", () => {
    expect(
      validateRegistryItem(
        validItem({
          name: "button",
          category: "forms",
        }),
      ),
    ).toEqual([]);
  });
});

describe("validateRegistry + catalog consistency", () => {
  it("validates the full new-york registry source", async () => {
    const { registry } = await import("./new-york/registry");
    const issues = validateRegistry(registry);

    expect(issues).toEqual([]);
  });

  it("keeps generated catalog discovery metadata aligned with source items", () => {
    const items = [
      validItem({
        name: "toast",
        description: "A temporary notice for success and error feedback.",
        files: [
          { path: "ui/toast/index.tsx", type: "registry:ui" },
          { path: "ui/toast/toast.css", type: "registry:ui" },
        ],
      }),
      validItem({
        name: "button",
        description: "A composable button component with variants and sizes.",
        dependencies: ["clsx"],
        registryDependencies: undefined,
      }),
    ].map((item) => withDefaultDocs(item, "https://vinyaas.vercel.app"));

    const catalog = serializeRegistryCatalog("new-york", items);

    expect(catalog.style).toBe("new-york");
    expect(catalog.items.map((item) => item.name)).toEqual(["button", "toast"]);
    expect(catalog.items[0]).toEqual({
      name: "button",
      type: "registry:ui",
      description: "A composable button component with variants and sizes.",
      docs: "https://vinyaas.vercel.app/components/button",
    });
    expect(catalog.items[1]).toEqual({
      name: "toast",
      type: "registry:ui",
      description: "A temporary notice for success and error feedback.",
      docs: "https://vinyaas.vercel.app/components/toast",
    });
    expect(catalog.items[0]).not.toHaveProperty("files");
    expect(catalog.items[0]).not.toHaveProperty("dependencies");
  });

  it("includes category in catalog when present on source items", () => {
    const items = [
      withDefaultDocs(
        validItem({
          name: "button",
          description: "A composable button component with variants and sizes.",
          category: "forms",
        }),
        "https://vinyaas.vercel.app",
      ),
    ];
    const catalog = serializeRegistryCatalog("new-york", items);

    expect(catalog.items[0]).toEqual({
      name: "button",
      type: "registry:ui",
      description: "A composable button component with variants and sizes.",
      docs: "https://vinyaas.vercel.app/components/button",
      category: "forms",
    });
  });
});

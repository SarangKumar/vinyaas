import { describe, expect, it } from "vitest";

import { withDefaultDocs } from "./docs";
import { serializeRegistryCatalog } from "./serialize";
import type { RegistryItem } from "./types";
import { validateRegistry, validateRegistryItem } from "./validate";

function validItem(
  overrides: Partial<RegistryItem> & Pick<RegistryItem, "name">,
): RegistryItem {
  return {
    type: "registry:ui",
    description: "A reusable example component for tests.",
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
          description: "A reusable button component with variants.",
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
  });

  it("rejects weak descriptions and duplicate dependencies", () => {
    const issues = validateRegistryItem(
      validItem({
        name: "card",
        description: "A component.",
        dependencies: ["clsx", "clsx"],
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
});

describe("validateRegistry + catalog consistency", () => {
  it("validates the full new-york registry source", async () => {
    const { registry } = await import("./new-york/registry");
    const issues = validateRegistry(registry);

    expect(issues).toEqual([]);
  });

  it("keeps generated catalog metadata aligned with source items", () => {
    const items = [
      validItem({
        name: "toast",
        description: "A temporary notice for feedback.",
        files: [
          { path: "ui/toast/index.tsx", type: "registry:ui" },
          { path: "ui/toast/toast.css", type: "registry:ui" },
        ],
      }),
      validItem({
        name: "button",
        description: "A reusable button component with variants.",
        dependencies: ["clsx"],
        registryDependencies: undefined,
      }),
    ].map((item) => withDefaultDocs(item, "https://vinyaas.vercel.app"));

    const catalog = serializeRegistryCatalog("new-york", items);

    expect(catalog.style).toBe("new-york");
    expect(catalog.items.map((item) => item.name)).toEqual(["button", "toast"]);
    expect(catalog.items[0]).toMatchObject({
      name: "button",
      description: "A reusable button component with variants.",
      docs: "https://vinyaas.vercel.app/components/button",
      files: ["ui/button/index.tsx"],
    });
    expect(catalog.items[1]).toMatchObject({
      name: "toast",
      files: ["ui/toast/index.tsx", "ui/toast/toast.css"],
      docs: "https://vinyaas.vercel.app/components/toast",
    });
  });
});

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import registryItemSchema from "../public/schema/registry-item.json";
import { registry as newYork } from "./new-york/registry";
import { themes } from "./registry";
import { readRegistryItemFiles, serializeRegistryItem } from "./serialize";
import { registryItemTypes, type RegistryItem } from "./types";

const registryDirectory = path.dirname(fileURLToPath(import.meta.url));
const docsRoot = path.resolve(registryDirectory, "..");
const repoRoot = path.resolve(docsRoot, "../..");
const schemaUrl = "https://registry.example/schema/registry-item.json";

function buttonItem() {
  const button = newYork.find((item) => item.name === "button");

  if (!button) {
    throw new Error("Expected a button registry item");
  }

  return button;
}

describe("button registry item", () => {
  it("declares its npm dependencies and no registry dependency", () => {
    const button = buttonItem();

    expect(button.type).toBe("registry:ui");
    expect(button.dependencies).toEqual([
      "class-variance-authority",
      "clsx",
      "tailwind-merge",
    ]);
    expect(
      button.dependencies?.some((dependency) => dependency.startsWith("@/")),
    ).toBe(false);
    expect(button.registryDependencies).toBeUndefined();
    expect(button.files).toEqual([
      {
        path: "ui/button/button.tsx",
        type: "registry:ui",
      },
    ]);
  });
});

describe("serializeRegistryItem", () => {
  it("represents registry dependencies and optional metadata", () => {
    const item: RegistryItem = {
      name: "card",
      type: "registry:ui",
      dependencies: ["zod"],
      devDependencies: ["@types/node"],
      registryDependencies: ["button"],
      files: [
        {
          path: "ui/card/card.tsx",
          type: "registry:ui",
          target: "components/ui/card.tsx",
        },
      ],
      cssVars: {
        light: { background: "0 0% 100%" },
        dark: { background: "0 0% 0%" },
      },
      css: {
        ".card": "border-radius: 0.5rem;",
      },
      envVars: {
        NEXT_PUBLIC_API_URL: "https://example.com",
      },
      docs: "Card layout.",
    };

    const payload = serializeRegistryItem(
      item,
      [
        {
          path: "ui/card/card.tsx",
          content: "export function Card() { return null; }\n",
          type: "registry:ui",
          target: "components/ui/card.tsx",
        },
      ],
      schemaUrl,
    );

    expect(payload).toEqual({
      $schema: schemaUrl,
      name: "card",
      type: "registry:ui",
      dependencies: ["zod"],
      devDependencies: ["@types/node"],
      registryDependencies: ["button"],
      files: [
        {
          path: "ui/card/card.tsx",
          content: "export function Card() { return null; }\n",
          type: "registry:ui",
          target: "components/ui/card.tsx",
        },
      ],
      cssVars: {
        light: { background: "0 0% 100%" },
        dark: { background: "0 0% 0%" },
      },
      css: {
        ".card": "border-radius: 0.5rem;",
      },
      envVars: {
        NEXT_PUBLIC_API_URL: "https://example.com",
      },
      docs: "Card layout.",
    });
    expect(Object.keys(payload)).toEqual([
      "$schema",
      "name",
      "type",
      "dependencies",
      "devDependencies",
      "registryDependencies",
      "files",
      "cssVars",
      "css",
      "envVars",
      "docs",
    ]);
  });

  it("omits empty optional metadata and keeps an empty dependency list", () => {
    const payload = serializeRegistryItem(
      {
        name: "plain",
        type: "registry:ui",
        devDependencies: [],
        registryDependencies: [],
        files: [{ path: "ui/plain.tsx" }],
        cssVars: { light: {}, dark: {} },
        css: {},
        envVars: {},
        docs: "   ",
      },
      [{ path: "ui/plain.tsx", content: "export {};\n" }],
      schemaUrl,
    );

    expect(payload).toEqual({
      $schema: schemaUrl,
      name: "plain",
      type: "registry:ui",
      dependencies: [],
      files: [{ path: "ui/plain.tsx", content: "export {};\n" }],
    });
  });

  it("keeps only the populated css variable modes", () => {
    const payload = serializeRegistryItem(
      {
        name: "theme",
        type: "registry:ui",
        files: [],
        cssVars: {
          dark: { background: "0 0% 0%" },
        },
      },
      [],
      schemaUrl,
    );

    expect(payload.cssVars).toEqual({
      dark: { background: "0 0% 0%" },
    });
  });

  it("serializes the same item to the same json", () => {
    const item: RegistryItem = {
      name: "card",
      type: "registry:ui",
      registryDependencies: ["button"],
      files: [{ path: "ui/card/card.tsx", type: "registry:ui" }],
      docs: "Card layout.",
    };
    const files = [
      {
        path: "ui/card/card.tsx",
        content: "export function Card() { return null; }\n",
        type: "registry:ui" as const,
      },
    ];

    expect(JSON.stringify(serializeRegistryItem(item, files, schemaUrl))).toBe(
      JSON.stringify(serializeRegistryItem(item, files, schemaUrl)),
    );
  });
});

describe("registry build output", () => {
  it("keeps the new-york button artifact aligned with the source item", async () => {
    const outputPath = path.join(docsRoot, "public/r/new-york/button.json");
    const sourcePath = path.join(
      docsRoot,
      "registry/new-york/ui/button/button.tsx",
    );
    const [rawOutput, source] = await Promise.all([
      fs.readFile(outputPath, "utf8"),
      fs.readFile(sourcePath, "utf8"),
    ]);
    const generated = JSON.parse(rawOutput) as {
      $schema: string;
      dependencies: string[];
      files: { path: string; content: string }[];
    };
    const button = buttonItem();
    const files = await readRegistryItemFiles(button, async (relativePath) => {
      expect(relativePath).toBe("ui/button/button.tsx");
      return source;
    });
    const payload = serializeRegistryItem(button, files, generated.$schema);

    expect(Object.keys(themes)).toEqual(["new-york"]);
    expect(generated.$schema).toMatch(/\/schema\/registry-item\.json$/);
    expect(generated).toEqual(payload);
    expect(generated.dependencies).toEqual([
      "class-variance-authority",
      "clsx",
      "tailwind-merge",
    ]);
    expect(generated.files.map((file) => file.path)).toEqual([
      "ui/button/button.tsx",
    ]);
    expect(generated.files[0]?.content).toBe(source);
    expect(generated.files[0]?.content).toContain('from "@/lib/utils"');
    expect(generated).not.toHaveProperty("devDependencies");
    expect(generated).not.toHaveProperty("registryDependencies");
    expect(generated).not.toHaveProperty("cssVars");
    expect(generated).not.toHaveProperty("css");
    expect(generated).not.toHaveProperty("envVars");
    expect(generated).not.toHaveProperty("docs");
  });

  it("matches the json schema item types", () => {
    expect(registryItemSchema.properties.type.enum).toEqual([
      ...registryItemTypes,
    ]);
    expect(
      registryItemSchema.properties.files.items.properties.type.enum,
    ).toEqual([...registryItemTypes]);
    expect(Object.keys(registryItemSchema.properties).sort()).toEqual(
      [
        "$schema",
        "css",
        "cssVars",
        "dependencies",
        "devDependencies",
        "docs",
        "envVars",
        "files",
        "name",
        "registryDependencies",
        "type",
      ].sort(),
    );
  });
});

describe("local imports", () => {
  it("does not turn local imports into dependencies or extra files", async () => {
    const source = [
      'import { cn } from "@/lib/utils";',
      'import { Button } from "../button/button";',
      "",
      "export function Card() {",
      "  return null;",
      "}",
      "",
    ].join("\n");
    const reads: string[] = [];
    const item: RegistryItem = {
      name: "card",
      type: "registry:ui",
      registryDependencies: ["button"],
      files: [{ path: "ui/card/card.tsx", type: "registry:ui" }],
    };

    const files = await readRegistryItemFiles(item, async (relativePath) => {
      reads.push(relativePath);
      return source;
    });
    const payload = serializeRegistryItem(item, files, schemaUrl);

    expect(reads).toEqual(["ui/card/card.tsx"]);
    expect(payload.dependencies).toEqual([]);
    expect(payload.registryDependencies).toEqual(["button"]);
    expect(payload.files.map((file) => file.path)).toEqual([
      "ui/card/card.tsx",
    ]);
    expect(payload.files[0]?.content).toContain('from "@/lib/utils"');
  });

  it("does not use the removed local import resolver", async () => {
    const resolverPath = path.join(repoRoot, "scripts/resolve-dependencies.ts");
    const buildScript = await fs.readFile(
      path.join(repoRoot, "scripts/build-registry.ts"),
      "utf8",
    );

    await expect(fs.access(resolverPath)).rejects.toThrow();
    expect(buildScript).not.toContain("resolve-dependencies");
    expect(buildScript).not.toContain("resolveDependencies");
  });
});

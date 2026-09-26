import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import componentsSchema from "../public/schema/components.json";
import {
  componentStyles,
  componentsAliasFields,
  componentsConfigFields,
  componentsSchemaUrl,
  componentsTailwindFields,
  parseComponentsConfig,
  ComponentsConfigError,
  type ComponentsConfig,
} from "../../../config/components";

function validComponentsConfig(): ComponentsConfig {
  return {
    $schema: componentsSchemaUrl("https://registry.example"),
    style: "new-york",
    tsx: true,
    tailwind: {
      css: "app/globals.css",
      baseColor: "neutral",
      cssVariables: true,
    },
    aliases: {
      components: "@/components",
      ui: "@/components/ui",
      lib: "@/lib",
      utils: "@/lib/utils",
      hooks: "@/hooks",
    },
  };
}

describe("components.json", () => {
  it("accepts a valid configuration", () => {
    const config = validComponentsConfig();

    expect(parseComponentsConfig(JSON.parse(JSON.stringify(config)))).toEqual(
      config,
    );
  });

  it("accepts the new-york style", () => {
    expect(parseComponentsConfig(validComponentsConfig()).style).toBe(
      "new-york",
    );
    expect(componentStyles).toEqual(["new-york"]);
  });

  it("represents consumer path aliases", () => {
    expect(parseComponentsConfig(validComponentsConfig()).aliases).toEqual({
      components: "@/components",
      ui: "@/components/ui",
      lib: "@/lib",
      utils: "@/lib/utils",
      hooks: "@/hooks",
    });
  });

  it("represents tailwind css, base color, and css variables", () => {
    const config = validComponentsConfig();

    expect(parseComponentsConfig(config).tailwind).toEqual({
      css: "app/globals.css",
      baseColor: "neutral",
      cssVariables: true,
    });
    expect(
      parseComponentsConfig({
        ...config,
        tsx: false,
        tailwind: { ...config.tailwind, cssVariables: false },
      }).tailwind.cssVariables,
    ).toBe(false);
  });

  it("builds the schema url from the registry base url", () => {
    expect(componentsSchemaUrl("https://registry.example/")).toBe(
      "https://registry.example/schema/components.json",
    );
    expect(validComponentsConfig().$schema).toBe(
      "https://registry.example/schema/components.json",
    );
  });

  it("rejects missing or invalid configuration", () => {
    const config = validComponentsConfig();

    expect(() => parseComponentsConfig(null)).toThrow(ComponentsConfigError);
    expect(() =>
      parseComponentsConfig({
        $schema: config.$schema,
        tsx: config.tsx,
        tailwind: config.tailwind,
        aliases: config.aliases,
      }),
    ).toThrow(/style/);
    expect(() =>
      parseComponentsConfig({
        ...config,
        aliases: {
          components: config.aliases.components,
          ui: config.aliases.ui,
          lib: config.aliases.lib,
          hooks: config.aliases.hooks,
        },
      }),
    ).toThrow(/utils/);
    expect(() =>
      parseComponentsConfig({
        ...config,
        tailwind: {
          baseColor: config.tailwind.baseColor,
          cssVariables: config.tailwind.cssVariables,
        },
      }),
    ).toThrow(/missing css/);
    expect(() =>
      parseComponentsConfig({ ...config, style: "default" }),
    ).toThrow(/style/);
    expect(() => parseComponentsConfig({ ...config, tsx: "true" })).toThrow(
      /tsx/,
    );
    expect(() => parseComponentsConfig({ ...config, rsc: true })).toThrow(
      /unknown fields/,
    );
    expect(() => componentsSchemaUrl("  ")).toThrow(ComponentsConfigError);
  });

  it("matches the published json schema", () => {
    expect(componentsSchema.required).toEqual([...componentsConfigFields]);
    expect(componentsSchema.properties.style.enum).toEqual([
      ...componentStyles,
    ]);
    expect(componentsSchema.properties.tailwind.required).toEqual([
      ...componentsTailwindFields,
    ]);
    expect(componentsSchema.properties.aliases.required).toEqual([
      ...componentsAliasFields,
    ]);
    expect(componentsSchema.additionalProperties).toBe(false);
    expect(componentsSchema.properties.tailwind.additionalProperties).toBe(
      false,
    );
    expect(componentsSchema.properties.aliases.additionalProperties).toBe(
      false,
    );
  });

  it("does not depend on the registry source", async () => {
    const testDirectory = path.dirname(fileURLToPath(import.meta.url));
    const source = await fs.readFile(
      path.resolve(testDirectory, "../../../config/components.ts"),
      "utf8",
    );
    const toolingConfig = await fs.readFile(
      path.resolve(testDirectory, "../../../scripts/config.ts"),
      "utf8",
    );

    expect(source).not.toContain("apps/docs/registry");
    expect(source).not.toMatch(/from\s+["'][^"']*registry/);
    expect(toolingConfig).toContain("componentsSchemaUrl");
    expect(toolingConfig).toContain("REGISTRY_BASE_URL");
    expect(toolingConfig).not.toContain("localhost");
  });
});

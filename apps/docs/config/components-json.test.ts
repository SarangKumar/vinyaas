import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import componentsSchema from "../public/schema/components.json";
import {
  componentBaseColors,
  componentStyles,
  defaultRegistryBaseUrl,
  registryBaseUrlFromEnv,
  componentsAliasFields,
  componentsAliasRequiredFields,
  componentsConfigFields,
  componentsConfigRequiredFields,
  componentsSchemaUrl,
  componentsTailwindFields,
  componentsTailwindRequiredFields,
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

  it("builds the schema url from the registry base url", async () => {
    const testDirectory = path.dirname(fileURLToPath(import.meta.url));
    const example = await fs.readFile(
      path.resolve(testDirectory, "../../../.env.example"),
      "utf8",
    );
    const button = JSON.parse(
      await fs.readFile(
        path.resolve(testDirectory, "../public/r/new-york/button.json"),
        "utf8",
      ),
    ) as { $schema: string };

    expect(componentsSchemaUrl("https://registry.example/")).toBe(
      "https://registry.example/schema/components.json",
    );
    expect(() => componentsSchemaUrl("  ")).toThrow(ComponentsConfigError);
    expect(validComponentsConfig().$schema).toBe(
      "https://registry.example/schema/components.json",
    );
    expect(example.trim()).toBe(
      `REGISTRY_BASE_URL=${defaultRegistryBaseUrl}\n\n# Docs site only. Read by apps/docs at build and dev time.\nNEXT_PUBLIC_PORTFOLIO_URL=https://sarangkumar.vercel.app`,
    );
    expect(registryBaseUrlFromEnv({})).toBe(defaultRegistryBaseUrl);
    expect(
      registryBaseUrlFromEnv({ REGISTRY_BASE_URL: "http://localhost:3000" }),
    ).toBe("http://localhost:3000");
    expect(componentsSchemaUrl("https://vinyaas.vercel.app")).toBe(
      "https://vinyaas.vercel.app/schema/components.json",
    );
    expect(button.$schema).toBe(
      "https://vinyaas.vercel.app/schema/registry-item.json",
    );
  });

  it("rejects an unsupported style and non-boolean flags", () => {
    const config = validComponentsConfig();

    expect(() =>
      parseComponentsConfig({ ...config, style: "some-random-style" }),
    ).toThrow(/style/);
    expect(() => parseComponentsConfig({ ...config, tsx: "true" })).toThrow(
      /tsx/,
    );
    expect(() =>
      parseComponentsConfig({
        ...config,
        tailwind: { ...config.tailwind, cssVariables: "true" },
      }),
    ).toThrow(/cssVariables/);
    expect(() =>
      parseComponentsConfig({
        ...config,
        tailwind: { ...config.tailwind, baseColor: "blue" },
      }),
    ).toThrow(/baseColor/);
  });

  it("rejects missing install locations and absolute css paths", () => {
    const config = validComponentsConfig();

    expect(() => parseComponentsConfig(null)).toThrow(ComponentsConfigError);
    expect(() =>
      parseComponentsConfig({
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
      parseComponentsConfig({
        ...config,
        tailwind: { ...config.tailwind, css: "/app/globals.css" },
      }),
    ).toThrow(/project-relative path/);
    expect(() => parseComponentsConfig({ ...config, rsc: true })).toThrow(
      /unknown fields/,
    );
  });

  it("applies defaults when optional fields are omitted", () => {
    expect(
      parseComponentsConfig({
        style: "new-york",
        tailwind: { css: "app/globals.css" },
        aliases: {
          components: "@/components",
          ui: "@/components/ui",
          utils: "@/lib/utils",
        },
      }),
    ).toEqual({
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
        utils: "@/lib/utils",
      },
    });
  });

  it("matches the published json schema", () => {
    expect(componentsSchema.required).toEqual([
      ...componentsConfigRequiredFields,
    ]);
    expect(Object.keys(componentsSchema.properties)).toEqual([
      ...componentsConfigFields,
    ]);
    expect(componentsSchema.properties.style.enum).toEqual([
      ...componentStyles,
    ]);
    expect(componentsSchema.properties.tsx.default).toBe(true);
    expect(componentsSchema.properties.tailwind.required).toEqual([
      ...componentsTailwindRequiredFields,
    ]);
    expect(
      Object.keys(componentsSchema.properties.tailwind.properties),
    ).toEqual([...componentsTailwindFields]);
    expect(
      componentsSchema.properties.tailwind.properties.baseColor.enum,
    ).toEqual([...componentBaseColors]);
    expect(
      componentsSchema.properties.tailwind.properties.baseColor.default,
    ).toBe("neutral");
    expect(
      componentsSchema.properties.tailwind.properties.cssVariables.default,
    ).toBe(true);
    expect(componentsSchema.properties.aliases.required).toEqual([
      ...componentsAliasRequiredFields,
    ]);
    expect(Object.keys(componentsSchema.properties.aliases.properties)).toEqual(
      [...componentsAliasFields],
    );
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

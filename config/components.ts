/**
 * Consumer `components.json` contract.
 *
 * Registry items describe what Vinyas can install. This file describes how a
 * consumer project wants those items installed. The JSON schema is served at
 * `/schema/components.json`; build its URL from the same base as registry
 * item schemas.
 */
export const componentStyles = ["new-york"] as const;

export type ComponentStyle = (typeof componentStyles)[number];

export const componentsConfigFields = [
  "$schema",
  "style",
  "tsx",
  "tailwind",
  "aliases",
] as const;

export const componentsTailwindFields = [
  "css",
  "baseColor",
  "cssVariables",
] as const;

export const componentsAliasFields = [
  "components",
  "ui",
  "lib",
  "utils",
  "hooks",
] as const;

export const componentsSchemaPath = "/schema/components.json";

export interface ComponentsAliases {
  components: string;
  ui: string;
  lib: string;
  utils: string;
  hooks: string;
}

export interface ComponentsTailwindConfig {
  /** Global CSS file, relative to the consumer project. */
  css: string;
  /** Base palette name used when CSS variables are installed. */
  baseColor: string;
  /** Install colors as CSS variables when true. */
  cssVariables: boolean;
}

export interface ComponentsConfig {
  $schema: string;
  style: ComponentStyle;
  /** Emit TypeScript components when true, JavaScript when false. */
  tsx: boolean;
  tailwind: ComponentsTailwindConfig;
  aliases: ComponentsAliases;
}

export class ComponentsConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ComponentsConfigError";
  }
}

export function componentsSchemaUrl(registryBaseUrl: string): string {
  const base = registryBaseUrl.trim().replace(/\/$/, "");

  if (!base) {
    throw new ComponentsConfigError(
      "A registry base URL is required to build the components.json schema URL",
    );
  }

  return `${base}${componentsSchemaPath}`;
}

export function parseComponentsConfig(input: unknown): ComponentsConfig {
  const config = requireRecord(input, "components.json");

  assertFields(config, componentsConfigFields, "components.json");

  return {
    $schema: requireString(config.$schema, "$schema"),
    style: requireStyle(config.style),
    tsx: requireBoolean(config.tsx, "tsx"),
    tailwind: parseTailwind(config.tailwind),
    aliases: parseAliases(config.aliases),
  };
}

function parseTailwind(input: unknown): ComponentsTailwindConfig {
  const tailwind = requireRecord(input, "tailwind");

  assertFields(tailwind, componentsTailwindFields, "tailwind");

  return {
    css: requireString(tailwind.css, "tailwind.css"),
    baseColor: requireString(tailwind.baseColor, "tailwind.baseColor"),
    cssVariables: requireBoolean(
      tailwind.cssVariables,
      "tailwind.cssVariables",
    ),
  };
}

function parseAliases(input: unknown): ComponentsAliases {
  const aliases = requireRecord(input, "aliases");

  assertFields(aliases, componentsAliasFields, "aliases");

  return {
    components: requireString(aliases.components, "aliases.components"),
    ui: requireString(aliases.ui, "aliases.ui"),
    lib: requireString(aliases.lib, "aliases.lib"),
    utils: requireString(aliases.utils, "aliases.utils"),
    hooks: requireString(aliases.hooks, "aliases.hooks"),
  };
}

function requireStyle(value: unknown): ComponentStyle {
  if (typeof value !== "string" || !isComponentStyle(value)) {
    throw new ComponentsConfigError(
      `style must be one of: ${componentStyles.join(", ")}`,
    );
  }

  return value;
}

function isComponentStyle(value: string): value is ComponentStyle {
  return (componentStyles as readonly string[]).includes(value);
}

function requireRecord(value: unknown, label: string): Record<string, unknown> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new ComponentsConfigError(`${label} must be an object`);
  }

  return value as Record<string, unknown>;
}

function assertFields(
  value: Record<string, unknown>,
  allowed: readonly string[],
  label: string,
): void {
  const unknown = Object.keys(value).filter((key) => !allowed.includes(key));

  if (unknown.length > 0) {
    throw new ComponentsConfigError(
      `${label} has unknown fields: ${unknown.join(", ")}`,
    );
  }

  for (const field of allowed) {
    if (!(field in value)) {
      throw new ComponentsConfigError(`${label} is missing ${field}`);
    }
  }
}

function requireString(value: unknown, label: string): string {
  if (typeof value !== "string" || value.trim() === "") {
    throw new ComponentsConfigError(`${label} must be a non-empty string`);
  }

  return value;
}

function requireBoolean(value: unknown, label: string): boolean {
  if (typeof value !== "boolean") {
    throw new ComponentsConfigError(`${label} must be a boolean`);
  }

  return value;
}

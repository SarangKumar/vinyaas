/**
 * Consumer `components.json` contract.
 *
 * Registry items describe what Vinyaas can install. This file describes how a
 * consumer project wants those items installed. The JSON schema is served under
 * the registry base path at `schema/components.json`; build its URL from
 * `getRegistryBasePath()` in `config/registry.ts`.
 *
 * Required, because the CLI cannot guess them:
 * style, tailwind.css, aliases.components, aliases.ui, and aliases.utils.
 *
 * Defaults when omitted: tsx true, tailwind.baseColor "neutral", and
 * tailwind.cssVariables true.
 *
 * Optional, with no assumed path: $schema, aliases.lib, and aliases.hooks.
 * Init writes $schema from REGISTRY_BASE_PATH. lib and hooks are used only
 * when the consumer sets them.
 */
export {
  componentsSchemaPath,
  componentsSchemaUrl,
  defaultRegistryBasePath,
  defaultRegistryBaseUrl,
  getRegistryBasePath,
  getRegistryOrigin,
  registryBaseUrlFromEnv,
  registryItemSchemaUrl,
  RegistryBasePathError,
} from "./registry.ts";

export const componentStyles = ["new-york"] as const;

/** Add a style here and in the components schema enum together. */
export type ComponentStyle = (typeof componentStyles)[number];

export const componentBaseColors = ["neutral"] as const;

export type ComponentBaseColor = (typeof componentBaseColors)[number];

export const componentsConfigFields = [
  "$schema",
  "style",
  "tsx",
  "tailwind",
  "aliases",
] as const;

export const componentsConfigRequiredFields = [
  "style",
  "tailwind",
  "aliases",
] as const;

export const componentsTailwindFields = [
  "css",
  "baseColor",
  "cssVariables",
] as const;

export const componentsTailwindRequiredFields = ["css"] as const;

export const componentsAliasFields = [
  "components",
  "ui",
  "lib",
  "utils",
  "hooks",
] as const;

export const componentsAliasRequiredFields = [
  "components",
  "ui",
  "utils",
] as const;

export interface ComponentsAliases {
  /** Import specifier for installed components, such as `@/components`. */
  components: string;
  /** Import specifier for UI components, such as `@/components/ui`. */
  ui: string;
  /** Import specifier for shared library files. Omitted until the consumer sets it. */
  lib?: string;
  /** Import specifier for the cn helper, such as `@/lib/utils`. */
  utils: string;
  /** Import specifier for hooks. Omitted until the consumer sets it. */
  hooks?: string;
}

export interface ComponentsTailwindConfig {
  /** Global CSS file, relative to the consumer project root. */
  css: string;
  /** Base palette. Defaults to `neutral` when omitted. */
  baseColor: ComponentBaseColor;
  /** Install colors as CSS variables. Defaults to true when omitted. */
  cssVariables: boolean;
}

export interface ComponentsConfig {
  /** Editor schema URL. Init writes this from REGISTRY_BASE_PATH. */
  $schema?: string;
  style: ComponentStyle;
  /** Emit TypeScript components when true. Defaults to true when omitted. */
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

export function parseComponentsConfig(input: unknown): ComponentsConfig {
  const config = requireRecord(input, "components.json");

  assertFields(
    config,
    componentsConfigFields,
    componentsConfigRequiredFields,
    "components.json",
  );

  const schema = optionalString(config.$schema, "$schema");

  return {
    ...(schema ? { $schema: schema } : {}),
    style: requireStyle(config.style),
    tsx: optionalBoolean(config.tsx, "tsx", true),
    tailwind: parseTailwind(config.tailwind),
    aliases: parseAliases(config.aliases),
  };
}

function parseTailwind(input: unknown): ComponentsTailwindConfig {
  const tailwind = requireRecord(input, "tailwind");

  assertFields(
    tailwind,
    componentsTailwindFields,
    componentsTailwindRequiredFields,
    "tailwind",
  );

  return {
    css: requireProjectRelativePath(tailwind.css, "tailwind.css"),
    baseColor: optionalBaseColor(tailwind.baseColor),
    cssVariables: optionalBoolean(
      tailwind.cssVariables,
      "tailwind.cssVariables",
      true,
    ),
  };
}

function parseAliases(input: unknown): ComponentsAliases {
  const aliases = requireRecord(input, "aliases");

  assertFields(
    aliases,
    componentsAliasFields,
    componentsAliasRequiredFields,
    "aliases",
  );

  const lib = optionalString(aliases.lib, "aliases.lib");
  const hooks = optionalString(aliases.hooks, "aliases.hooks");

  return {
    components: requireString(aliases.components, "aliases.components"),
    ui: requireString(aliases.ui, "aliases.ui"),
    ...(lib ? { lib } : {}),
    utils: requireString(aliases.utils, "aliases.utils"),
    ...(hooks ? { hooks } : {}),
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

function optionalBaseColor(value: unknown): ComponentBaseColor {
  if (value === undefined) {
    return "neutral";
  }

  if (typeof value !== "string" || !isComponentBaseColor(value)) {
    throw new ComponentsConfigError(
      `tailwind.baseColor must be one of: ${componentBaseColors.join(", ")}`,
    );
  }

  return value;
}

function isComponentBaseColor(value: string): value is ComponentBaseColor {
  return (componentBaseColors as readonly string[]).includes(value);
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
  required: readonly string[],
  label: string,
): void {
  const unknown = Object.keys(value).filter((key) => !allowed.includes(key));

  if (unknown.length > 0) {
    throw new ComponentsConfigError(
      `${label} has unknown fields: ${unknown.join(", ")}`,
    );
  }

  for (const field of required) {
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

function optionalString(value: unknown, label: string): string | undefined {
  if (value === undefined) {
    return undefined;
  }

  return requireString(value, label);
}

function requireBoolean(value: unknown, label: string): boolean {
  if (typeof value !== "boolean") {
    throw new ComponentsConfigError(`${label} must be a boolean`);
  }

  return value;
}

function optionalBoolean(
  value: unknown,
  label: string,
  fallback: boolean,
): boolean {
  if (value === undefined) {
    return fallback;
  }

  return requireBoolean(value, label);
}

function requireProjectRelativePath(value: unknown, label: string): string {
  const filePath = requireString(value, label);
  const segments = filePath.split(/[\\/]/);

  if (
    filePath.startsWith("/") ||
    filePath.startsWith("\\") ||
    /^[a-zA-Z]:[\\/]/.test(filePath) ||
    filePath.includes("://") ||
    segments.includes("..")
  ) {
    throw new ComponentsConfigError(`${label} must be a project-relative path`);
  }

  return filePath;
}

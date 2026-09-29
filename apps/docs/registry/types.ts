/**
 * Source registry model.
 *
 * Installable JSON is produced by the registry build. Keep these item types
 * aligned with `apps/docs/public/schema/registry-item.json`.
 */
export const registryItemTypes = ["registry:ui"] as const;

export type RegistryItemType = (typeof registryItemTypes)[number];

/** File delivered to a consumer project. Content is added during the build. */
export interface RegistryFile {
  /** Path relative to the theme directory, such as `ui/button/index.tsx`. */
  path: string;
  type?: RegistryItemType;
  /** Optional destination hint for a future CLI. */
  target?: string;
}

export interface RegistryCssVars {
  light?: Record<string, string>;
  dark?: Record<string, string>;
}

export interface RegistryItem {
  name: string;
  type: RegistryItemType;
  /** npm packages required by this item. */
  dependencies?: readonly string[];
  /** npm packages required only for development. */
  devDependencies?: readonly string[];
  /** Other Vinyaas registry items this item depends on. */
  registryDependencies?: readonly string[];
  files: readonly RegistryFile[];
  cssVars?: RegistryCssVars;
  /** Additional CSS associated with this item. */
  css?: Record<string, string>;
  /** Environment variables required by this item. */
  envVars?: Record<string, string>;
  /** Optional documentation for this item. */
  docs?: string;
}

/** A registry file after its source contents have been read. */
export interface RegistryItemFile extends RegistryFile {
  content: string;
}

/** Installable registry item written to `public/r`. */
export interface RegistryItemPayload {
  $schema: string;
  name: string;
  type: RegistryItemType;
  dependencies: string[];
  devDependencies?: string[];
  registryDependencies?: string[];
  files: RegistryItemFile[];
  cssVars?: RegistryCssVars;
  css?: Record<string, string>;
  envVars?: Record<string, string>;
  docs?: string;
}

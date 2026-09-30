/**
 * Installable registry item returned by the registry HTTP API.
 *
 * This matches the payload produced by `apps/docs/registry/serialize.ts` and
 * `apps/docs/public/schema/registry-item.json`. The CLI does not import the
 * docs app. A shared package is not justified until the registry builder and
 * the CLI need to import one module.
 */
export const registryItemTypes = ["registry:ui"] as const;

export type RegistryItemType = (typeof registryItemTypes)[number];

/** Default style used by discovery commands when no project config is loaded. */
export const defaultRegistryStyle = "new-york";

export interface RegistryCssVars {
  light?: Record<string, string>;
  dark?: Record<string, string>;
}

export interface RegistryItemFile {
  path: string;
  content: string;
  type?: RegistryItemType;
  target?: string;
}

export interface RegistryItem {
  $schema: string;
  name: string;
  type: RegistryItemType;
  /** Short user-facing summary for discovery commands. */
  description?: string;
  /** npm packages. Always present, and possibly empty. */
  dependencies: string[];
  /** npm packages required only for development. */
  devDependencies?: string[];
  /** Other Vinyaas registry items. Not resolved by the client. */
  registryDependencies?: string[];
  files: RegistryItemFile[];
  cssVars?: RegistryCssVars;
  css?: Record<string, string>;
  envVars?: Record<string, string>;
  docs?: string;
}

/** Lightweight catalog entry from `/r/<style>/index.json`. */
export interface RegistryCatalogItem {
  name: string;
  type: RegistryItemType;
  description?: string;
  docs?: string;
  /** @deprecated Present only on older catalogs. Prefer full item payloads. */
  dependencies?: string[];
  /** @deprecated Present only on older catalogs. */
  devDependencies?: string[];
  /** @deprecated Present only on older catalogs. */
  registryDependencies?: string[];
  /** @deprecated Present only on older catalogs. Prefer full item payloads. */
  files?: string[];
}

/** Style catalog for list and search. */
export interface RegistryCatalog {
  style: string;
  items: RegistryCatalogItem[];
}

/**
 * Stable discovery JSON for list/search.
 * Catalog entries are intentionally lightweight.
 */
export interface RegistryDiscoverySummary {
  name: string;
  type: RegistryItemType;
  description?: string;
  docs?: string;
}

/**
 * Stable discovery JSON for `vinyaas info --json`.
 * Omits file contents and other install-only payloads.
 */
export interface RegistryItemSummary {
  name: string;
  description?: string;
  type: RegistryItemType;
  files: string[];
  dependencies: string[];
  devDependencies?: string[];
  registryDependencies: string[];
  docs?: string;
  cssVars?: boolean;
  css?: boolean;
  envVars?: string[];
}

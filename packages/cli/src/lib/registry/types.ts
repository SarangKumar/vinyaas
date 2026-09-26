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
  /** npm packages. Always present, and possibly empty. */
  dependencies: string[];
  /** npm packages required only for development. */
  devDependencies?: string[];
  /** Other Vinyas registry items. Not resolved by the client. */
  registryDependencies?: string[];
  files: RegistryItemFile[];
  cssVars?: RegistryCssVars;
  css?: Record<string, string>;
  envVars?: Record<string, string>;
  docs?: string;
}

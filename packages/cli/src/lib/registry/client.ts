import {
  getRegistryBasePath,
  normalizeRegistryBasePath,
} from "../../../../../config/registry.ts";

import {
  registryItemTypes,
  type ComponentCatalog,
  type ComponentCatalogIndex,
  type RegistryCatalog,
  type RegistryCatalogItem,
  type RegistryCssVars,
  type RegistryItem,
  type RegistryItemFile,
  type RegistryItemType,
} from "./types.ts";

const registryItemFields = [
  "$schema",
  "name",
  "type",
  "description",
  "dependencies",
  "devDependencies",
  "registryDependencies",
  "files",
  "cssVars",
  "css",
  "envVars",
  "docs",
  "category",
] as const;

const registryItemRequiredFields = [
  "$schema",
  "name",
  "type",
  "dependencies",
  "files",
] as const;

const registryFileFields = ["path", "content", "type", "target"] as const;

const cssVarFields = ["light", "dark"] as const;

export class RegistryError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = "RegistryError";
  }
}

const registryUnavailableMessage = [
  "Unable to load Vinyaas registry.",
  "",
  "Possible causes:",
  "- network unavailable",
  "- registry unavailable",
  "- invalid style configuration",
  "",
  "Try again later.",
].join("\n");

function registryUnavailableError(
  details: string,
  options?: { cause?: unknown; env?: Record<string, string | undefined> },
): RegistryError {
  const env = options?.env ?? process.env;
  const debug =
    env.VINYAAS_DEBUG === "1" ||
    env.VINYAAS_DEBUG === "true" ||
    env.DEBUG === "vinyaas";

  if (debug) {
    return new RegistryError(
      `${registryUnavailableMessage}\n\nDetails:\n${details}`,
      options?.cause ? { cause: options.cause } : undefined,
    );
  }

  return new RegistryError(
    registryUnavailableMessage,
    options?.cause ? { cause: options.cause } : undefined,
  );
}

export function buildRegistryItemUrl({
  baseUrl,
  basePath,
  style,
  name,
}: {
  /** @deprecated Prefer basePath (registry root ending with `/r`). */
  baseUrl?: string;
  basePath?: string;
  style: string;
  name: string;
}): string {
  assertPathSegment(style, "style");
  assertPathSegment(name, "name");

  const registryPath = resolveRegistryBasePath({ basePath, baseUrl });

  let url: URL;

  try {
    url = new URL(
      `${encodeURIComponent(style)}/${encodeURIComponent(name)}.json`,
      `${registryPath}/`,
    );
  } catch (error) {
    throw new RegistryError("Registry base URL is invalid.", { cause: error });
  }

  url.search = "";
  url.hash = "";

  return url.href;
}

export function buildRegistryCatalogUrl({
  baseUrl,
  basePath,
  style,
}: {
  /** @deprecated Prefer basePath (registry root ending with `/r`). */
  baseUrl?: string;
  basePath?: string;
  style: string;
}): string {
  assertPathSegment(style, "style");

  const registryPath = resolveRegistryBasePath({ basePath, baseUrl });

  let url: URL;

  try {
    url = new URL(
      `${encodeURIComponent(style)}/index.json`,
      `${registryPath}/`,
    );
  } catch (error) {
    throw new RegistryError("Registry base URL is invalid.", { cause: error });
  }

  url.search = "";
  url.hash = "";

  return url.href;
}

export async function fetchRegistryItem({
  style,
  name,
  baseUrl,
  basePath,
  env = process.env,
  fetch: fetchImpl = fetch,
}: {
  style: string;
  name: string;
  /** @deprecated Prefer basePath. */
  baseUrl?: string;
  basePath?: string;
  env?: Record<string, string | undefined>;
  fetch?: typeof fetch;
}): Promise<RegistryItem> {
  const url = buildRegistryItemUrl({
    basePath: basePath ?? (baseUrl ? undefined : getRegistryBasePath(env)),
    ...(baseUrl ? { baseUrl } : {}),
    style,
    name,
  });

  let response: Response;

  try {
    response = await fetchImpl(url, { method: "GET" });
  } catch (error) {
    throw registryUnavailableError(`Could not reach ${url}`, {
      cause: error,
      env,
    });
  }

  if (response.status === 404) {
    throw new RegistryError(`Registry item not found:\n${url}`);
  }

  if (!response.ok) {
    throw registryUnavailableError(
      `Failed to fetch registry item ${url} (HTTP ${response.status}).`,
      { env },
    );
  }

  let body: unknown;

  try {
    body = await response.json();
  } catch (error) {
    throw new RegistryError("The registry returned invalid JSON.", {
      cause: error,
    });
  }

  return parseRegistryItem(body);
}

export async function fetchRegistryCatalog({
  style,
  baseUrl,
  basePath,
  env = process.env,
  fetch: fetchImpl = fetch,
}: {
  style: string;
  /** @deprecated Prefer basePath. */
  baseUrl?: string;
  basePath?: string;
  env?: Record<string, string | undefined>;
  fetch?: typeof fetch;
}): Promise<RegistryCatalog> {
  const url = buildRegistryCatalogUrl({
    basePath: basePath ?? (baseUrl ? undefined : getRegistryBasePath(env)),
    ...(baseUrl ? { baseUrl } : {}),
    style,
  });

  let response: Response;

  try {
    response = await fetchImpl(url, { method: "GET" });
  } catch (error) {
    throw registryUnavailableError(`Could not reach ${url}`, {
      cause: error,
      env,
    });
  }

  if (response.status === 404) {
    throw registryUnavailableError(`Registry catalog not found: ${url}`, {
      env,
    });
  }

  if (!response.ok) {
    throw registryUnavailableError(
      `Failed to fetch registry catalog ${url} (HTTP ${response.status}).`,
      { env },
    );
  }

  let body: unknown;

  try {
    body = await response.json();
  } catch (error) {
    throw new RegistryError("The registry returned invalid JSON.", {
      cause: error,
    });
  }

  return parseRegistryCatalog(body);
}

export function buildComponentCatalogIndexUrl({
  baseUrl,
  basePath,
}: {
  /** @deprecated Prefer basePath (registry root ending with `/r`). */
  baseUrl?: string;
  basePath?: string;
} = {}): string {
  const registryPath = resolveRegistryBasePath({ basePath, baseUrl });

  let url: URL;

  try {
    url = new URL("catalogs/index.json", `${registryPath}/`);
  } catch (error) {
    throw new RegistryError("Registry base URL is invalid.", { cause: error });
  }

  url.search = "";
  url.hash = "";

  return url.href;
}

export async function fetchComponentCatalogIndex({
  baseUrl,
  basePath,
  env = process.env,
  fetch: fetchImpl = fetch,
}: {
  /** @deprecated Prefer basePath. */
  baseUrl?: string;
  basePath?: string;
  env?: Record<string, string | undefined>;
  fetch?: typeof fetch;
} = {}): Promise<ComponentCatalogIndex> {
  const url = buildComponentCatalogIndexUrl({
    basePath: basePath ?? (baseUrl ? undefined : getRegistryBasePath(env)),
    ...(baseUrl ? { baseUrl } : {}),
  });

  let response: Response;

  try {
    response = await fetchImpl(url, { method: "GET" });
  } catch (error) {
    throw registryUnavailableError(`Could not reach ${url}`, {
      cause: error,
      env,
    });
  }

  if (response.status === 404) {
    throw registryUnavailableError(`Component catalogs not found: ${url}`, {
      env,
    });
  }

  if (!response.ok) {
    throw registryUnavailableError(
      `Failed to fetch component catalogs ${url} (HTTP ${response.status}).`,
      { env },
    );
  }

  let body: unknown;

  try {
    body = await response.json();
  } catch (error) {
    throw new RegistryError("The registry returned invalid JSON.", {
      cause: error,
    });
  }

  return parseComponentCatalogIndex(body);
}

export function parseRegistryItem(input: unknown): RegistryItem {
  const item = requireRecord(input, "Registry item");

  assertFields(
    item,
    registryItemFields,
    registryItemRequiredFields,
    "Registry item",
  );

  const description = optionalString(item.description, "description");
  const devDependencies = optionalStringArray(
    item.devDependencies,
    "devDependencies",
  );
  const registryDependencies = optionalStringArray(
    item.registryDependencies,
    "registryDependencies",
  );
  const cssVars = optionalCssVars(item.cssVars);
  const css = optionalStringRecord(item.css, "css");
  const envVars = optionalStringRecord(item.envVars, "envVars");
  const docs = optionalString(item.docs, "docs");
  const category = optionalString(item.category, "category");

  return {
    $schema: requireString(item.$schema, "$schema"),
    name: requireString(item.name, "name"),
    type: requireRegistryType(item.type, "type"),
    ...(description ? { description } : {}),
    dependencies: requireStringArray(item.dependencies, "dependencies"),
    ...(devDependencies ? { devDependencies } : {}),
    ...(registryDependencies ? { registryDependencies } : {}),
    files: requireFiles(item.files),
    ...(cssVars ? { cssVars } : {}),
    ...(css ? { css } : {}),
    ...(envVars ? { envVars } : {}),
    ...(docs ? { docs } : {}),
    ...(category ? { category } : {}),
  };
}

const registryCatalogFields = ["style", "items"] as const;

const registryCatalogItemFields = [
  "name",
  "type",
  "description",
  "docs",
  "category",
  // Older catalogs may still ship install metadata. Accept and ignore.
  "dependencies",
  "devDependencies",
  "registryDependencies",
  "files",
] as const;

export function parseRegistryCatalog(input: unknown): RegistryCatalog {
  const catalog = requireRecord(input, "Registry catalog");

  assertFields(
    catalog,
    registryCatalogFields,
    ["style", "items"],
    "Registry catalog",
  );

  if (!Array.isArray(catalog.items)) {
    throw new RegistryError("items must be an array");
  }

  const items = catalog.items.map((entry, index) =>
    parseCatalogItem(entry, `items[${index}]`),
  );

  return {
    style: requireString(catalog.style, "style"),
    items: sortCatalogItems(items),
  };
}

const componentCatalogIndexFields = ["type", "items"] as const;
const componentCatalogFields = [
  "id",
  "name",
  "description",
  "components",
] as const;

export function parseComponentCatalogIndex(
  input: unknown,
): ComponentCatalogIndex {
  const catalog = requireRecord(input, "Component catalog index");

  assertFields(
    catalog,
    componentCatalogIndexFields,
    ["type", "items"],
    "Component catalog index",
  );

  if (catalog.type !== "catalogs") {
    throw new RegistryError('type must be "catalogs"');
  }

  if (!Array.isArray(catalog.items)) {
    throw new RegistryError("items must be an array");
  }

  const items = catalog.items.map((entry, index) =>
    parseComponentCatalog(entry, `items[${index}]`),
  );

  return {
    type: "catalogs",
    items: [...items].sort((left, right) => left.id.localeCompare(right.id)),
  };
}

function parseComponentCatalog(
  input: unknown,
  label: string,
): ComponentCatalog {
  const item = requireRecord(input, label);

  assertFields(item, componentCatalogFields, componentCatalogFields, label);

  return {
    id: requireString(item.id, `${label}.id`),
    name: requireString(item.name, `${label}.name`),
    description: requireString(item.description, `${label}.description`),
    components: requireStringArray(item.components, `${label}.components`),
  };
}

function parseCatalogItem(input: unknown, label: string): RegistryCatalogItem {
  const item = requireRecord(input, label);

  assertFields(item, registryCatalogItemFields, ["name", "type"], label);

  const description = optionalString(item.description, `${label}.description`);
  const docs = optionalString(item.docs, `${label}.docs`);
  const category = optionalString(item.category, `${label}.category`);
  const dependencies = optionalStringArray(
    item.dependencies,
    `${label}.dependencies`,
  );
  const devDependencies = optionalStringArray(
    item.devDependencies,
    `${label}.devDependencies`,
  );
  const registryDependencies = optionalStringArray(
    item.registryDependencies,
    `${label}.registryDependencies`,
  );
  const files = optionalStringArray(item.files, `${label}.files`);

  return {
    name: requireString(item.name, `${label}.name`),
    type: requireRegistryType(item.type, `${label}.type`),
    ...(description ? { description } : {}),
    ...(docs ? { docs } : {}),
    ...(category ? { category } : {}),
    ...(dependencies ? { dependencies } : {}),
    ...(devDependencies ? { devDependencies } : {}),
    ...(registryDependencies ? { registryDependencies } : {}),
    ...(files ? { files } : {}),
  };
}

function sortCatalogItems(
  items: readonly RegistryCatalogItem[],
): RegistryCatalogItem[] {
  return [...items].sort((left, right) => left.name.localeCompare(right.name));
}

function resolveRegistryBasePath({
  basePath,
  baseUrl,
}: {
  basePath?: string;
  baseUrl?: string;
}): string {
  if (basePath?.trim()) {
    return normalizeRegistryBasePath(basePath);
  }

  if (baseUrl?.trim()) {
    return normalizeRegistryBasePath(baseUrl);
  }

  throw new RegistryError("Registry base path is required.");
}

function assertPathSegment(value: string, label: string): void {
  let url: URL | undefined;

  try {
    url = new URL(value);
  } catch {
    url = undefined;
  }

  if (
    value.trim() === "" ||
    value !== value.trim() ||
    value.includes("/") ||
    value.includes("\\") ||
    value.includes("..") ||
    value.includes("?") ||
    value.includes("#") ||
    value.includes("%") ||
    url?.protocol === "http:" ||
    url?.protocol === "https:"
  ) {
    throw new RegistryError(
      `Registry ${label} must be a single path segment, not a URL or path.`,
    );
  }
}

function requireFiles(value: unknown): RegistryItemFile[] {
  if (!Array.isArray(value)) {
    throw new RegistryError("files must be an array");
  }

  return value.map((file, index) => {
    const record = requireRecord(file, `files[${index}]`);

    assertFields(
      record,
      registryFileFields,
      ["path", "content"],
      `files[${index}]`,
    );

    const type = optionalRegistryType(record.type, `files[${index}].type`);
    const target = optionalString(record.target, `files[${index}].target`);

    return {
      path: requireString(record.path, `files[${index}].path`),
      content: requireString(record.content, `files[${index}].content`, true),
      ...(type ? { type } : {}),
      ...(target ? { target } : {}),
    };
  });
}

function optionalCssVars(value: unknown): RegistryCssVars | undefined {
  if (value === undefined) {
    return undefined;
  }

  const cssVars = requireRecord(value, "cssVars");

  assertFields(cssVars, cssVarFields, [], "cssVars");

  const light = optionalStringRecord(cssVars.light, "cssVars.light");
  const dark = optionalStringRecord(cssVars.dark, "cssVars.dark");

  return {
    ...(light ? { light } : {}),
    ...(dark ? { dark } : {}),
  };
}

function requireRegistryType(value: unknown, label: string): RegistryItemType {
  if (typeof value !== "string" || !isRegistryItemType(value)) {
    throw new RegistryError(
      `${label} must be one of: ${registryItemTypes.join(", ")}`,
    );
  }

  return value;
}

function optionalRegistryType(
  value: unknown,
  label: string,
): RegistryItemType | undefined {
  if (value === undefined) {
    return undefined;
  }

  return requireRegistryType(value, label);
}

function isRegistryItemType(value: string): value is RegistryItemType {
  return (registryItemTypes as readonly string[]).includes(value);
}

function requireStringArray(value: unknown, label: string): string[] {
  if (!Array.isArray(value)) {
    throw new RegistryError(`${label} must be an array of strings`);
  }

  return value.map((item, index) => requireString(item, `${label}[${index}]`));
}

function optionalStringArray(
  value: unknown,
  label: string,
): string[] | undefined {
  if (value === undefined) {
    return undefined;
  }

  return requireStringArray(value, label);
}

function optionalStringRecord(
  value: unknown,
  label: string,
): Record<string, string> | undefined {
  if (value === undefined) {
    return undefined;
  }

  const record = requireRecord(value, label);
  const result: Record<string, string> = {};

  for (const [key, entry] of Object.entries(record)) {
    result[key] = requireString(entry, `${label}.${key}`);
  }

  return result;
}

function requireRecord(value: unknown, label: string): Record<string, unknown> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new RegistryError(`${label} must be an object`);
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
    throw new RegistryError(
      `${label} has unknown fields: ${unknown.join(", ")}`,
    );
  }

  for (const field of required) {
    if (!(field in value)) {
      throw new RegistryError(`${label} is missing ${field}`);
    }
  }
}

function requireString(
  value: unknown,
  label: string,
  allowEmpty = false,
): string {
  if (typeof value !== "string" || (!allowEmpty && value.trim() === "")) {
    throw new RegistryError(
      allowEmpty
        ? `${label} must be a string`
        : `${label} must be a non-empty string`,
    );
  }

  return value;
}

function optionalString(value: unknown, label: string): string | undefined {
  if (value === undefined) {
    return undefined;
  }

  return requireString(value, label);
}

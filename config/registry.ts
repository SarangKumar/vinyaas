/**
 * Registry location configuration.
 *
 * REGISTRY_BASE_PATH is the installable registry root and always ends with `/r`.
 * Example: `http://localhost:3000/r` or `https://vinyaas.vercel.app/r`.
 *
 * Schema URLs and registry JSON URLs are built from this value. Site pages
 * (docs) use the origin derived by stripping the trailing `/r`.
 *
 * Prefer REGISTRY_BASE_PATH. REGISTRY_BASE_URL (site origin) is accepted as a
 * legacy alias and normalized to a path by appending `/r`.
 */

/** Local development fallback when the env var is unset. */
export const defaultRegistryBasePath = "http://localhost:3000/r";

/** @deprecated Prefer defaultRegistryBasePath. Site origin for the local fallback. */
export const defaultRegistryBaseUrl = "http://localhost:3000";

export const registryItemSchemaRelativePath = "schema/registry-item.json";
export const componentsSchemaRelativePath = "schema/components.json";

/** Kept for callers that still concatenate against a site origin. */
export const componentsSchemaPath = `/${componentsSchemaRelativePath}`;

/**
 * Optional build-time default injected by the CLI esbuild bundle.
 * `typeof` is safe when the identifier is not defined in Node scripts.
 */
declare const __VINYAAS_REGISTRY_BASE_PATH__: string | undefined;

export class RegistryBasePathError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RegistryBasePathError";
  }
}

export interface GetRegistryBasePathOptions {
  /**
   * When true, missing env fails instead of using the local fallback.
   * Build/publish tooling should pass this (or set NODE_ENV=production).
   */
  require?: boolean;
}

/**
 * Single entry point for reading registry location from the environment.
 * Do not read REGISTRY_BASE_PATH / REGISTRY_BASE_URL elsewhere.
 */
export function getRegistryBasePath(
  env: Record<string, string | undefined> = process.env,
  options: GetRegistryBasePathOptions = {},
): string {
  const fromPath = env.REGISTRY_BASE_PATH?.trim();
  const fromUrl = env.REGISTRY_BASE_URL?.trim();
  const configured = fromPath || fromUrl;

  if (configured) {
    return normalizeRegistryBasePath(configured);
  }

  const baked = readBuildTimeRegistryBasePath();

  if (baked) {
    return normalizeRegistryBasePath(baked);
  }

  const requireValue = options.require === true || isProductionEnvironment(env);

  if (requireValue) {
    throw new RegistryBasePathError(
      [
        "REGISTRY_BASE_PATH is required when generating production artifacts.",
        "Example: REGISTRY_BASE_PATH=https://vinyaas.vercel.app/r",
      ].join("\n"),
    );
  }

  return defaultRegistryBasePath;
}

/** Site origin derived from a registry base path (`…/r` → `…`). */
export function getRegistryOrigin(registryBasePath: string): string {
  const normalized = normalizeRegistryBasePath(registryBasePath);
  return normalized.replace(/\/r$/, "");
}

/**
 * Site origin for docs URLs and legacy callers.
 * Derived from getRegistryBasePath — does not read env directly beyond that.
 */
export function registryBaseUrlFromEnv(
  env: Record<string, string | undefined> = process.env,
  options: GetRegistryBasePathOptions = {},
): string {
  return getRegistryOrigin(getRegistryBasePath(env, options));
}

export function registryItemSchemaUrl(registryBasePath: string): string {
  return joinRegistryPath(
    normalizeRegistryBasePath(registryBasePath),
    registryItemSchemaRelativePath,
  );
}

/**
 * Builds the components.json $schema URL under the registry base path.
 * Accepts a registry base path (`…/r`) or a legacy site origin.
 */
export function componentsSchemaUrl(registryBasePathOrOrigin: string): string {
  return joinRegistryPath(
    normalizeRegistryBasePath(registryBasePathOrOrigin),
    componentsSchemaRelativePath,
  );
}

export function normalizeRegistryBasePath(value: string): string {
  const trimmed = value.trim().replace(/\/$/, "");

  if (!trimmed) {
    throw new RegistryBasePathError(
      "REGISTRY_BASE_PATH must be a non-empty URL ending with /r.",
    );
  }

  let url: URL;

  try {
    url = new URL(trimmed);
  } catch {
    throw new RegistryBasePathError(
      `REGISTRY_BASE_PATH is not a valid URL: ${value}`,
    );
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new RegistryBasePathError(
      `REGISTRY_BASE_PATH must use http or https: ${value}`,
    );
  }

  const pathname = url.pathname.replace(/\/$/, "") || "";

  if (pathname === "/r" || pathname.endsWith("/r")) {
    url.pathname = pathname;
    url.search = "";
    url.hash = "";
    return url.href.replace(/\/$/, "");
  }

  if (pathname === "" || pathname === "/") {
    url.pathname = "/r";
    url.search = "";
    url.hash = "";
    return url.href.replace(/\/$/, "");
  }

  throw new RegistryBasePathError(
    [
      "REGISTRY_BASE_PATH must be the registry root ending with /r,",
      `or a site origin (legacy REGISTRY_BASE_URL). Received: ${value}`,
    ].join(" "),
  );
}

function readBuildTimeRegistryBasePath(): string | undefined {
  if (typeof __VINYAAS_REGISTRY_BASE_PATH__ !== "string") {
    return undefined;
  }

  const trimmed = __VINYAAS_REGISTRY_BASE_PATH__.trim();
  return trimmed || undefined;
}

function joinRegistryPath(basePath: string, relativePath: string): string {
  return `${basePath.replace(/\/$/, "")}/${relativePath.replace(/^\//, "")}`;
}

function isProductionEnvironment(
  env: Record<string, string | undefined>,
): boolean {
  return env.NODE_ENV === "production";
}

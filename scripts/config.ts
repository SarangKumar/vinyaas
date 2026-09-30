import "dotenv/config";

import {
  componentsSchemaUrl,
  getRegistryBasePath,
  getRegistryOrigin,
  registryItemSchemaUrl,
} from "../config/registry.ts";

/**
 * Tooling config for registry artifact generation.
 * Requires REGISTRY_BASE_PATH (or legacy REGISTRY_BASE_URL).
 */
const registryBasePath = getRegistryBasePath(process.env, { require: true });

export const config = {
  registryBasePath,
  registryBaseUrl: getRegistryOrigin(registryBasePath),
  registryItemSchemaUrl: registryItemSchemaUrl(registryBasePath),
  componentsSchemaUrl: componentsSchemaUrl(registryBasePath),
};

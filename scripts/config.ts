import "dotenv/config";

import { componentsSchemaUrl } from "../config/components";

const registryBaseUrl = process.env.REGISTRY_BASE_URL;

if (!registryBaseUrl) {
  throw new Error("REGISTRY_BASE_URL is not defined");
}

const baseUrl = registryBaseUrl.replace(/\/$/, "");

export const config = {
  registryBaseUrl: baseUrl,
  componentsSchemaUrl: componentsSchemaUrl(baseUrl),
};

import "dotenv/config";

const registryBaseUrl = process.env.REGISTRY_BASE_URL;

if (!registryBaseUrl) {
  throw new Error("REGISTRY_BASE_URL is not defined");
}

export const config = {
  registryBaseUrl: registryBaseUrl.replace(/\/$/, ""),
};

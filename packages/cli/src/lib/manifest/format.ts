import { MANIFEST_RELATIVE_PATH } from "./paths.ts";
import type { VinyaasManifest } from "./types.ts";
import { listManifestComponents } from "./store.ts";

export function formatStatusReport(manifest: VinyaasManifest | null): string {
  const components = listManifestComponents(manifest);

  if (components.length === 0) {
    return [
      "No Vinyaas components installed.",
      "",
      "Run:",
      "",
      "vinyaas add <component>",
    ].join("\n");
  }

  return [
    "Vinyaas",
    "",
    "Installed components:",
    "",
    ...components.map((name) => `✓ ${name}`),
    "",
    "Manifest:",
    MANIFEST_RELATIVE_PATH,
  ].join("\n");
}

export function formatStatusJson(manifest: VinyaasManifest | null): string {
  return JSON.stringify(
    {
      version: manifest?.version ?? null,
      components: listManifestComponents(manifest),
    },
    null,
    2,
  );
}

import type { RegistryItem } from "./types";

/** Docs page URL for a registry component on the Vinyaas site. */
export function defaultRegistryDocsUrl(
  registryBaseUrl: string,
  name: string,
): string {
  const base = registryBaseUrl.trim().replace(/\/$/, "");
  return `${base}/components/${name}`;
}

/** Ensures every item has a docs URL before serialization. */
export function withDefaultDocs(
  item: RegistryItem,
  registryBaseUrl: string,
): RegistryItem {
  const existing = item.docs?.trim();

  if (existing) {
    return item.docs === existing ? item : { ...item, docs: existing };
  }

  return {
    ...item,
    docs: defaultRegistryDocsUrl(registryBaseUrl, item.name),
  };
}

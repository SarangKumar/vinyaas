import { CliError } from "../cli-error.ts";
import {
  RegistryError,
  fetchRegistryCatalog,
  fetchRegistryItem,
} from "./client.ts";
import {
  formatRegistryInfo,
  formatRegistryList,
  formatRegistrySearch,
  toRegistryItemSummary,
} from "./format.ts";
import { searchRegistryCatalog } from "./search.ts";
import { formatUnknownComponentMessage } from "./suggest.ts";
import {
  defaultRegistryStyle,
  type RegistryCatalog,
  type RegistryCatalogItem,
  type RegistryItem,
  type RegistryItemSummary,
} from "./types.ts";

export async function getRegistryCatalog({
  style = defaultRegistryStyle,
  env = process.env,
  fetch: fetchImpl,
}: {
  style?: string;
  env?: Record<string, string | undefined>;
  fetch?: typeof fetch;
} = {}): Promise<RegistryCatalog> {
  return fetchRegistryCatalog({
    style,
    env,
    ...(fetchImpl ? { fetch: fetchImpl } : {}),
  });
}

export async function getRegistryItem({
  name,
  style = defaultRegistryStyle,
  env = process.env,
  fetch: fetchImpl,
}: {
  name: string;
  style?: string;
  env?: Record<string, string | undefined>;
  fetch?: typeof fetch;
}): Promise<RegistryItem> {
  const trimmed = name.trim();

  if (trimmed === "") {
    throw new CliError("Component name is required.");
  }

  try {
    return await fetchRegistryItem({
      style,
      name: trimmed,
      env,
      ...(fetchImpl ? { fetch: fetchImpl } : {}),
    });
  } catch (error) {
    if (
      error instanceof RegistryError &&
      error.message.startsWith("Registry item not found:")
    ) {
      let catalogNames: string[] = [];

      try {
        const catalog = await getRegistryCatalog({
          style,
          env,
          ...(fetchImpl ? { fetch: fetchImpl } : {}),
        });
        catalogNames = catalog.items.map((item) => item.name);
      } catch {
        catalogNames = [];
      }

      throw new RegistryError(
        formatUnknownComponentMessage([trimmed], catalogNames),
      );
    }

    throw error;
  }
}

export async function searchRegistry({
  query,
  style = defaultRegistryStyle,
  env = process.env,
  fetch: fetchImpl,
}: {
  query: string;
  style?: string;
  env?: Record<string, string | undefined>;
  fetch?: typeof fetch;
}): Promise<RegistryCatalogItem[]> {
  const catalog = await getRegistryCatalog({
    style,
    env,
    ...(fetchImpl ? { fetch: fetchImpl } : {}),
  });

  return searchRegistryCatalog(catalog.items, query);
}

export function listRegistrySummaries(
  catalog: RegistryCatalog,
): RegistryItemSummary[] {
  return catalog.items.map((item) => toRegistryItemSummary(item));
}

export {
  formatRegistryInfo,
  formatRegistryList,
  formatRegistrySearch,
  toRegistryItemSummary,
};

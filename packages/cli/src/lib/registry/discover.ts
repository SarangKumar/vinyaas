import { CliError } from "../cli-error.ts";
import {
  filterItemsByCategory,
  requireRegistryCategory,
} from "./categories.ts";
import {
  RegistryError,
  fetchRegistryCatalog,
  fetchRegistryItem,
} from "./client.ts";
import {
  formatRegistryInfo,
  formatRegistryList,
  formatRegistrySearch,
  toRegistryDiscoverySummary,
  toRegistryItemSummary,
} from "./format.ts";
import { searchRegistryCatalog } from "./search.ts";
import { formatUnknownComponentMessage } from "./suggest.ts";
import {
  defaultRegistryStyle,
  type RegistryCatalog,
  type RegistryCatalogItem,
  type RegistryDiscoverySummary,
  type RegistryItem,
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
  category,
  style = defaultRegistryStyle,
  env = process.env,
  fetch: fetchImpl,
}: {
  query: string;
  category?: string;
  style?: string;
  env?: Record<string, string | undefined>;
  fetch?: typeof fetch;
}): Promise<RegistryCatalogItem[]> {
  const catalog = await getRegistryCatalog({
    style,
    env,
    ...(fetchImpl ? { fetch: fetchImpl } : {}),
  });
  const items = category
    ? filterItemsByCategory(catalog.items, category)
    : catalog.items;

  return searchRegistryCatalog(items, query);
}

export function listRegistrySummaries(
  catalog: RegistryCatalog,
  options: { category?: string } = {},
): RegistryDiscoverySummary[] {
  const items = options.category
    ? filterItemsByCategory(catalog.items, options.category)
    : catalog.items;

  return items.map((item) => toRegistryDiscoverySummary(item));
}

export async function resolveCategoryComponentNames({
  category,
  style = defaultRegistryStyle,
  env = process.env,
  fetch: fetchImpl,
}: {
  category: string;
  style?: string;
  env?: Record<string, string | undefined>;
  fetch?: typeof fetch;
}): Promise<string[]> {
  const known = requireRegistryCategory(category);
  const catalog = await getRegistryCatalog({
    style,
    env,
    ...(fetchImpl ? { fetch: fetchImpl } : {}),
  });
  const names = filterItemsByCategory(catalog.items, known)
    .map((item) => item.name)
    .sort((left, right) => left.localeCompare(right));

  if (names.length === 0) {
    throw new CliError(`No components found in category ${known}.`);
  }

  return names;
}

export {
  formatRegistryInfo,
  formatRegistryList,
  formatRegistrySearch,
  toRegistryDiscoverySummary,
  toRegistryItemSummary,
};

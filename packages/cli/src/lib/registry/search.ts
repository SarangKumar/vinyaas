import type { RegistryCatalogItem } from "./types.ts";

type MatchKind = "exact" | "prefix" | "name" | "description";

const matchRank: Record<MatchKind, number> = {
  exact: 0,
  prefix: 1,
  name: 2,
  description: 3,
};

/**
 * Deterministic catalog search.
 * Prefer exact name, then prefix, then name contains, then description.
 */
export function searchRegistryCatalog(
  items: readonly RegistryCatalogItem[],
  query: string,
): RegistryCatalogItem[] {
  const needle = query.trim().toLowerCase();

  if (needle === "") {
    return [];
  }

  const ranked: Array<{ item: RegistryCatalogItem; rank: number }> = [];

  for (const item of items) {
    const kind = matchKind(item, needle);

    if (!kind) {
      continue;
    }

    ranked.push({ item, rank: matchRank[kind] });
  }

  ranked.sort((left, right) => {
    if (left.rank !== right.rank) {
      return left.rank - right.rank;
    }

    return left.item.name.localeCompare(right.item.name);
  });

  return ranked.map((entry) => entry.item);
}

function matchKind(
  item: RegistryCatalogItem,
  needle: string,
): MatchKind | undefined {
  const name = item.name.toLowerCase();

  if (name === needle) {
    return "exact";
  }

  if (name.startsWith(needle)) {
    return "prefix";
  }

  if (name.includes(needle)) {
    return "name";
  }

  if (item.description?.toLowerCase().includes(needle)) {
    return "description";
  }

  return undefined;
}

import { CliError } from "../cli-error.ts";
import { fetchComponentCatalogIndex, RegistryError } from "./client.ts";
import { suggestRegistryNames } from "./suggest.ts";
import type { ComponentCatalog, ComponentCatalogIndex } from "./types.ts";

export async function getComponentCatalogIndex({
  env = process.env,
  fetch: fetchImpl,
}: {
  env?: Record<string, string | undefined>;
  fetch?: typeof fetch;
} = {}): Promise<ComponentCatalogIndex> {
  return fetchComponentCatalogIndex({
    env,
    ...(fetchImpl ? { fetch: fetchImpl } : {}),
  });
}

export async function listComponentCatalogs({
  env = process.env,
  fetch: fetchImpl,
}: {
  env?: Record<string, string | undefined>;
  fetch?: typeof fetch;
} = {}): Promise<ComponentCatalog[]> {
  const index = await getComponentCatalogIndex({
    env,
    ...(fetchImpl ? { fetch: fetchImpl } : {}),
  });

  return index.items;
}

export async function getComponentCatalog({
  id,
  env = process.env,
  fetch: fetchImpl,
}: {
  id: string;
  env?: Record<string, string | undefined>;
  fetch?: typeof fetch;
}): Promise<ComponentCatalog> {
  const trimmed = id.trim().toLowerCase();

  if (trimmed === "") {
    throw new CliError("Catalog name is required.");
  }

  const index = await getComponentCatalogIndex({
    env,
    ...(fetchImpl ? { fetch: fetchImpl } : {}),
  });
  const match = index.items.find((catalog) => catalog.id === trimmed);

  if (!match) {
    throw new CliError(
      formatUnknownCatalogMessage(
        trimmed,
        index.items.map((catalog) => catalog.id),
      ),
    );
  }

  return match;
}

/** Resolves a catalog id to component names, or null when not a catalog. */
export async function resolveCatalogComponentNames({
  id,
  env = process.env,
  fetch: fetchImpl,
}: {
  id: string;
  env?: Record<string, string | undefined>;
  fetch?: typeof fetch;
}): Promise<{ catalog: ComponentCatalog; components: string[] } | null> {
  const trimmed = id.trim().toLowerCase();

  if (trimmed === "") {
    return null;
  }

  let index: ComponentCatalogIndex;

  try {
    index = await getComponentCatalogIndex({
      env,
      ...(fetchImpl ? { fetch: fetchImpl } : {}),
    });
  } catch (error) {
    // Catalog endpoint may be unavailable in older registries or unit mocks.
    if (error instanceof RegistryError) {
      return null;
    }

    throw error;
  }

  const match = index.items.find((catalog) => catalog.id === trimmed);

  if (!match) {
    return null;
  }

  return { catalog: match, components: [...match.components] };
}

export function formatUnknownCatalogMessage(
  id: string,
  catalogIds: readonly string[],
): string {
  const lines = [`Unknown catalog "${id}".`];
  const suggestions = suggestRegistryNames(id, catalogIds);

  if (suggestions.length > 0) {
    lines.push("", "Did you mean:", ...suggestions.map((name) => `  ${name}`));
  } else if (catalogIds.length > 0) {
    lines.push(
      "",
      "Available catalogs:",
      ...[...catalogIds]
        .sort((left, right) => left.localeCompare(right))
        .map((name) => `  ${name}`),
    );
  }

  return lines.join("\n");
}

export function formatCatalogList(
  catalogs: readonly ComponentCatalog[],
): string {
  if (catalogs.length === 0) {
    return "No catalogs found.";
  }

  const lines = ["Vinyaas catalogs", ""];

  for (const catalog of catalogs) {
    lines.push(`${catalog.id}`);
    lines.push(`  ${catalog.description}`);
    lines.push(`  ${catalog.components.length} components`);
    lines.push("");
  }

  while (lines.at(-1) === "") {
    lines.pop();
  }

  return lines.join("\n");
}

export function formatCatalogInfo({
  catalog,
  installed = [],
}: {
  catalog: ComponentCatalog;
  installed?: readonly string[];
}): string {
  const installedSet = new Set(installed);
  const lines = [
    `Catalog: ${catalog.id}`,
    "",
    "Name:",
    catalog.name,
    "",
    "Description:",
    catalog.description,
    "",
    `Components (${catalog.components.length}):`,
  ];

  for (const component of catalog.components) {
    const mark = installedSet.has(component) ? "installed" : "not installed";
    lines.push(`  ${component} (${mark})`);
  }

  const installedCount = catalog.components.filter((name) =>
    installedSet.has(name),
  ).length;

  lines.push(
    "",
    `Total: ${catalog.components.length}`,
    `Installed: ${installedCount}`,
  );

  return lines.join("\n");
}

export function formatCatalogInstallPrompt({
  catalog,
  components,
}: {
  catalog: ComponentCatalog;
  components: readonly string[];
}): string {
  return [
    `Vinyaas catalog: ${catalog.id}`,
    "",
    "The following components will be installed:",
    "",
    ...components,
  ].join("\n");
}

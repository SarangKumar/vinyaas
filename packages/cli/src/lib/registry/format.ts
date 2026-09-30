import type {
  RegistryCatalogItem,
  RegistryItem,
  RegistryItemFile,
  RegistryItemSummary,
} from "./types.ts";

/**
 * Stable discovery payload. Omits file contents and raw CSS/env maps.
 */
export function toRegistryItemSummary(
  item: RegistryItem | RegistryCatalogItem,
): RegistryItemSummary {
  const summary: RegistryItemSummary = {
    name: item.name,
    type: item.type,
    files: registryFilePaths(item),
    dependencies: [...item.dependencies],
    registryDependencies: [...(item.registryDependencies ?? [])],
  };

  if (item.description) {
    summary.description = item.description;
  }

  if (item.devDependencies && item.devDependencies.length > 0) {
    summary.devDependencies = [...item.devDependencies];
  }

  if (item.docs) {
    summary.docs = item.docs;
  }

  if ("cssVars" in item && item.cssVars) {
    summary.cssVars = true;
  }

  if ("css" in item && item.css && Object.keys(item.css).length > 0) {
    summary.css = true;
  }

  if (
    "envVars" in item &&
    item.envVars &&
    Object.keys(item.envVars).length > 0
  ) {
    summary.envVars = Object.keys(item.envVars).sort((left, right) =>
      left.localeCompare(right),
    );
  }

  return summary;
}

function registryFilePaths(item: RegistryItem | RegistryCatalogItem): string[] {
  if (item.files.length === 0) {
    return [];
  }

  const first = item.files[0];

  if (typeof first === "string") {
    return [...(item.files as string[])];
  }

  return (item.files as RegistryItemFile[]).map((file) => file.path);
}

export function formatRegistryList(
  items: readonly RegistryCatalogItem[],
): string {
  if (items.length === 0) {
    return "No components are available in the registry.";
  }

  const nameWidth = Math.max(...items.map((item) => item.name.length));
  const lines = ["Components", ""];

  for (const item of items) {
    const description = item.description?.trim();
    lines.push(
      description
        ? `${item.name.padEnd(nameWidth)}  ${description}`
        : item.name,
    );
  }

  return lines.join("\n");
}

export function formatRegistrySearch(
  query: string,
  items: readonly RegistryCatalogItem[],
): string {
  if (items.length === 0) {
    return `No components found for "${query}".`;
  }

  const lines = ["Results", ""];

  for (const item of items) {
    lines.push(`  ${item.name}`);

    if (item.description) {
      lines.push(`    ${item.description}`);
    }
  }

  return lines.join("\n");
}

export function formatRegistryInfo(item: RegistryItem): string {
  const title = item.name
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
  const lines: string[] = [title];

  if (item.description) {
    lines.push("", item.description);
  }

  lines.push("", "Type", `  ${item.type}`);
  lines.push("", "Files", ...item.files.map((file) => `  ${file.path}`));

  lines.push(
    "",
    "Dependencies",
    ...(item.dependencies.length > 0
      ? item.dependencies.map((dependency) => `  ${dependency}`)
      : ["  none"]),
  );

  if (item.devDependencies && item.devDependencies.length > 0) {
    lines.push(
      "",
      "Dev dependencies",
      ...item.devDependencies.map((dependency) => `  ${dependency}`),
    );
  }

  lines.push(
    "",
    "Registry dependencies",
    ...((item.registryDependencies?.length ?? 0) > 0
      ? (item.registryDependencies ?? []).map((dependency) => `  ${dependency}`)
      : ["  none"]),
  );

  if (item.docs) {
    lines.push("", "Documentation", `  ${item.docs}`);
  }

  if (item.cssVars) {
    lines.push("", "CSS variables", "  yes");
  }

  if (item.css && Object.keys(item.css).length > 0) {
    lines.push("", "CSS rules", "  yes");
  }

  if (item.envVars && Object.keys(item.envVars).length > 0) {
    lines.push(
      "",
      "Environment variables",
      ...Object.keys(item.envVars)
        .sort((left, right) => left.localeCompare(right))
        .map((name) => `  ${name}`),
    );
  }

  return lines.join("\n");
}

import { CliError } from "../cli-error.ts";
import type { RegistryItem } from "../registry/types.ts";
import type { DocsPlan, RegistryDoc } from "./types.ts";

/**
 * Collects documentation URLs from a dependency-first registry graph.
 * The resolver has already fetched each style and name once.
 * This does not fetch the URLs or rewrite them.
 */
export function createDocsPlan(items: readonly RegistryItem[]): DocsPlan {
  const seen = new Set<string>();
  const entries: RegistryDoc[] = [];

  for (const item of items) {
    if (item.docs === undefined) {
      continue;
    }

    assertDocsUrl(item.name, item.docs);

    if (seen.has(item.name)) {
      continue;
    }

    seen.add(item.name);
    entries.push({ name: item.name, url: item.docs });
  }

  return { entries };
}

export function formatDocsPlan(plan: DocsPlan): string | undefined {
  if (plan.entries.length === 0) {
    return undefined;
  }

  return [
    "Documentation:",
    "",
    ...plan.entries.map((entry) => `  ${entry.name} — ${entry.url}`),
  ].join("\n");
}

function assertDocsUrl(name: string, docs: string): void {
  let url: URL;

  try {
    url = new URL(docs);
  } catch {
    throw invalidDocs(name, docs);
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw invalidDocs(name, docs);
  }
}

function invalidDocs(name: string, docs: string): CliError {
  return new CliError(
    [
      "Invalid documentation URL:",
      `${name} — ${docs}`,
      "Documentation URLs must be absolute http or https URLs.",
    ].join("\n"),
  );
}

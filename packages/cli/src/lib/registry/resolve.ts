import { RegistryError, fetchRegistryItem } from "./client.ts";
import type { RegistryItem } from "./types.ts";

export interface ResolveRegistryResult {
  items: RegistryItem[];
  /** Requested names that were not found in the registry. */
  missing: string[];
}

/**
 * Fetches a registry item and its registryDependencies.
 * The result is dependency-first: dependencies come before the item that needs them.
 * Each style and name pair is fetched once. Cycles throw before any install work.
 *
 * When `allowMissing` is true, unknown requested names are collected instead of
 * failing the entire resolution. Nested registry dependency 404s still fail.
 */
export async function resolveRegistryItems({
  style,
  name,
  names,
  baseUrl,
  env = process.env,
  fetch: fetchImpl,
  allowMissing = false,
}: {
  style: string;
  name: string;
  names?: readonly string[];
  baseUrl?: string;
  env?: Record<string, string | undefined>;
  fetch?: typeof fetch;
  allowMissing?: boolean;
}): Promise<RegistryItem[]> {
  const result = await resolveRegistryGraph({
    style,
    name,
    names,
    baseUrl,
    env,
    ...(fetchImpl ? { fetch: fetchImpl } : {}),
    allowMissing,
  });

  if (result.missing.length > 0 && !allowMissing) {
    throw unknownComponentsError(result.missing);
  }

  return result.items;
}

export async function resolveRegistryGraph({
  style,
  name,
  names,
  baseUrl,
  env = process.env,
  fetch: fetchImpl,
  allowMissing = false,
}: {
  style: string;
  name: string;
  names?: readonly string[];
  baseUrl?: string;
  env?: Record<string, string | undefined>;
  fetch?: typeof fetch;
  allowMissing?: boolean;
}): Promise<ResolveRegistryResult> {
  const resolved = new Map<string, RegistryItem>();
  const order: string[] = [];
  const stack: string[] = [];
  const missing: string[] = [];

  async function visit(itemName: string, requested: boolean): Promise<void> {
    const key = `${style}\0${itemName}`;

    if (stack.includes(itemName)) {
      throw new RegistryError(
        `Registry dependency cycle detected:\n${[...stack, itemName].join(" -> ")}`,
      );
    }

    if (resolved.has(key)) {
      return;
    }

    stack.push(itemName);

    let item: RegistryItem;

    try {
      item = await fetchRegistryItem({
        style,
        name: itemName,
        baseUrl,
        env,
        ...(fetchImpl ? { fetch: fetchImpl } : {}),
      });
    } catch (error) {
      stack.pop();

      if (
        requested &&
        allowMissing &&
        error instanceof RegistryError &&
        error.message.includes(`/${encodeURIComponent(itemName)}.json`)
      ) {
        missing.push(itemName);
        return;
      }

      throw error;
    }

    for (const dependency of item.registryDependencies ?? []) {
      await visit(dependency, false);
    }

    stack.pop();
    resolved.set(key, item);
    order.push(itemName);
  }

  const requested = names && names.length > 0 ? names : [name];

  for (const itemName of requested) {
    try {
      await visit(itemName, true);
    } catch (error) {
      if (
        requested.length > 1 &&
        !allowMissing &&
        error instanceof RegistryError &&
        error.message.includes(`/${encodeURIComponent(itemName)}.json`)
      ) {
        missing.push(itemName);
        continue;
      }

      throw error;
    }
  }

  if (missing.length > 0 && !allowMissing) {
    throw unknownComponentsError(missing);
  }

  return {
    items: order.map((itemName) => {
      const item = resolved.get(`${style}\0${itemName}`);

      if (!item) {
        throw new RegistryError(`Registry item was not resolved:\n${itemName}`);
      }

      return item;
    }),
    missing,
  };
}

function unknownComponentsError(missing: readonly string[]): RegistryError {
  return new RegistryError(
    [
      "Unknown component(s):",
      ...missing.map((itemName) => `- ${itemName}`),
      "",
      "No files were changed.",
    ].join("\n"),
  );
}

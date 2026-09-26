import { RegistryError, fetchRegistryItem } from "./client.ts";
import type { RegistryItem } from "./types.ts";

/**
 * Fetches a registry item and its registryDependencies.
 * The result is dependency-first: dependencies come before the item that needs them.
 * Each style and name pair is fetched once. Cycles throw before any install work.
 */
export async function resolveRegistryItems({
  style,
  name,
  baseUrl,
  env = process.env,
  fetch: fetchImpl,
}: {
  style: string;
  name: string;
  baseUrl?: string;
  env?: Record<string, string | undefined>;
  fetch?: typeof fetch;
}): Promise<RegistryItem[]> {
  const resolved = new Map<string, RegistryItem>();
  const order: string[] = [];
  const stack: string[] = [];

  async function visit(itemName: string): Promise<void> {
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

    const item = await fetchRegistryItem({
      style,
      name: itemName,
      baseUrl,
      env,
      ...(fetchImpl ? { fetch: fetchImpl } : {}),
    });

    for (const dependency of item.registryDependencies ?? []) {
      await visit(dependency);
    }

    stack.pop();
    resolved.set(key, item);
    order.push(itemName);
  }

  await visit(name);

  return order.map((itemName) => {
    const item = resolved.get(`${style}\0${itemName}`);

    if (!item) {
      throw new RegistryError(`Registry item was not resolved:\n${itemName}`);
    }

    return item;
  });
}

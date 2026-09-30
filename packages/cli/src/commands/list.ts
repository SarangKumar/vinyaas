import { Command } from "commander";

import { CliError } from "../lib/cli-error.ts";
import { filterItemsByCategory } from "../lib/registry/categories.ts";
import {
  formatRegistryList,
  getRegistryCatalog,
  listRegistrySummaries,
} from "../lib/registry/discover.ts";
import { RegistryError } from "../lib/registry/client.ts";

export function registerListCommand(program: Command): void {
  program
    .command("list")
    .description("List installable components from the Vinyaas registry.")
    .option("--json", "Print machine-readable JSON to stdout.")
    .option("--category <category>", "Filter components by registry category.")
    .addHelpText(
      "after",
      [
        "",
        "Examples:",
        "  $ vinyaas list",
        "  $ vinyaas list --category forms",
        "  $ vinyaas list --json",
        "  $ vinyaas list --json --category forms",
      ].join("\n"),
    )
    .action(async (options: { json?: boolean; category?: string }) => {
      try {
        await executeList({
          json: options.json === true,
          ...(options.category ? { category: options.category } : {}),
          env: process.env,
        });
      } catch (error) {
        if (error instanceof CliError || error instanceof RegistryError) {
          console.error(error.message);
          process.exit(1);
        }

        throw error;
      }
    });
}

export async function executeList({
  json = false,
  category,
  env = process.env,
  fetch: fetchImpl,
}: {
  json?: boolean;
  category?: string;
  env?: Record<string, string | undefined>;
  fetch?: typeof fetch;
}): Promise<void> {
  const catalog = await getRegistryCatalog({
    env,
    ...(fetchImpl ? { fetch: fetchImpl } : {}),
  });
  const items = category
    ? filterItemsByCategory(catalog.items, category)
    : catalog.items;

  if (json) {
    console.log(
      JSON.stringify(
        listRegistrySummaries({ ...catalog, items }, { category }),
        null,
        2,
      ),
    );
    return;
  }

  console.log(formatRegistryList(items, category ? { category } : {}));
}

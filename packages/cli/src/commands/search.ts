import { Command } from "commander";

import { CliError } from "../lib/cli-error.ts";
import { RegistryError } from "../lib/registry/client.ts";
import {
  formatRegistrySearch,
  searchRegistry,
  toRegistryDiscoverySummary,
} from "../lib/registry/discover.ts";

export function registerSearchCommand(program: Command): void {
  program
    .command("search")
    .description("Search registry components by name or description.")
    .argument("<query>", "Search query")
    .option("--json", "Print machine-readable JSON to stdout.")
    .option("--category <category>", "Limit search to a registry category.")
    .addHelpText(
      "after",
      [
        "",
        "Examples:",
        "  $ vinyaas search input",
        "  $ vinyaas search input --category forms",
        "  $ vinyaas search form --json",
      ].join("\n"),
    )
    .action(
      async (query: string, options: { json?: boolean; category?: string }) => {
        try {
          await executeSearch({
            query,
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
      },
    );
}

export async function executeSearch({
  query,
  json = false,
  category,
  env = process.env,
  fetch: fetchImpl,
}: {
  query: string;
  json?: boolean;
  category?: string;
  env?: Record<string, string | undefined>;
  fetch?: typeof fetch;
}): Promise<void> {
  const trimmed = query.trim();

  if (trimmed === "") {
    throw new CliError("Search query is required.");
  }

  const results = await searchRegistry({
    query: trimmed,
    ...(category ? { category } : {}),
    env,
    ...(fetchImpl ? { fetch: fetchImpl } : {}),
  });

  if (json) {
    console.log(
      JSON.stringify(
        results.map((item) => toRegistryDiscoverySummary(item)),
        null,
        2,
      ),
    );
    return;
  }

  console.log(formatRegistrySearch(trimmed, results));
}

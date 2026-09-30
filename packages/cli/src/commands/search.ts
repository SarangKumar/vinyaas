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
    .addHelpText(
      "after",
      [
        "",
        "Examples:",
        "  $ vinyaas search input",
        "  $ vinyaas search form --json",
      ].join("\n"),
    )
    .action(async (query: string, options: { json?: boolean }) => {
      try {
        await executeSearch({
          query,
          json: options.json === true,
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

export async function executeSearch({
  query,
  json = false,
  env = process.env,
  fetch: fetchImpl,
}: {
  query: string;
  json?: boolean;
  env?: Record<string, string | undefined>;
  fetch?: typeof fetch;
}): Promise<void> {
  const trimmed = query.trim();

  if (trimmed === "") {
    throw new CliError("Search query is required.");
  }

  const results = await searchRegistry({
    query: trimmed,
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

import { Command } from "commander";

import { CliError } from "../lib/cli-error.ts";
import {
  formatRegistryList,
  getRegistryCatalog,
  listRegistrySummaries,
} from "../lib/registry/discover.ts";
import { RegistryError } from "../lib/registry/client.ts";

export function registerListCommand(program: Command): void {
  program
    .command("list")
    .description("List available components from the Vinyaas registry.")
    .option("--json", "Print machine-readable JSON.")
    .addHelpText("after", "\nExample:\n  $ vinyaas list")
    .action(async (options: { json?: boolean }) => {
      try {
        await executeList({
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

export async function executeList({
  json = false,
  env = process.env,
  fetch: fetchImpl,
}: {
  json?: boolean;
  env?: Record<string, string | undefined>;
  fetch?: typeof fetch;
}): Promise<void> {
  const catalog = await getRegistryCatalog({
    env,
    ...(fetchImpl ? { fetch: fetchImpl } : {}),
  });

  if (json) {
    console.log(JSON.stringify(listRegistrySummaries(catalog), null, 2));
    return;
  }

  console.log(formatRegistryList(catalog.items));
}

import { Command } from "commander";

import { CliError } from "../lib/cli-error.ts";
import { RegistryError } from "../lib/registry/client.ts";
import {
  formatRegistryInfo,
  getRegistryItem,
  toRegistryItemSummary,
} from "../lib/registry/discover.ts";

export function registerInfoCommand(program: Command): void {
  program
    .command("info")
    .description("Show details for a registry component before installing it.")
    .argument("<component>", "Component name")
    .option("--json", "Print machine-readable JSON.")
    .addHelpText("after", "\nExample:\n  $ vinyaas info button")
    .action(async (component: string, options: { json?: boolean }) => {
      try {
        await executeInfo({
          name: component,
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

export async function executeInfo({
  name,
  json = false,
  env = process.env,
  fetch: fetchImpl,
}: {
  name: string;
  json?: boolean;
  env?: Record<string, string | undefined>;
  fetch?: typeof fetch;
}): Promise<void> {
  const item = await getRegistryItem({
    name,
    env,
    ...(fetchImpl ? { fetch: fetchImpl } : {}),
  });

  if (json) {
    console.log(JSON.stringify(toRegistryItemSummary(item), null, 2));
    return;
  }

  console.log(formatRegistryInfo(item));
}

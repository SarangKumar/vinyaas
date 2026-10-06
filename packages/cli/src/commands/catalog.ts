import { Command } from "commander";

import { CliError } from "../lib/cli-error.ts";
import { listManifestComponents, readManifest } from "../lib/manifest/store.ts";
import { resolveProjectRoot } from "../lib/project/cwd.ts";
import {
  formatCatalogInfo,
  formatCatalogList,
  getComponentCatalog,
  listComponentCatalogs,
} from "../lib/registry/catalogs.ts";
import { RegistryError } from "../lib/registry/client.ts";

export function registerCatalogCommand(program: Command): void {
  const catalog = program
    .command("catalog")
    .description(
      "List and inspect named component catalogs from the registry.",
    );

  catalog
    .command("list")
    .description("List available component catalogs.")
    .option("--json", "Print machine-readable JSON to stdout.")
    .addHelpText(
      "after",
      [
        "",
        "Examples:",
        "  $ vinyaas catalog list",
        "  $ vinyaas catalog list --json",
      ].join("\n"),
    )
    .action(async (options: { json?: boolean }) => {
      try {
        await executeCatalogList({
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

  catalog
    .command("info")
    .description("Show details for one component catalog.")
    .argument("<catalog>", "Catalog id (for example form or dashboard)")
    .option("--cwd <path>", "Consumer project directory.")
    .option("--json", "Print machine-readable JSON to stdout.")
    .addHelpText(
      "after",
      [
        "",
        "Examples:",
        "  $ vinyaas catalog info form",
        "  $ vinyaas catalog info dashboard --json",
      ].join("\n"),
    )
    .action(
      async (catalogId: string, options: { cwd?: string; json?: boolean }) => {
        try {
          await executeCatalogInfo({
            id: catalogId,
            cwd: options.cwd,
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
      },
    );
}

export async function executeCatalogList({
  json = false,
  env = process.env,
  fetch: fetchImpl,
}: {
  json?: boolean;
  env?: Record<string, string | undefined>;
  fetch?: typeof fetch;
} = {}): Promise<void> {
  const catalogs = await listComponentCatalogs({
    env,
    ...(fetchImpl ? { fetch: fetchImpl } : {}),
  });

  if (json) {
    console.log(JSON.stringify({ type: "catalogs", items: catalogs }, null, 2));
    return;
  }

  console.log(formatCatalogList(catalogs));
}

export async function executeCatalogInfo({
  id,
  cwd,
  from = process.cwd(),
  json = false,
  env = process.env,
  fetch: fetchImpl,
}: {
  id: string;
  cwd?: string;
  from?: string;
  json?: boolean;
  env?: Record<string, string | undefined>;
  fetch?: typeof fetch;
}): Promise<void> {
  const catalog = await getComponentCatalog({
    id,
    env,
    ...(fetchImpl ? { fetch: fetchImpl } : {}),
  });

  let installed: string[] = [];

  try {
    const projectRoot = await resolveProjectRoot(cwd, from);
    const manifest = await readManifest(projectRoot);
    installed = listManifestComponents(manifest);
  } catch {
    installed = [];
  }

  if (json) {
    const installedSet = new Set(installed);
    console.log(
      JSON.stringify(
        {
          ...catalog,
          total: catalog.components.length,
          installed: catalog.components.filter((name) =>
            installedSet.has(name),
          ),
        },
        null,
        2,
      ),
    );
    return;
  }

  console.log(
    formatCatalogInfo({
      catalog,
      installed,
    }),
  );
}

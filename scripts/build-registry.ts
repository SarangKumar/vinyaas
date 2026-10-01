import fs from "node:fs/promises";
import path from "node:path";

import prettier from "prettier";

import { withDefaultDocs } from "../apps/docs/registry/docs";
import { themes } from "../apps/docs/registry/registry";
import {
  readRegistryItemFiles,
  serializeRegistryCatalog,
  serializeRegistryItem,
} from "../apps/docs/registry/serialize";
import type {
  RegistryCatalog,
  RegistryItemPayload,
} from "../apps/docs/registry/types";
import {
  validateRegistry,
  formatRegistryValidationFailure,
} from "../apps/docs/registry/validate";
import { config } from "./config";

const root = process.cwd();
const registryRoot = path.join(root, "apps/docs/registry");
const outputRoot = path.join(root, "apps/docs/public/r");

async function buildRegistry() {
  await fs.rm(outputRoot, { recursive: true, force: true });

  const schemaUrl = config.registryItemSchemaUrl;
  await publishRegistrySchemas();

  for (const [themeName, items] of Object.entries(themes)) {
    const issues = validateRegistry(items);

    if (issues.length > 0) {
      throw new Error(formatRegistryValidationFailure(issues));
    }

    const themeRoot = path.join(registryRoot, themeName);
    const themeOutputRoot = path.join(outputRoot, themeName);
    const itemsWithDocs = items.map((item) =>
      withDefaultDocs(item, config.registryBaseUrl),
    );

    const docsIssues = validateRegistry(itemsWithDocs).filter(
      (issue) => issue.field === "docs",
    );

    if (docsIssues.length > 0) {
      throw new Error(formatRegistryValidationFailure(docsIssues));
    }

    await fs.mkdir(themeOutputRoot, { recursive: true });

    for (const item of itemsWithDocs) {
      // Only files declared on the item are installed. Imports such as
      // `@/lib/utils` stay in the source; they are not turned into dependencies.
      const files = await readRegistryItemFiles(item, (relativePath) =>
        fs.readFile(resolveThemeFile(themeRoot, relativePath), "utf8"),
      );

      const output = serializeRegistryItem(item, files, schemaUrl);
      const outputPath = path.join(themeOutputRoot, `${item.name}.json`);
      const formatted = await formatRegistryJson(outputPath, output);

      await fs.writeFile(outputPath, formatted, "utf8");

      console.log(`Generated ${themeName}/${item.name}`);
    }

    const catalog = serializeRegistryCatalog(themeName, itemsWithDocs);
    const catalogPath = path.join(themeOutputRoot, "index.json");
    const catalogJson = await formatCatalogJson(catalogPath, catalog);

    await fs.writeFile(catalogPath, catalogJson, "utf8");
    console.log(`Generated ${themeName}/index`);
  }

  console.log("Registry build complete");
}

/** Publish JSON schemas under `/r/schema` so $schema URLs resolve. */
async function publishRegistrySchemas(): Promise<void> {
  const schemaSourceRoot = path.join(root, "apps/docs/public/schema");
  const schemaOutputRoot = path.join(outputRoot, "schema");
  const schemaFiles = ["registry-item.json", "components.json"] as const;

  await fs.mkdir(schemaOutputRoot, { recursive: true });

  for (const name of schemaFiles) {
    await fs.copyFile(
      path.join(schemaSourceRoot, name),
      path.join(schemaOutputRoot, name),
    );
  }

  console.log("Generated schema/");
}

function resolveThemeFile(themeRoot: string, relativePath: string): string {
  const normalized = relativePath.replaceAll("\\", "/");

  if (
    normalized.length === 0 ||
    normalized.startsWith("/") ||
    normalized.split("/").includes("..")
  ) {
    throw new Error(
      `Registry file path must stay within the theme directory: ${relativePath}`,
    );
  }

  return path.join(themeRoot, normalized);
}

async function formatRegistryJson(
  outputPath: string,
  output: RegistryItemPayload,
): Promise<string> {
  const prettierConfig = await prettier.resolveConfig(outputPath);

  return prettier.format(JSON.stringify(output), {
    ...prettierConfig,
    filepath: outputPath,
    parser: "json",
  });
}

async function formatCatalogJson(
  outputPath: string,
  output: RegistryCatalog,
): Promise<string> {
  const prettierConfig = await prettier.resolveConfig(outputPath);

  return prettier.format(JSON.stringify(output), {
    ...prettierConfig,
    filepath: outputPath,
    parser: "json",
  });
}

buildRegistry().catch((error) => {
  console.error(error);
  process.exit(1);
});

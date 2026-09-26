import fs from "node:fs/promises";
import path from "node:path";

import prettier from "prettier";

import { themes } from "../apps/docs/registry/registry";
import {
  readRegistryItemFiles,
  serializeRegistryItem,
} from "../apps/docs/registry/serialize";
import type { RegistryItemPayload } from "../apps/docs/registry/types";
import { config } from "./config";

const root = process.cwd();
const registryRoot = path.join(root, "apps/docs/registry");
const outputRoot = path.join(root, "apps/docs/public/r");

async function buildRegistry() {
  await fs.rm(outputRoot, { recursive: true, force: true });

  const schemaUrl = `${config.registryBaseUrl}/schema/registry-item.json`;

  for (const [themeName, items] of Object.entries(themes)) {
    const themeRoot = path.join(registryRoot, themeName);
    const themeOutputRoot = path.join(outputRoot, themeName);

    await fs.mkdir(themeOutputRoot, { recursive: true });

    for (const item of items) {
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
  }

  console.log("Registry build complete");
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

buildRegistry().catch((error) => {
  console.error(error);
  process.exit(1);
});

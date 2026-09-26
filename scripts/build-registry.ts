import fs from "node:fs/promises";
import path from "node:path";

import { config } from "./config";
import { themes } from "../apps/docs/registry/registry";
import { resolveDependencies } from "./resolve-dependencies";

const root = process.cwd();
const registryRoot = path.join(root, "apps/docs/registry");
const outputRoot = path.join(root, "apps/docs/public/r");

async function buildRegistry() {
  await fs.rm(outputRoot, { recursive: true, force: true });

  for (const [themeName, items] of Object.entries(themes)) {
    const themeRoot = path.join(registryRoot, themeName);
    const themeOutputRoot = path.join(outputRoot, themeName);

    await fs.mkdir(themeOutputRoot, { recursive: true });

    for (const item of items) {
      const resolvedFiles = new Set<string>();

      for (const entryFile of item.files) {
        const dependencies = await resolveDependencies({
          registryRoot: themeRoot,
          entryFile,
        });

        for (const file of dependencies) {
          resolvedFiles.add(file);
        }
      }

      const files = await Promise.all(
        [...resolvedFiles].map(async (file) => {
          const filePath = path.join(themeRoot, file);
          const content = await fs.readFile(filePath, "utf8");

          return {
            path: file,
            content,
          };
        }),
      );

      const output = {
        $schema: `${config.registryBaseUrl}/schema/registry-item.json`,
        name: item.name,
        type: item.type,
        dependencies: item.dependencies ?? [],
        files,
      };

      const outputPath = path.join(themeOutputRoot, `${item.name}.json`);

      await fs.writeFile(
        outputPath,
        `${JSON.stringify(output, null, 2)}\n`,
        "utf8",
      );

      console.log(`Generated ${themeName}/${item.name}`);
    }
  }

  console.log("Registry build complete");
}

buildRegistry().catch((error) => {
  console.error(error);
  process.exit(1);
});

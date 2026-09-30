import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

import { CliError } from "../cli-error.ts";
import { parseJsonConfig } from "../parse-jsonc.ts";

/**
 * Ensures `compilerOptions.paths["@/*"]` exists for Vinyaas aliases.
 * Preserves unrelated paths and config. Creates tsconfig/jsconfig when missing.
 */
export async function ensureProjectAlias({
  cwd,
  tsx,
  aliasTarget,
}: {
  cwd: string;
  tsx: boolean;
  aliasTarget: "./*" | "./src/*";
}): Promise<"created" | "updated" | "exists"> {
  const configName = tsx ? "tsconfig.json" : "jsconfig.json";
  const configPath = join(cwd, configName);

  let source: string | null = null;

  try {
    source = await readFile(configPath, "utf8");
  } catch (error) {
    if (!isNotFound(error)) {
      throw error;
    }
  }

  if (source === null) {
    const created = {
      compilerOptions: {
        ...(tsx
          ? {
              target: "ES2022",
              module: "ESNext",
              moduleResolution: "bundler",
              jsx: "react-jsx",
              strict: true,
              skipLibCheck: true,
            }
          : {
              jsx: "react-jsx",
            }),
        baseUrl: ".",
        paths: {
          "@/*": [aliasTarget],
        },
      },
    };

    await writeFile(configPath, `${JSON.stringify(created, null, 2)}\n`);
    return "created";
  }

  let parsed: Record<string, unknown>;

  try {
    const value = parseJsonConfig(source);
    if (typeof value !== "object" || value === null || Array.isArray(value)) {
      throw new Error("invalid");
    }
    parsed = value as Record<string, unknown>;
  } catch {
    throw new CliError(
      [
        `Could not read ${configName}.`,
        "Fix the JSON (comments are allowed) and run `vinyaas init` again.",
      ].join("\n"),
    );
  }

  const compilerOptions =
    typeof parsed.compilerOptions === "object" &&
    parsed.compilerOptions !== null &&
    !Array.isArray(parsed.compilerOptions)
      ? { ...(parsed.compilerOptions as Record<string, unknown>) }
      : {};

  const paths =
    typeof compilerOptions.paths === "object" &&
    compilerOptions.paths !== null &&
    !Array.isArray(compilerOptions.paths)
      ? { ...(compilerOptions.paths as Record<string, unknown>) }
      : {};

  const existing = paths["@/*"];

  if (
    Array.isArray(existing) &&
    typeof existing[0] === "string" &&
    existing[0].includes("*")
  ) {
    return "exists";
  }

  paths["@/*"] = [aliasTarget];
  compilerOptions.baseUrl =
    typeof compilerOptions.baseUrl === "string" ? compilerOptions.baseUrl : ".";
  compilerOptions.paths = paths;
  parsed.compilerOptions = compilerOptions;

  await writeFile(configPath, `${JSON.stringify(parsed, null, 2)}\n`);
  return "updated";
}

function isNotFound(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "ENOENT"
  );
}

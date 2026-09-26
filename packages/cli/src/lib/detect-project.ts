import { readFile, stat } from "node:fs/promises";
import { join } from "node:path";

import { CliError } from "./cli-error.js";
import { parseJsonConfig } from "./parse-jsonc.js";

const cssCandidates = ["app/globals.css", "src/app/globals.css"] as const;

const tailwindPackages = ["tailwindcss", "@tailwindcss/postcss"] as const;

export interface DetectedProject {
  tsx: boolean;
  css: (typeof cssCandidates)[number];
  aliases: {
    components: string;
    ui: string;
    utils: string;
  };
}

export async function detectProject(cwd: string): Promise<DetectedProject> {
  const packageJson = await readPackageJson(cwd);

  if (!hasDependency(packageJson, "next")) {
    throw new CliError(
      [
        "Vinyaas currently supports Next.js projects.",
        "No Next.js dependency was found in this project.",
      ].join("\n"),
    );
  }

  if (
    !hasDependency(packageJson, "react") ||
    !hasDependency(packageJson, "react-dom")
  ) {
    throw new CliError(
      [
        "Vinyaas currently supports Next.js projects.",
        "react and react-dom dependencies were not found in this project.",
      ].join("\n"),
    );
  }

  if (!tailwindPackages.some((name) => hasDependency(packageJson, name))) {
    throw new CliError(
      [
        "Vinyaas requires Tailwind CSS.",
        "No Tailwind dependency was found in this project.",
      ].join("\n"),
    );
  }

  const tsx = await fileExists(join(cwd, "tsconfig.json"));
  const css = await detectGlobalCss(cwd);
  const aliases = await detectAliases(cwd);

  return { tsx, css, aliases };
}

async function detectGlobalCss(
  cwd: string,
): Promise<(typeof cssCandidates)[number]> {
  for (const candidate of cssCandidates) {
    if (await fileExists(join(cwd, candidate))) {
      return candidate;
    }
  }

  throw new CliError(
    [
      "Could not find a supported global CSS file.",
      "Expected one of:",
      ...cssCandidates.map((candidate) => `- ${candidate}`),
    ].join("\n"),
  );
}

async function detectAliases(cwd: string): Promise<DetectedProject["aliases"]> {
  const configPath = (await fileExists(join(cwd, "tsconfig.json")))
    ? join(cwd, "tsconfig.json")
    : join(cwd, "jsconfig.json");

  if (!(await fileExists(configPath))) {
    throw aliasError();
  }

  const source = await readFile(configPath, "utf8");
  const config = parseJsonConfig(source);

  if (!hasSupportedAlias(config)) {
    throw aliasError();
  }

  return {
    components: "@/components",
    ui: "@/components/ui",
    utils: "@/lib/utils",
  };
}

function hasSupportedAlias(config: unknown): boolean {
  if (typeof config !== "object" || config === null) {
    return false;
  }

  const compilerOptions = (config as { compilerOptions?: unknown })
    .compilerOptions;

  if (typeof compilerOptions !== "object" || compilerOptions === null) {
    return false;
  }

  const paths = (compilerOptions as { paths?: unknown }).paths;

  if (typeof paths !== "object" || paths === null) {
    return false;
  }

  const mapping = (paths as Record<string, unknown>)["@/*"];

  if (!Array.isArray(mapping) || typeof mapping[0] !== "string") {
    return false;
  }

  return mapping[0].includes("*");
}

function aliasError(): CliError {
  return new CliError(
    [
      "Could not find a supported import alias.",
      'Expected compilerOptions.paths in tsconfig.json or jsconfig.json to include "@/*".',
    ].join("\n"),
  );
}

interface PackageManifest {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
}

async function readPackageJson(cwd: string): Promise<PackageManifest> {
  const packageJsonPath = join(cwd, "package.json");

  if (!(await fileExists(packageJsonPath))) {
    throw new CliError(
      [
        "Vinyaas currently supports Next.js projects.",
        "No package.json was found in this project.",
      ].join("\n"),
    );
  }

  const source = await readFile(packageJsonPath, "utf8");

  try {
    const parsed = JSON.parse(source) as unknown;

    if (typeof parsed !== "object" || parsed === null) {
      throw new Error("package.json must be an object");
    }

    return parsed as PackageManifest;
  } catch {
    throw new CliError("Could not read package.json.");
  }
}

function hasDependency(manifest: PackageManifest, name: string): boolean {
  return Boolean(
    manifest.dependencies?.[name] ||
    manifest.devDependencies?.[name] ||
    manifest.peerDependencies?.[name],
  );
}

async function fileExists(path: string): Promise<boolean> {
  try {
    const file = await stat(path);
    return file.isFile();
  } catch (error) {
    if (isNotFound(error)) {
      return false;
    }

    throw error;
  }
}

function isNotFound(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "ENOENT"
  );
}

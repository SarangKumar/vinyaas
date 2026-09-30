import { readdir, readFile, stat } from "node:fs/promises";
import { join } from "node:path";

import { CliError } from "./cli-error.ts";
import { parseJsonConfig } from "./parse-jsonc.ts";

export const cssCandidates = [
  "app/globals.css",
  "src/app/globals.css",
  "src/index.css",
  "index.css",
] as const;

export type CssCandidate = (typeof cssCandidates)[number];

export type ProjectFramework = "next" | "vite" | "react";

export type TailwindStatus =
  | { kind: "ready"; version: string }
  | { kind: "missing" }
  | { kind: "unsupported"; version: string };

export interface DetectedProject {
  framework: ProjectFramework;
  tsx: boolean;
  /** Existing global CSS relative path, if any. */
  css: CssCandidate | null;
  /** Preferred CSS path to create when none exists. */
  preferredCss: CssCandidate;
  /** Whether the project uses a `src/` app layout. */
  srcLayout: boolean;
  aliases: {
    components: string;
    ui: string;
    utils: string;
  };
  /** True when tsconfig/jsconfig already has a usable `@/*` mapping. */
  hasAlias: boolean;
  /** Where `@/*` should resolve on disk when configuring aliases. */
  aliasTarget: "./*" | "./src/*";
  tailwind: TailwindStatus;
  packageJson: PackageManifest;
}

export async function detectProject(cwd: string): Promise<DetectedProject> {
  const packageJson = await readPackageJson(cwd);

  if (
    !hasDependency(packageJson, "react") ||
    !hasDependency(packageJson, "react-dom")
  ) {
    throw new CliError(
      [
        "Vinyaas supports React projects.",
        "react and react-dom were not found in this project.",
      ].join("\n"),
    );
  }

  const framework = detectFramework(packageJson);
  const tsx = await fileExists(join(cwd, "tsconfig.json"));
  const srcLayout = await detectSrcLayout(cwd, framework);
  const css = await detectExistingCss(cwd);
  const preferredCss = preferredCssPath(framework, srcLayout);
  const aliasInfo = await detectAliasInfo(cwd, srcLayout);
  const tailwind = detectTailwind(packageJson);

  return {
    framework,
    tsx,
    css,
    preferredCss,
    srcLayout,
    aliases: {
      components: "@/components",
      ui: "@/components/ui",
      utils: "@/lib/utils",
    },
    hasAlias: aliasInfo.hasAlias,
    aliasTarget: aliasInfo.aliasTarget,
    tailwind,
    packageJson,
  };
}

function detectFramework(packageJson: PackageManifest): ProjectFramework {
  if (hasDependency(packageJson, "next")) {
    return "next";
  }

  if (hasDependency(packageJson, "vite")) {
    return "vite";
  }

  return "react";
}

function preferredCssPath(
  framework: ProjectFramework,
  srcLayout: boolean,
): CssCandidate {
  if (framework === "next") {
    return srcLayout ? "src/app/globals.css" : "app/globals.css";
  }

  if (framework === "vite") {
    return srcLayout ? "src/index.css" : "index.css";
  }

  return srcLayout ? "src/index.css" : "app/globals.css";
}

async function detectSrcLayout(
  cwd: string,
  framework: ProjectFramework,
): Promise<boolean> {
  if (framework === "next") {
    if (await fileExists(join(cwd, "src/app/layout.tsx"))) return true;
    if (await fileExists(join(cwd, "src/app/layout.js"))) return true;
    if (await directoryExists(join(cwd, "src/app"))) return true;
    return false;
  }

  if (await directoryExists(join(cwd, "src"))) {
    return true;
  }

  return false;
}

async function detectExistingCss(cwd: string): Promise<CssCandidate | null> {
  for (const candidate of cssCandidates) {
    if (await fileExists(join(cwd, candidate))) {
      return candidate;
    }
  }

  return null;
}

async function detectAliasInfo(
  cwd: string,
  srcLayout: boolean,
): Promise<{ hasAlias: boolean; aliasTarget: "./*" | "./src/*" }> {
  const configPath = (await fileExists(join(cwd, "tsconfig.json")))
    ? join(cwd, "tsconfig.json")
    : join(cwd, "jsconfig.json");

  const fallbackTarget: "./*" | "./src/*" = srcLayout ? "./src/*" : "./*";

  if (!(await fileExists(configPath))) {
    return { hasAlias: false, aliasTarget: fallbackTarget };
  }

  const source = await readFile(configPath, "utf8");
  let config: unknown;

  try {
    config = parseJsonConfig(source);
  } catch {
    return { hasAlias: false, aliasTarget: fallbackTarget };
  }

  const mapping = readAliasMapping(config);

  if (!mapping) {
    return { hasAlias: false, aliasTarget: fallbackTarget };
  }

  const aliasTarget = mapping.includes("src")
    ? ("./src/*" as const)
    : ("./*" as const);

  return { hasAlias: true, aliasTarget };
}

function readAliasMapping(config: unknown): string | null {
  if (typeof config !== "object" || config === null) {
    return null;
  }

  const compilerOptions = (config as { compilerOptions?: unknown })
    .compilerOptions;

  if (typeof compilerOptions !== "object" || compilerOptions === null) {
    return null;
  }

  const paths = (compilerOptions as { paths?: unknown }).paths;

  if (typeof paths !== "object" || paths === null) {
    return null;
  }

  const mapping = (paths as Record<string, unknown>)["@/*"];

  if (!Array.isArray(mapping) || typeof mapping[0] !== "string") {
    return null;
  }

  return mapping[0].includes("*") ? mapping[0] : null;
}

export function detectTailwind(packageJson: PackageManifest): TailwindStatus {
  const declared =
    readDependencyVersion(packageJson, "tailwindcss") ??
    readDependencyVersion(packageJson, "@tailwindcss/postcss") ??
    readDependencyVersion(packageJson, "@tailwindcss/vite");

  if (!declared) {
    return { kind: "missing" };
  }

  const major = majorVersion(declared);

  if (major === null) {
    return { kind: "ready", version: declared };
  }

  if (major >= 4) {
    return { kind: "ready", version: declared };
  }

  return { kind: "unsupported", version: declared };
}

function majorVersion(range: string): number | null {
  const match = range.match(/(\d+)/);
  return match ? Number(match[1]) : null;
}

function readDependencyVersion(
  manifest: PackageManifest,
  name: string,
): string | undefined {
  return (
    manifest.dependencies?.[name] ??
    manifest.devDependencies?.[name] ??
    manifest.peerDependencies?.[name]
  );
}

export interface PackageManifest {
  name?: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
}

async function readPackageJson(cwd: string): Promise<PackageManifest> {
  const packageJsonPath = join(cwd, "package.json");

  if (!(await fileExists(packageJsonPath))) {
    throw new CliError(
      ["No package.json was found in this project."].join("\n"),
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

export function hasDependency(
  manifest: PackageManifest,
  name: string,
): boolean {
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

async function directoryExists(path: string): Promise<boolean> {
  try {
    const file = await stat(path);
    return file.isDirectory();
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

/** Used by tests and diagnostics. */
export async function listTopLevelNames(cwd: string): Promise<string[]> {
  try {
    return await readdir(cwd);
  } catch {
    return [];
  }
}

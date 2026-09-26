import { readFile } from "node:fs/promises";
import path from "node:path";

import { CliError } from "../cli-error.ts";

export const declaredSections = [
  "dependencies",
  "optionalDependencies",
  "devDependencies",
  "peerDependencies",
] as const;

export type DeclaredSection = (typeof declaredSections)[number];

export interface DeclaredDependencies {
  dependencies: ReadonlySet<string>;
  devDependencies: ReadonlySet<string>;
  peerDependencies: ReadonlySet<string>;
  optionalDependencies: ReadonlySet<string>;
}

export interface ClassifiedPackage {
  name: string;
  requested: "dependency" | "devDependency";
  declared: DeclaredSection;
}

export interface DependencyInstallPlan {
  installDependencies: string[];
  installDevDependencies: string[];
  present: ClassifiedPackage[];
}

const emptyDeclared = (): DeclaredDependencies => ({
  dependencies: new Set(),
  devDependencies: new Set(),
  peerDependencies: new Set(),
  optionalDependencies: new Set(),
});

/**
 * Reads dependency names from the consumer package.json.
 * A missing file means nothing is declared. Invalid JSON fails.
 * Versions are ignored.
 */
export async function readDeclaredDependencies(
  cwd: string,
): Promise<DeclaredDependencies> {
  const filePath = path.join(cwd, "package.json");
  let source: string;

  try {
    source = await readFile(filePath, "utf8");
  } catch (error) {
    if (isNotFound(error)) {
      return emptyDeclared();
    }

    throw error;
  }

  let parsed: unknown;

  try {
    parsed = JSON.parse(source) as unknown;
  } catch {
    throw new CliError("Could not read package.json.");
  }

  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    throw new CliError("Could not read package.json.");
  }

  const manifest = parsed as Record<string, unknown>;

  return {
    dependencies: dependencyNames(manifest.dependencies),
    devDependencies: dependencyNames(manifest.devDependencies),
    peerDependencies: dependencyNames(manifest.peerDependencies),
    optionalDependencies: dependencyNames(manifest.optionalDependencies),
  };
}

/**
 * Splits a registry dependency plan into packages to install and packages
 * the consumer already declares. Does not compare versions.
 */
export function classifyDependencies(
  packages: {
    dependencies: readonly string[];
    devDependencies: readonly string[];
  },
  declared: DeclaredDependencies,
): DependencyInstallPlan {
  const installDependencies: string[] = [];
  const installDevDependencies: string[] = [];
  const present: ClassifiedPackage[] = [];

  for (const name of packages.dependencies) {
    const section = declaredSection(declared, name);

    if (section === undefined) {
      installDependencies.push(name);
      continue;
    }

    present.push({ name, requested: "dependency", declared: section });
  }

  for (const name of packages.devDependencies) {
    const section = declaredSection(declared, name);

    if (section === undefined) {
      installDevDependencies.push(name);
      continue;
    }

    present.push({ name, requested: "devDependency", declared: section });
  }

  return { installDependencies, installDevDependencies, present };
}

export function formatDeclaredDependencies(
  present: readonly ClassifiedPackage[],
): string | undefined {
  if (present.length === 0) {
    return undefined;
  }

  return ["Dependencies:", "", ...present.map(presentLine)].join("\n");
}

function presentLine(pkg: ClassifiedPackage): string {
  switch (pkg.declared) {
    case "devDependencies":
      return `  ${pkg.name} already configured as a devDependency.`;
    case "peerDependencies":
      return `  ${pkg.name} already configured as a peerDependency.`;
    case "optionalDependencies":
      return `  ${pkg.name} already configured as an optionalDependency.`;
    default:
      return `  ${pkg.name} already configured.`;
  }
}

function declaredSection(
  declared: DeclaredDependencies,
  name: string,
): DeclaredSection | undefined {
  for (const section of declaredSections) {
    if (declared[section].has(name)) {
      return section;
    }
  }

  return undefined;
}

function dependencyNames(value: unknown): Set<string> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return new Set();
  }

  return new Set(Object.keys(value));
}

function isNotFound(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "ENOENT"
  );
}

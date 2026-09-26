import { mkdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";

import type { ComponentsConfig } from "../../../../config/components.ts";

import { CliError } from "./cli-error.ts";
import { isInsideProject, resolveAliasDirectory } from "./resolve-alias.ts";
import type { RegistryItem } from "./registry/types.ts";

const supportedNamespaces = ["ui", "components"] as const;

type RegistryNamespace = (typeof supportedNamespaces)[number];

/** One registry file, interpreted but not yet written. */
export interface InstallPlanEntry {
  registryPath: string;
  /** Project-relative path using `/` separators. */
  destinationPath: string;
  content: string;
  /** True when `--force` is replacing an existing component file. */
  overwrite: boolean;
}

export interface InstallPlan {
  name: string;
  entries: InstallPlanEntry[];
  /** Runtime npm packages from every resolved item, each listed once. */
  dependencies: string[];
  /** Development npm packages from every resolved item, each listed once. */
  devDependencies: string[];
  /** Registry item names in dependency-first order, including the requested item. */
  items: string[];
}

export interface PackageDependencyPlan {
  dependencies: string[];
  devDependencies: string[];
}

/**
 * Turns resolved registry items into destination paths.
 * Does not read or write the consumer project except to resolve aliases.
 * Items must already be in dependency-first order.
 */
export async function createInstallPlan({
  cwd,
  config,
  name,
  items,
}: {
  cwd: string;
  config: ComponentsConfig;
  name: string;
  items: readonly RegistryItem[];
}): Promise<InstallPlan> {
  const entries: InstallPlanEntry[] = [];
  const destinations = new Set<string>();

  for (const item of items) {
    for (const file of item.files) {
      const destinationPath = await resolveRegistryFilePath(
        cwd,
        config,
        file.path,
      );

      if (destinations.has(destinationPath)) {
        throw new CliError(
          [
            "Multiple registry files resolve to the same destination:",
            destinationPath,
          ].join("\n"),
        );
      }

      destinations.add(destinationPath);
      entries.push({
        registryPath: file.path,
        destinationPath,
        content: file.content,
        overwrite: false,
      });
    }
  }

  const packages = planPackageDependencies(items);

  return {
    name,
    entries,
    dependencies: packages.dependencies,
    devDependencies: packages.devDependencies,
    items: items.map((item) => item.name),
  };
}

/**
 * Merges npm package names from a dependency-first registry graph.
 * The first declaration of a name wins. A name cannot be both a runtime
 * dependency and a development dependency.
 */
export function planPackageDependencies(
  items: readonly RegistryItem[],
): PackageDependencyPlan {
  const dependencies: string[] = [];
  const devDependencies: string[] = [];
  const runtime = new Set<string>();
  const development = new Set<string>();

  for (const item of items) {
    for (const dependency of item.dependencies) {
      recordPackage(
        dependency,
        "dependency",
        runtime,
        development,
        dependencies,
      );
    }

    for (const dependency of item.devDependencies ?? []) {
      recordPackage(
        dependency,
        "devDependency",
        runtime,
        development,
        devDependencies,
      );
    }
  }

  return { dependencies, devDependencies };
}

/**
 * Refuses to replace an existing component file unless `force` is set.
 * `force` does not allow a destination outside the project. Those paths
 * are rejected while the plan is built.
 */
export async function assertDestinationsAvailable(
  cwd: string,
  plan: InstallPlan,
  force = false,
): Promise<void> {
  const existing: string[] = [];

  for (const entry of plan.entries) {
    const destination = path.resolve(cwd, entry.destinationPath);

    if (!(await isFile(destination))) {
      entry.overwrite = false;
      continue;
    }

    if (!force) {
      existing.push(entry.destinationPath);
      continue;
    }

    entry.overwrite = true;
  }

  if (existing.length > 0) {
    throw new CliError(["File already exists:", ...existing].join("\n"));
  }
}

/** Writes planned component files. Overwrite is allowed only for entries marked by `force`. */
export async function writeInstallPlan(
  cwd: string,
  plan: InstallPlan,
): Promise<void> {
  for (const entry of plan.entries) {
    const destination = path.resolve(cwd, entry.destinationPath);

    await mkdir(path.dirname(destination), { recursive: true });
    await writeFile(destination, entry.content, {
      encoding: "utf8",
      flag: entry.overwrite ? "w" : "wx",
    });
  }
}

async function isFile(filePath: string): Promise<boolean> {
  try {
    const file = await stat(filePath);
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

function recordPackage(
  dependency: string,
  kind: "dependency" | "devDependency",
  runtime: Set<string>,
  development: Set<string>,
  destination: string[],
): void {
  const other = kind === "dependency" ? development : runtime;

  if (other.has(dependency)) {
    throw new CliError(
      [
        "Dependency type conflict:",
        `${dependency} is declared as both a dependency and a devDependency.`,
      ].join("\n"),
    );
  }

  const seen = kind === "dependency" ? runtime : development;

  if (seen.has(dependency)) {
    return;
  }

  seen.add(dependency);
  destination.push(dependency);
}

async function resolveRegistryFilePath(
  cwd: string,
  config: ComponentsConfig,
  registryPath: string,
): Promise<string> {
  const segments = registrySegments(registryPath);
  const namespace = segments[0];

  if (!isNamespace(namespace)) {
    throw new CliError(
      [
        "Registry file path uses an unsupported namespace:",
        registryPath,
        `Supported namespaces: ${supportedNamespaces.join(", ")}`,
      ].join("\n"),
    );
  }

  if (segments.length < 2) {
    throw new CliError(
      ["Registry file path does not include a file:", registryPath].join("\n"),
    );
  }

  const directory = await resolveAliasDirectory(cwd, config.aliases[namespace]);
  const destination = path.resolve(directory, ...segments.slice(1));

  if (!isInsideProject(cwd, destination)) {
    throw new CliError(
      ["Registry file path must stay inside the project:", registryPath].join(
        "\n",
      ),
    );
  }

  return path.relative(cwd, destination).split(path.sep).join("/");
}

function registrySegments(registryPath: string): string[] {
  const normalized = registryPath.replaceAll("\\", "/");

  if (
    normalized.startsWith("/") ||
    normalized.startsWith("\\") ||
    /^[a-zA-Z]:[\\/]/.test(registryPath)
  ) {
    throw new CliError(
      ["Registry file path must stay inside the project:", registryPath].join(
        "\n",
      ),
    );
  }

  const segments = normalized.split("/");

  if (
    segments.some(
      (segment) => segment === "" || segment === "." || segment === "..",
    )
  ) {
    throw new CliError(
      ["Registry file path must stay inside the project:", registryPath].join(
        "\n",
      ),
    );
  }

  return segments;
}

function isNamespace(segment: string): segment is RegistryNamespace {
  return (supportedNamespaces as readonly string[]).includes(segment);
}

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

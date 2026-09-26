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
  /** npm packages declared by the registry item. Not installed. */
  dependencies: string[];
  /** Other registry items declared by this item. Not installed. */
  registryDependencies: string[];
}

/**
 * Turns a validated registry item into destination paths.
 * Does not read or write the consumer project except to resolve aliases.
 */
export async function createInstallPlan({
  cwd,
  config,
  item,
}: {
  cwd: string;
  config: ComponentsConfig;
  item: RegistryItem;
}): Promise<InstallPlan> {
  const entries: InstallPlanEntry[] = [];

  for (const file of item.files) {
    const destinationPath = await resolveRegistryFilePath(
      cwd,
      config,
      file.path,
    );

    entries.push({
      registryPath: file.path,
      destinationPath,
      content: file.content,
    });
  }

  const destinations = new Set<string>();

  for (const entry of entries) {
    if (destinations.has(entry.destinationPath)) {
      throw new CliError(
        [
          "Multiple registry files resolve to the same destination:",
          entry.destinationPath,
        ].join("\n"),
      );
    }

    destinations.add(entry.destinationPath);
  }

  return {
    name: item.name,
    entries,
    dependencies: [...item.dependencies],
    registryDependencies: [...(item.registryDependencies ?? [])],
  };
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

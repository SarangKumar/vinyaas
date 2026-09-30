import type { RegistryItem } from "./types";

const WEAK_DESCRIPTIONS = new Set(["a component.", "a component", "component"]);

export interface RegistryValidationIssue {
  name: string;
  field: string;
  message: string;
}

/**
 * Source-registry quality checks for discovery and install metadata.
 * Lives next to the registry so docs tests and builds share one contract.
 */
export function validateRegistryItem(
  item: RegistryItem,
  knownNames: ReadonlySet<string> = new Set(),
): RegistryValidationIssue[] {
  const issues: RegistryValidationIssue[] = [];
  const label = item.name || "(unnamed)";

  if (!item.name?.trim()) {
    issues.push({
      name: label,
      field: "name",
      message: "name is required",
    });
  }

  if (item.type !== "registry:ui") {
    issues.push({
      name: label,
      field: "type",
      message: `type must be registry:ui (got ${String(item.type)})`,
    });
  }

  const description = item.description?.trim() ?? "";

  if (!description) {
    issues.push({
      name: label,
      field: "description",
      message: "description is required",
    });
  } else if (WEAK_DESCRIPTIONS.has(description.toLowerCase())) {
    issues.push({
      name: label,
      field: "description",
      message: "description is too generic",
    });
  }

  const dependencies = item.dependencies ?? [];
  const duplicateDependencies = findDuplicates(dependencies);

  if (duplicateDependencies.length > 0) {
    issues.push({
      name: label,
      field: "dependencies",
      message: `duplicate packages: ${duplicateDependencies.join(", ")}`,
    });
  }

  const devDependencies = item.devDependencies ?? [];
  const duplicateDevDependencies = findDuplicates(devDependencies);

  if (duplicateDevDependencies.length > 0) {
    issues.push({
      name: label,
      field: "devDependencies",
      message: `duplicate packages: ${duplicateDevDependencies.join(", ")}`,
    });
  }

  for (const dependency of dependencies) {
    if (devDependencies.includes(dependency)) {
      issues.push({
        name: label,
        field: "dependencies",
        message: `${dependency} is listed as both a dependency and a devDependency`,
      });
    }
  }

  const registryDependencies = item.registryDependencies ?? [];
  const duplicateRegistryDependencies = findDuplicates(registryDependencies);

  if (duplicateRegistryDependencies.length > 0) {
    issues.push({
      name: label,
      field: "registryDependencies",
      message: `duplicate items: ${duplicateRegistryDependencies.join(", ")}`,
    });
  }

  for (const dependency of registryDependencies) {
    if (dependency === item.name) {
      issues.push({
        name: label,
        field: "registryDependencies",
        message: "cannot depend on itself",
      });
      continue;
    }

    if (knownNames.size > 0 && !knownNames.has(dependency)) {
      issues.push({
        name: label,
        field: "registryDependencies",
        message: `unknown registry item: ${dependency}`,
      });
    }
  }

  if (!item.files || item.files.length === 0) {
    issues.push({
      name: label,
      field: "files",
      message: "at least one file is required",
    });
  } else {
    const entryFiles = item.files.filter((file) => file.path.endsWith(".tsx"));

    if (entryFiles.length === 0) {
      issues.push({
        name: label,
        field: "files",
        message: "missing ui/<name>/index.tsx entry",
      });
    }

    for (const file of item.files) {
      const normalized = file.path.replaceAll("\\", "/");

      if (normalized.includes("..") || normalized.startsWith("/")) {
        issues.push({
          name: label,
          field: "files",
          message: `path must stay inside the theme: ${file.path}`,
        });
        continue;
      }

      if (normalized === `ui/${item.name}/${item.name}.tsx`) {
        issues.push({
          name: label,
          field: "files",
          message: `legacy path is not allowed: ${file.path}`,
        });
      }

      if (
        normalized.endsWith(".tsx") &&
        normalized !== `ui/${item.name}/index.tsx`
      ) {
        issues.push({
          name: label,
          field: "files",
          message: `tsx entry must be ui/${item.name}/index.tsx (got ${file.path})`,
        });
      }

      if (
        normalized.endsWith(".css") &&
        !normalized.startsWith(`ui/${item.name}/`)
      ) {
        issues.push({
          name: label,
          field: "files",
          message: `css file must live under ui/${item.name}/ (got ${file.path})`,
        });
      }
    }
  }

  return issues;
}

export function validateRegistry(
  items: readonly RegistryItem[],
): RegistryValidationIssue[] {
  const knownNames = new Set(items.map((item) => item.name));
  const issues: RegistryValidationIssue[] = [];
  const seen = new Set<string>();

  for (const item of items) {
    if (seen.has(item.name)) {
      issues.push({
        name: item.name,
        field: "name",
        message: "duplicate registry item name",
      });
    }

    seen.add(item.name);
    issues.push(...validateRegistryItem(item, knownNames));
  }

  return issues;
}

function findDuplicates(values: readonly string[]): string[] {
  const seen = new Set<string>();
  const duplicates = new Set<string>();

  for (const value of values) {
    if (seen.has(value)) {
      duplicates.add(value);
    }

    seen.add(value);
  }

  return [...duplicates].sort((left, right) => left.localeCompare(right));
}

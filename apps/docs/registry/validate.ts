import { isRegistryCategory } from "./categories";
import type { RegistryItem } from "./types";

const WEAK_DESCRIPTIONS = new Set([
  "a component.",
  "a component",
  "component",
  "a button component",
  "a button component.",
]);

/** npm package name, optionally scoped. */
const PACKAGE_NAME = /^(?:@[a-z0-9][a-z0-9._-]*\/)?[a-z0-9][a-z0-9._-]*$/i;

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
  const label = item.name?.trim() || "(unnamed)";

  if (!item.name?.trim()) {
    issues.push({
      name: label,
      field: "name",
      message: "missing name",
    });
  } else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(item.name)) {
    issues.push({
      name: label,
      field: "name",
      message: "name must be lowercase kebab-case",
    });
  }

  if (item.type !== "registry:ui") {
    issues.push({
      name: label,
      field: "type",
      message: `invalid type (expected registry:ui, got ${String(item.type)})`,
    });
  }

  if (item.category !== undefined) {
    if (!isRegistryCategory(item.category)) {
      issues.push({
        name: label,
        field: "category",
        message: `invalid category "${String(item.category)}"`,
      });
    }
  }

  const description = item.description?.trim() ?? "";

  if (!description) {
    issues.push({
      name: label,
      field: "description",
      message: "missing description",
    });
  } else if (
    WEAK_DESCRIPTIONS.has(description.toLowerCase()) ||
    description.length < 24
  ) {
    issues.push({
      name: label,
      field: "description",
      message: "description is too generic or too short",
    });
  }

  const dependencies = item.dependencies ?? [];
  issues.push(...validatePackageList(label, "dependencies", dependencies));

  const devDependencies = item.devDependencies ?? [];
  issues.push(
    ...validatePackageList(label, "devDependencies", devDependencies),
  );

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
    if (!dependency.trim()) {
      issues.push({
        name: label,
        field: "registryDependencies",
        message: "invalid dependency format: empty name",
      });
      continue;
    }

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

  if (item.docs !== undefined) {
    const docs = item.docs.trim();

    if (!docs) {
      issues.push({
        name: label,
        field: "docs",
        message: "docs must be a non-empty URL when set",
      });
    } else if (item.name && !docs.endsWith(`/components/${item.name}`)) {
      issues.push({
        name: label,
        field: "docs",
        message: `docs must end with /components/${item.name}`,
      });
    }
  }

  if (!item.files || item.files.length === 0) {
    issues.push({
      name: label,
      field: "files",
      message: "missing files",
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

/** Groups validation issues for build/CLI error output. */
export function formatRegistryValidationFailure(
  issues: readonly RegistryValidationIssue[],
): string {
  if (issues.length === 0) {
    return "Registry validation failed.";
  }

  const byName = new Map<string, string[]>();

  for (const issue of issues) {
    const messages = byName.get(issue.name) ?? [];
    messages.push(issue.message);
    byName.set(issue.name, messages);
  }

  const blocks = [...byName.entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([name, messages]) =>
      [`${name}:`, ...messages.map((message) => `- ${message}`)].join("\n"),
    );

  return ["Registry validation failed:", "", ...blocks].join("\n");
}

function validatePackageList(
  itemName: string,
  field: "dependencies" | "devDependencies",
  values: readonly string[],
): RegistryValidationIssue[] {
  const issues: RegistryValidationIssue[] = [];
  const duplicates = findDuplicates(values);

  if (duplicates.length > 0) {
    issues.push({
      name: itemName,
      field,
      message: `duplicate packages: ${duplicates.join(", ")}`,
    });
  }

  for (const value of values) {
    if (!value.trim() || !PACKAGE_NAME.test(value)) {
      issues.push({
        name: itemName,
        field,
        message: `invalid dependency format: ${value || "(empty)"}`,
      });
    }
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

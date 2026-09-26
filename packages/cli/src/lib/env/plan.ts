import { readFile } from "node:fs/promises";
import path from "node:path";

import { CliError } from "../cli-error.ts";
import type { RegistryItem } from "../registry/types.ts";
import type { EnvInstallPlan, EnvVarRequirement } from "./types.ts";

/**
 * Consumer environment files this planner inspects.
 * A variable is configured when its name is assigned in any of these files.
 * The planner does not rank their values, because it never reads values.
 */
export const envFiles = [
  ".env",
  ".env.local",
  ".env.development",
  ".env.development.local",
  ".env.production",
  ".env.production.local",
] as const;

interface EnvDeclaration {
  name: string;
  description: string;
  item: string;
}

/**
 * Collects required environment variables from a dependency-first registry
 * graph. Identical declarations are deduplicated. Different descriptions fail.
 */
export function collectEnvVars(
  items: readonly RegistryItem[],
): Omit<EnvVarRequirement, "configured">[] {
  const seen = new Map<string, EnvDeclaration>();
  const declarations: Omit<EnvVarRequirement, "configured">[] = [];

  for (const item of items) {
    for (const [name, description] of Object.entries(item.envVars ?? {})) {
      const declaration = {
        name: name.trim(),
        description: description.trim(),
        item: item.name,
      };
      const current = seen.get(declaration.name);

      if (current === undefined) {
        seen.set(declaration.name, declaration);
        declarations.push({
          name: declaration.name,
          description: declaration.description,
        });
        continue;
      }

      if (current.description !== declaration.description) {
        throw new CliError(
          [
            "Environment variable conflict:",
            `${declaration.name} is declared differently by registry items "${current.item}" and "${declaration.item}".`,
          ].join("\n"),
        );
      }
    }
  }

  return declarations;
}

export async function createEnvPlan({
  cwd,
  items,
}: {
  cwd: string;
  items: readonly RegistryItem[];
}): Promise<EnvInstallPlan> {
  const declarations = collectEnvVars(items);
  const configured = await readConfiguredNames(cwd);

  return {
    requirements: declarations.map((declaration) => ({
      ...declaration,
      configured: configured.has(declaration.name),
    })),
  };
}

export function formatEnvPlan(plan: EnvInstallPlan): string | undefined {
  if (plan.requirements.length === 0) {
    return undefined;
  }

  const missing = plan.requirements.filter(
    (requirement) => !requirement.configured,
  );
  const present = plan.requirements.filter(
    (requirement) => requirement.configured,
  );
  const lines: string[] = [];

  if (missing.length > 0) {
    lines.push("Environment variables required:", "");

    for (const requirement of missing) {
      lines.push(
        requirement.description
          ? `  ${requirement.name} — ${requirement.description}`
          : `  ${requirement.name}`,
      );
    }
  }

  if (present.length > 0) {
    if (lines.length > 0) {
      lines.push("");
    } else {
      lines.push("Environment variables:");
    }

    for (const requirement of present) {
      lines.push(`  ${requirement.name} already configured.`);
    }
  }

  if (missing.length === 0) {
    lines.push("", "All required variables are already configured.");
  }

  lines.push("", "No environment files were modified.");

  return lines.join("\n");
}

/**
 * Returns environment variable names assigned in a dotenv file.
 * Values are discarded and are not returned.
 */
export function envNamesIn(source: string): string[] {
  const names: string[] = [];

  for (const line of source.split(/\r?\n/)) {
    const trimmed = line.trim();

    if (trimmed === "" || trimmed.startsWith("#")) {
      continue;
    }

    const assignment = trimmed.startsWith("export ")
      ? trimmed.slice("export ".length).trim()
      : trimmed;
    const separator = assignment.indexOf("=");

    if (separator <= 0) {
      continue;
    }

    const name = assignment.slice(0, separator).trim();

    if (/^[A-Za-z_][A-Za-z0-9_]*$/.test(name)) {
      names.push(name);
    }
  }

  return names;
}

async function readConfiguredNames(cwd: string): Promise<Set<string>> {
  const names = new Set<string>();

  for (const file of envFiles) {
    let source: string;

    try {
      source = await readFile(path.join(cwd, file), "utf8");
    } catch (error) {
      if (isNotFound(error)) {
        continue;
      }

      throw error;
    }

    for (const name of envNamesIn(source)) {
      names.add(name);
    }
  }

  return names;
}

function isNotFound(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "ENOENT"
  );
}

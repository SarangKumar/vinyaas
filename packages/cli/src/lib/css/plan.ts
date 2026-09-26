import { readFile } from "node:fs/promises";
import path from "node:path";

import { CliError } from "../cli-error.ts";
import { isInsideProject } from "../resolve-alias.ts";
import type { RegistryItem } from "../registry/types.ts";
import { applyCss, normalizeValue } from "./apply.ts";
import type { CssRule, CssUpdate, CssVariable } from "./types.ts";

/**
 * Reads the consumer CSS file and plans the registry's `cssVars` and `css`
 * changes. Does not write the file.
 */
export async function createCssUpdate({
  cwd,
  cssPath,
  items,
}: {
  cwd: string;
  cssPath: string;
  items: readonly RegistryItem[];
}): Promise<CssUpdate> {
  const absolutePath = resolveCssPath(cwd, cssPath);
  let previous: string;

  try {
    previous = await readFile(absolutePath, "utf8");
  } catch (error) {
    if (isNotFound(error)) {
      throw new CliError(
        ["Configured CSS file does not exist:", cssPath].join("\n"),
      );
    }

    throw error;
  }

  const { variables, rules } = collectCss(items);
  const next = applyCss(previous, variables, rules);

  return {
    relativePath: cssPath,
    previous,
    next,
    changed: next !== previous,
  };
}

export function resolveCssPath(cwd: string, cssPath: string): string {
  const segments = cssPath.split(/[\\/]/);

  if (
    path.isAbsolute(cssPath) ||
    cssPath.startsWith("/") ||
    cssPath.startsWith("\\") ||
    /^[a-zA-Z]:[\\/]/.test(cssPath) ||
    cssPath.includes("://") ||
    segments.includes("..")
  ) {
    throw new CliError(
      ["Configured CSS path must stay inside the project:", cssPath].join("\n"),
    );
  }

  const absolutePath = path.resolve(cwd, cssPath);

  if (!isInsideProject(cwd, absolutePath)) {
    throw new CliError(
      ["Configured CSS path must stay inside the project:", cssPath].join("\n"),
    );
  }

  return absolutePath;
}

export function collectCss(items: readonly RegistryItem[]): {
  variables: CssVariable[];
  rules: CssRule[];
} {
  const variables: CssVariable[] = [];
  const rules: CssRule[] = [];
  const variableValues = new Map<string, string>();
  const ruleBodies = new Map<string, string>();

  for (const item of items) {
    for (const scope of ["light", "dark"] as const) {
      for (const [name, value] of Object.entries(item.cssVars?.[scope] ?? {})) {
        const property = customProperty(name);
        const normalized = normalizeValue(value);
        const key = `${scope}\0${property}`;
        const current = variableValues.get(key);

        if (current === undefined) {
          variableValues.set(key, normalized);
          variables.push({ scope, name: property, value: normalized });
          continue;
        }

        if (current !== normalized) {
          throw new CliError(
            [
              "Registry CSS variable conflict:",
              `${property} is declared with different values.`,
            ].join("\n"),
          );
        }
      }
    }

    for (const [selector, body] of Object.entries(item.css ?? {})) {
      const normalizedSelector = selector.replace(/\s+/g, " ").trim();
      const normalizedBody = normalizeValue(body);
      const current = ruleBodies.get(normalizedSelector);

      if (current === undefined) {
        ruleBodies.set(normalizedSelector, normalizedBody);
        rules.push({ selector: normalizedSelector, body: normalizedBody });
        continue;
      }

      if (current !== normalizedBody) {
        throw new CliError(
          [
            "Registry CSS conflict:",
            `${normalizedSelector} is declared with different values.`,
          ].join("\n"),
        );
      }
    }
  }

  return { variables, rules };
}

function customProperty(name: string): string {
  const trimmed = name.trim();

  if (trimmed.startsWith("--")) {
    return trimmed;
  }

  return `--${trimmed}`;
}

function isNotFound(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "ENOENT"
  );
}

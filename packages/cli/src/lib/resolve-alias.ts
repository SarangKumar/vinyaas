import { readFile } from "node:fs/promises";
import path from "node:path";

import { CliError } from "./cli-error.ts";
import { parseJsonConfig } from "./parse-jsonc.ts";

interface PathMapping {
  pattern: string;
  /** Length of the pattern text before `*`, used to prefer a specific match. */
  prefixLength: number;
  target: string;
}

/**
 * Maps a consumer import alias, such as `@/components/ui`, to a directory
 * inside the project. The directory comes from `compilerOptions.paths` in
 * `tsconfig.json` or `jsconfig.json`.
 */
export async function resolveAliasDirectory(
  cwd: string,
  specifier: string,
): Promise<string> {
  const mappings = await readPathMappings(cwd);
  const matched = matchSpecifier(specifier, mappings.mappings);
  const target = applyTarget(specifier, matched.target, matched.captured);
  const directory = path.resolve(mappings.baseDir, target);

  if (!isInsideProject(cwd, directory, true)) {
    throw aliasError(specifier);
  }

  return directory;
}

async function readPathMappings(cwd: string): Promise<{
  baseDir: string;
  mappings: PathMapping[];
}> {
  const configPath = await findConfigPath(cwd);

  if (!configPath) {
    throw new CliError(
      [
        "Could not determine where an import alias is on disk.",
        "Expected compilerOptions.paths in tsconfig.json or jsconfig.json.",
      ].join("\n"),
    );
  }

  const parsed = parseJsonConfig(await readFile(configPath, "utf8"));
  const compilerOptions = record(parsed)?.compilerOptions;
  const options = record(compilerOptions);
  const paths = record(options?.paths);
  const baseUrl = typeof options?.baseUrl === "string" ? options.baseUrl : ".";
  const mappings: PathMapping[] = [];

  if (paths) {
    for (const [pattern, targets] of Object.entries(paths)) {
      const target = Array.isArray(targets) ? targets[0] : undefined;

      if (typeof target !== "string" || target.trim() === "") {
        continue;
      }

      const star = pattern.indexOf("*");

      mappings.push({
        pattern,
        prefixLength: star === -1 ? pattern.length : star,
        target,
      });
    }
  }

  return {
    baseDir: path.resolve(cwd, baseUrl),
    mappings,
  };
}

async function findConfigPath(cwd: string): Promise<string | undefined> {
  for (const name of ["tsconfig.json", "jsconfig.json"]) {
    const configPath = path.join(cwd, name);

    try {
      await readFile(configPath, "utf8");
      return configPath;
    } catch (error) {
      if (!isNotFound(error)) {
        throw error;
      }
    }
  }

  return undefined;
}

function matchSpecifier(
  specifier: string,
  mappings: readonly PathMapping[],
): { target: string; captured: string } {
  const matches = mappings.flatMap((mapping) => {
    const captured = capture(mapping.pattern, specifier);

    return captured === undefined ? [] : [{ mapping, captured }];
  });
  const best = matches.reduce<number | undefined>((longest, match) => {
    if (longest === undefined || match.mapping.prefixLength > longest) {
      return match.mapping.prefixLength;
    }

    return longest;
  }, undefined);
  const selected = matches.filter(
    (match) => match.mapping.prefixLength === best,
  );

  if (!selected.length || selected.length > 1 || best === undefined) {
    throw aliasError(specifier);
  }

  return {
    target: selected[0].mapping.target,
    captured: selected[0].captured,
  };
}

function capture(pattern: string, specifier: string): string | undefined {
  const star = pattern.indexOf("*");

  if (star !== pattern.lastIndexOf("*")) {
    return undefined;
  }

  if (star === -1) {
    return pattern === specifier ? "" : undefined;
  }

  const prefix = pattern.slice(0, star);
  const suffix = pattern.slice(star + 1);

  if (!specifier.startsWith(prefix) || !specifier.endsWith(suffix)) {
    return undefined;
  }

  if (specifier.length < prefix.length + suffix.length) {
    return undefined;
  }

  return specifier.slice(prefix.length, specifier.length - suffix.length);
}

function applyTarget(
  specifier: string,
  target: string,
  captured: string,
): string {
  const star = target.indexOf("*");

  if (star !== target.lastIndexOf("*")) {
    throw aliasError(specifier);
  }

  if (star === -1) {
    if (captured !== "") {
      throw aliasError(specifier);
    }

    return target;
  }

  return `${target.slice(0, star)}${captured}${target.slice(star + 1)}`;
}

function aliasError(specifier: string): CliError {
  return new CliError(
    `Could not safely map "${specifier}" to a directory inside this project.`,
  );
}

export function isInsideProject(
  projectRoot: string,
  candidate: string,
  allowRoot = false,
): boolean {
  const relative = path.relative(projectRoot, candidate);

  if (relative === "") {
    return allowRoot;
  }

  if (path.isAbsolute(relative)) {
    return false;
  }

  return !relative.split(path.sep).includes("..");
}

function record(value: unknown): Record<string, unknown> | undefined {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return undefined;
  }

  return value as Record<string, unknown>;
}

function isNotFound(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "ENOENT"
  );
}

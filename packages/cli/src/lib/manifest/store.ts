import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import type { InstallPlan } from "../install-plan.ts";
import { parseJsonConfig } from "../parse-jsonc.ts";
import { readPackageVersion } from "../version.ts";
import { MANIFEST_RELATIVE_PATH } from "./paths.ts";
import type { ManifestComponent, VinyaasManifest } from "./types.ts";

export { MANIFEST_RELATIVE_PATH };

export function emptyManifest(version = readPackageVersion()): VinyaasManifest {
  return { version, components: {} };
}

export function manifestPath(cwd: string): string {
  return path.resolve(cwd, MANIFEST_RELATIVE_PATH);
}

/**
 * Reads `installedComponents` from `components.json`.
 * Returns null when the file or field is missing.
 */
export async function readManifest(
  cwd: string,
): Promise<VinyaasManifest | null> {
  let source: string;

  try {
    source = await readFile(manifestPath(cwd), "utf8");
  } catch (error) {
    if (isNotFound(error)) {
      return null;
    }

    throw error;
  }

  const parsed = parseJsonConfig(source);

  if (
    typeof parsed !== "object" ||
    parsed === null ||
    Array.isArray(parsed) ||
    !("installedComponents" in parsed)
  ) {
    return null;
  }

  const raw = (parsed as Record<string, unknown>).installedComponents;

  return {
    version: readPackageVersion(),
    components: parseInstalledComponents(raw),
  };
}

/**
 * Merges the `installedComponents` key into the existing `components.json`.
 * Preserves all other keys (style, aliases, tailwind, $schema, etc.).
 */
export async function writeManifest(
  cwd: string,
  manifest: VinyaasManifest,
): Promise<void> {
  const absolute = manifestPath(cwd);

  let existing: Record<string, unknown> = {};

  try {
    const source = await readFile(absolute, "utf8");
    const parsed = parseJsonConfig(source);

    if (
      typeof parsed === "object" &&
      parsed !== null &&
      !Array.isArray(parsed)
    ) {
      existing = parsed as Record<string, unknown>;
    }
  } catch (error) {
    if (!isNotFound(error)) {
      throw error;
    }
  }

  const updated = { ...existing, installedComponents: manifest.components };

  await writeFile(absolute, `${JSON.stringify(updated, null, 2)}\n`, "utf8");
}

/**
 * Merges installed plan entries into the existing manifest.
 * Preserves components that were not part of this install.
 */
export function mergeManifestFromPlan({
  existing,
  plan,
  version = readPackageVersion(),
  installedAt = todayIsoDate(),
}: {
  existing: VinyaasManifest | null;
  plan: InstallPlan;
  version?: string;
  installedAt?: string;
}): VinyaasManifest {
  const components: Record<string, ManifestComponent> = {
    ...(existing?.components ?? {}),
  };
  const filesByItem = new Map<string, string[]>();

  for (const entry of plan.entries) {
    const files = filesByItem.get(entry.itemName) ?? [];
    files.push(entry.destinationPath);
    filesByItem.set(entry.itemName, files);
  }

  for (const [name, files] of filesByItem) {
    components[name] = {
      files: [...new Set(files)].sort((left, right) =>
        left.localeCompare(right),
      ),
      installedAt,
    };
  }

  return { version, components };
}

export async function updateManifestFromPlan(
  cwd: string,
  plan: InstallPlan,
  options: {
    version?: string;
    installedAt?: string;
  } = {},
): Promise<VinyaasManifest> {
  if (plan.entries.length === 0) {
    const existing = await readManifest(cwd);
    return existing ?? emptyManifest(options.version);
  }

  const existing = await readManifest(cwd);
  const next = mergeManifestFromPlan({
    existing,
    plan,
    ...(options.version ? { version: options.version } : {}),
    ...(options.installedAt ? { installedAt: options.installedAt } : {}),
  });
  await writeManifest(cwd, next);
  return next;
}

export function listManifestComponents(
  manifest: VinyaasManifest | null,
): string[] {
  if (!manifest) {
    return [];
  }

  return Object.keys(manifest.components).sort((left, right) =>
    left.localeCompare(right),
  );
}

export function todayIsoDate(now = new Date()): string {
  return now.toISOString().slice(0, 10);
}

function parseInstalledComponents(
  input: unknown,
): Record<string, ManifestComponent> {
  if (typeof input !== "object" || input === null || Array.isArray(input)) {
    throw new Error("Could not read installedComponents from components.json.");
  }

  const components: Record<string, ManifestComponent> = {};
  const raw = input as Record<string, unknown>;

  for (const [name, value] of Object.entries(raw)) {
    if (
      typeof value !== "object" ||
      value === null ||
      !Array.isArray((value as { files?: unknown }).files) ||
      typeof (value as { installedAt?: unknown }).installedAt !== "string"
    ) {
      throw new Error(
        "Could not read installedComponents from components.json.",
      );
    }

    const files = (value as { files: unknown[] }).files;

    if (!files.every((file) => typeof file === "string")) {
      throw new Error(
        "Could not read installedComponents from components.json.",
      );
    }

    components[name] = {
      files: files as string[],
      installedAt: (value as { installedAt: string }).installedAt,
    };
  }

  return components;
}

function isNotFound(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "ENOENT"
  );
}

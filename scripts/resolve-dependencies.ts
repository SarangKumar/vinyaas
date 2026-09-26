import fs from "node:fs/promises";
import path from "node:path";

const extensions = [".ts", ".tsx", ".js", ".jsx"];

interface ResolveOptions {
  registryRoot: string;
  entryFile: string;
}

export async function resolveDependencies({
  registryRoot,
  entryFile,
}: ResolveOptions): Promise<string[]> {
  const visited = new Set<string>();

  async function visit(relativeFile: string) {
    const normalizedFile = normalizePath(relativeFile);

    if (visited.has(normalizedFile)) {
      return;
    }

    visited.add(normalizedFile);

    const absoluteFile = path.join(registryRoot, normalizedFile);
    const source = await fs.readFile(absoluteFile, "utf8");

    const imports = extractLocalImports(source);

    for (const importPath of imports) {
      const resolved = await resolveImport(
        registryRoot,
        normalizedFile,
        importPath,
      );

      if (resolved) {
        await visit(resolved);
      }
    }
  }

  await visit(entryFile);

  return [...visited];
}

function extractLocalImports(source: string): string[] {
  const imports = new Set<string>();

  const importRegex =
    /(?:import|export)\s+(?:[\s\S]*?\s+from\s+)?["']([^"']+)["']/g;

  for (const match of source.matchAll(importRegex)) {
    const importPath = match[1];

    if (importPath.startsWith("@/")) {
      imports.add(importPath);
    }
  }

  return [...imports];
}

async function resolveImport(
  registryRoot: string,
  importingFile: string,
  importPath: string,
): Promise<string | null> {
  const importingDirectory = path.dirname(importingFile);

  let candidate: string;

  if (importPath.startsWith("@/")) {
    candidate = importPath.slice(2);
  } else {
    candidate = path.join(importingDirectory, importPath);
  }

  candidate = normalizePath(candidate);

  for (const extension of extensions) {
    const file = `${candidate}${extension}`;

    if (await fileExists(path.join(registryRoot, file))) {
      return file;
    }
  }

  if (await fileExists(path.join(registryRoot, candidate))) {
    return candidate;
  }

  return null;
}

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

function normalizePath(filePath: string): string {
  return filePath.split(path.sep).join("/");
}

import type {
  RegistryCatalog,
  RegistryCatalogItem,
  RegistryCssVars,
  RegistryFile,
  RegistryItem,
  RegistryItemFile,
  RegistryItemPayload,
} from "./types";

/**
 * `dependencies` is always written so every installable item has a stable npm
 * package list. Other metadata is omitted when it is empty.
 */
export function serializeRegistryItem(
  item: RegistryItem,
  files: readonly RegistryItemFile[],
  schemaUrl: string,
): RegistryItemPayload {
  const description = normalizeDocs(item.description);
  const devDependencies = copyStrings(item.devDependencies);
  const registryDependencies = copyStrings(item.registryDependencies);
  const cssVars = copyCssVars(item.cssVars);
  const css = copyRecord(item.css);
  const envVars = copyRecord(item.envVars);
  const docs = normalizeDocs(item.docs);

  return {
    $schema: schemaUrl,
    name: item.name,
    type: item.type,
    ...(description ? { description } : {}),
    dependencies: copyStrings(item.dependencies) ?? [],
    ...(devDependencies ? { devDependencies } : {}),
    ...(registryDependencies ? { registryDependencies } : {}),
    files: files.map(normalizeRegistryItemFile),
    ...(cssVars ? { cssVars } : {}),
    ...(css ? { css } : {}),
    ...(envVars ? { envVars } : {}),
    ...(docs ? { docs } : {}),
  };
}

/** Builds the style catalog used by discovery commands. Sorted by name. */
export function serializeRegistryCatalog(
  style: string,
  items: readonly RegistryItem[],
): RegistryCatalog {
  const catalogItems = items
    .map((item) => serializeCatalogItem(item))
    .sort((left, right) => left.name.localeCompare(right.name));

  return {
    style,
    items: catalogItems,
  };
}

function serializeCatalogItem(item: RegistryItem): RegistryCatalogItem {
  const description = normalizeDocs(item.description);
  const devDependencies = copyStrings(item.devDependencies);
  const registryDependencies = copyStrings(item.registryDependencies);
  const docs = normalizeDocs(item.docs);

  return {
    name: item.name,
    type: item.type,
    ...(description ? { description } : {}),
    dependencies: copyStrings(item.dependencies) ?? [],
    ...(devDependencies ? { devDependencies } : {}),
    ...(registryDependencies ? { registryDependencies } : {}),
    files: item.files.map((file) => normalizePath(file.path)),
    ...(docs ? { docs } : {}),
  };
}

/**
 * Reads only the files declared on the registry item.
 * Local imports in those files are not followed.
 */
export async function readRegistryItemFiles(
  item: RegistryItem,
  readFile: (relativePath: string) => Promise<string>,
): Promise<RegistryItemFile[]> {
  return Promise.all(
    item.files.map(async (file) => {
      const relativePath = normalizePath(file.path);
      const content = await readFile(relativePath);

      return toRegistryItemFile({ ...file, path: relativePath }, content);
    }),
  );
}

function toRegistryItemFile(
  file: RegistryFile,
  content: string,
): RegistryItemFile {
  return normalizeRegistryItemFile({
    path: file.path,
    content,
    ...(file.type ? { type: file.type } : {}),
    ...(file.target ? { target: file.target } : {}),
  });
}

function normalizeRegistryItemFile(file: RegistryItemFile): RegistryItemFile {
  return {
    path: normalizePath(file.path),
    content: file.content,
    ...(file.type ? { type: file.type } : {}),
    ...(file.target ? { target: file.target } : {}),
  };
}

function normalizePath(filePath: string): string {
  return filePath.replaceAll("\\", "/");
}

function copyStrings(
  values: readonly string[] | undefined,
): string[] | undefined {
  if (!values || values.length === 0) {
    return undefined;
  }

  return [...values];
}

function copyRecord(
  record: Readonly<Record<string, string>> | undefined,
): Record<string, string> | undefined {
  if (!record || Object.keys(record).length === 0) {
    return undefined;
  }

  return { ...record };
}

function copyCssVars(
  cssVars: RegistryCssVars | undefined,
): RegistryCssVars | undefined {
  if (!cssVars) {
    return undefined;
  }

  const light = copyRecord(cssVars.light);
  const dark = copyRecord(cssVars.dark);

  if (!light && !dark) {
    return undefined;
  }

  return {
    ...(light ? { light } : {}),
    ...(dark ? { dark } : {}),
  };
}

function normalizeDocs(docs: string | undefined): string | undefined {
  const trimmed = docs?.trim();

  if (!trimmed) {
    return undefined;
  }

  return trimmed;
}

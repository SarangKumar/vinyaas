/**
 * Controlled registry categories for CLI discovery and installs.
 * Labels stay aligned with apps/docs/registry/categories.ts.
 */
import { CliError } from "../cli-error.ts";

export const registryCategories = [
  "forms",
  "layout",
  "navigation",
  "feedback",
  "data-display",
  "typography",
  "charts",
  "utilities",
] as const;

export type RegistryCategory = (typeof registryCategories)[number];

export const registryCategoryLabels: Record<RegistryCategory, string> = {
  forms: "Forms",
  layout: "Layout",
  navigation: "Navigation",
  feedback: "Feedback",
  "data-display": "Data display",
  typography: "Typography",
  charts: "Charts",
  utilities: "Utilities",
};

export function isRegistryCategory(value: string): value is RegistryCategory {
  return (registryCategories as readonly string[]).includes(value);
}

export function formatRegistryCategoryLabel(category: string): string {
  if (isRegistryCategory(category)) {
    return registryCategoryLabels[category];
  }

  return category;
}

export function formatUnknownCategoryMessage(category: string): string {
  return [
    `Unknown category: ${category}`,
    "",
    "Available categories:",
    ...registryCategories,
  ].join("\n");
}

export function requireRegistryCategory(category: string): RegistryCategory {
  const trimmed = category.trim();

  if (!isRegistryCategory(trimmed)) {
    throw new CliError(formatUnknownCategoryMessage(trimmed || category));
  }

  return trimmed;
}

export function filterItemsByCategory<T extends { category?: string }>(
  items: readonly T[],
  category: string,
): T[] {
  const known = requireRegistryCategory(category);
  return items.filter((item) => item.category === known);
}

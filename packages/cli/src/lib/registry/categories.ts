/**
 * Display labels for registry categories.
 * Allowed values are validated at registry build time; the CLI trusts catalog data.
 */
export const registryCategoryLabels: Record<string, string> = {
  forms: "Forms",
  layout: "Layout",
  navigation: "Navigation",
  feedback: "Feedback",
  "data-display": "Data display",
  typography: "Typography",
  charts: "Charts",
  utilities: "Utilities",
};

export function formatRegistryCategoryLabel(category: string): string {
  return registryCategoryLabels[category] ?? category;
}

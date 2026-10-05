/**
 * Controlled registry categories for discovery.
 * Optional on items; when set, must be one of these values.
 */
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

/** Default category per registry component name. */
export const registryComponentCategories: Readonly<
  Record<string, RegistryCategory>
> = {
  accordion: "layout",
  alert: "feedback",
  "aspect-ratio": "layout",
  attachment: "data-display",
  avatar: "data-display",
  badge: "data-display",
  breadcrumb: "navigation",
  button: "forms",
  card: "layout",
  chart: "charts",
  checkbox: "forms",
  command: "navigation",
  dialog: "feedback",
  drawer: "feedback",
  "drag-and-drop": "layout",
  "dropdown-menu": "feedback",
  "file-upload": "forms",
  "hover-card": "feedback",
  input: "forms",
  "input-group": "forms",
  "input-otp": "forms",
  kbd: "data-display",
  label: "forms",
  marker: "utilities",
  "native-select": "forms",
  select: "forms",
  popover: "feedback",
  progress: "feedback",
  "radio-group": "forms",
  resizable: "layout",
  "scroll-area": "layout",
  separator: "layout",
  sidebar: "navigation",
  skeleton: "data-display",
  slider: "forms",
  spinner: "feedback",
  switch: "forms",
  table: "data-display",
  tabs: "navigation",
  textarea: "forms",
  toast: "feedback",
  tooltip: "feedback",
  typography: "typography",
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

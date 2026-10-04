/**
 * Named component catalogs (v1.3).
 *
 * Catalogs group registry component IDs for discovery and bulk install.
 * Membership refers to registry item names — metadata is not duplicated.
 *
 * Only currently installable components are listed. Planned gaps for the
 * rest of v1.3 are documented at the bottom of this file.
 */

export type ComponentCatalogDefinition = {
  id: string;
  name: string;
  description: string;
  /** Registry component IDs (must exist in the active theme registry). */
  components: readonly string[];
};

/**
 * Authoritative catalog definitions.
 * Built to `public/r/catalogs/index.json` by `pnpm registry:build`.
 */
export const componentCatalogs: readonly ComponentCatalogDefinition[] = [
  {
    id: "form",
    name: "Form",
    description:
      "Core form controls for building inputs, choices, and actions.",
    components: [
      "button",
      "input",
      "label",
      "textarea",
      "native-select",
      "checkbox",
      "radio-group",
      "switch",
      "slider",
    ],
  },
  {
    id: "dashboard",
    name: "Dashboard",
    description:
      "Primitives commonly used in dashboards and application surfaces.",
    components: [
      "card",
      "badge",
      "tabs",
      "breadcrumb",
      "tooltip",
      "progress",
      "skeleton",
      "table",
      "scroll-area",
      "separator",
      "resizable",
      "sidebar",
      "drag-and-drop",
    ],
  },
  {
    id: "navigation",
    name: "Navigation",
    description: "Navigation and command patterns for application shells.",
    components: ["breadcrumb", "tabs", "dropdown-menu", "command", "sidebar"],
  },
  {
    id: "feedback",
    name: "Feedback",
    description: "Alerts, overlays, and progress cues for user feedback.",
    components: [
      "alert",
      "dialog",
      "drawer",
      "toast",
      "skeleton",
      "progress",
      "spinner",
    ],
  },
  {
    id: "application",
    name: "Application",
    description: "A starter set of application-shell and content primitives.",
    components: [
      "command",
      "dialog",
      "dropdown-menu",
      "popover",
      "tooltip",
      "tabs",
      "card",
      "badge",
      "breadcrumb",
      "resizable",
      "sidebar",
      "drag-and-drop",
    ],
  },
] as const;

export function getComponentCatalog(
  id: string,
): ComponentCatalogDefinition | null {
  const needle = id.trim().toLowerCase();
  return componentCatalogs.find((catalog) => catalog.id === needle) ?? null;
}

export function listComponentCatalogIds(): string[] {
  return componentCatalogs.map((catalog) => catalog.id);
}

/**
 * Planned catalog members not yet in the registry (document only).
 * Do not invent fake registry items for these.
 *
 * form: select, form
 * dashboard: data-table
 * navigation: navigation-menu, pagination
 * feedback: alert-dialog, sheet, empty-state
 * application: data-table, pagination
 */
export const plannedCatalogGaps: Readonly<Record<string, readonly string[]>> = {
  form: ["select", "form"],
  dashboard: ["data-table"],
  navigation: ["navigation-menu", "pagination"],
  feedback: ["alert-dialog", "sheet", "empty-state"],
  application: ["data-table", "pagination"],
};

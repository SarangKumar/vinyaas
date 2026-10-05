import {
  formatRegistryCategoryLabel,
  registryCategories,
  registryCategoryLabels,
  registryComponentCategories,
  type RegistryCategory,
} from "@/registry/categories";

/** Docs grouping uses registry categories as the single source of truth. */
export type ComponentCategory = RegistryCategory;

export { formatRegistryCategoryLabel };

/** The current docs/website release version. */
export const currentVersion = "1.3.0";

export type ReleaseVersion = "0.1" | "1.0.0" | "1.1.0" | "1.2.0" | "1.3.0";

type ComponentMetaSource = {
  name: string;
  slug: string;
  description: string;
  introducedIn: ReleaseVersion;
};

export type ComponentMeta = ComponentMetaSource & {
  category: ComponentCategory;
};

/**
 * Alphabetical catalog. Sidebar and the components index read this list.
 * Category comes from apps/docs/registry/categories.ts.
 * Button is the only v0.1 component.
 */
const componentSources: readonly ComponentMetaSource[] = [
  {
    name: "Accordion",
    slug: "accordion",
    description: "A stack of sections that expand and collapse.",
    introducedIn: "1.0.0",
  },
  {
    name: "Alert",
    slug: "alert",
    description: "A notice for a status that should be announced.",
    introducedIn: "1.0.0",
  },
  {
    name: "Alert Dialog",
    slug: "alert-dialog",
    description: "A confirmation modal for important or destructive actions.",
    introducedIn: "1.3.0",
  },
  {
    name: "Aspect Ratio",
    slug: "aspect-ratio",
    description: "Displays content within a desired ratio.",
    introducedIn: "1.1.0",
  },
  {
    name: "Attachment",
    slug: "attachment",
    description: "A file or image chip with media, metadata, and actions.",
    introducedIn: "1.1.0",
  },
  {
    name: "Avatar",
    slug: "avatar",
    description: "An image with a fallback for a person or entity.",
    introducedIn: "1.0.0",
  },
  {
    name: "Badge",
    slug: "badge",
    description: "A compact label for status or category.",
    introducedIn: "1.0.0",
  },
  {
    name: "Breadcrumb",
    slug: "breadcrumb",
    description: "A trail of links for the current page.",
    introducedIn: "1.0.0",
  },
  {
    name: "Button",
    slug: "button",
    description: "A versatile button primitive for actions and commands.",
    introducedIn: "0.1",
  },
  {
    name: "Calendar",
    slug: "calendar",
    description: "An accessible month calendar for selecting dates.",
    introducedIn: "1.3.0",
  },
  {
    name: "Card",
    slug: "card",
    description: "A bordered container for related content.",
    introducedIn: "1.0.0",
  },
  {
    name: "Chart",
    slug: "chart",
    description: "Themed charts for dashboards and product analytics.",
    introducedIn: "1.1.0",
  },
  {
    name: "Checkbox",
    slug: "checkbox",
    description: "A native checkbox control for selecting one or more options.",
    introducedIn: "1.0.0",
  },
  {
    name: "Combobox",
    slug: "combobox",
    description: "A searchable control for filtering and choosing options.",
    introducedIn: "1.3.0",
  },
  {
    name: "Command",
    slug: "command",
    description: "A searchable list of actions and pages.",
    introducedIn: "1.0.0",
  },
  {
    name: "Data Table",
    slug: "data-table",
    description:
      "A dashboard table with search, sorting, selection, and pagination.",
    introducedIn: "1.3.0",
  },
  {
    name: "Date Picker",
    slug: "date-picker",
    description: "A calendar popover for choosing a single date.",
    introducedIn: "1.3.0",
  },
  {
    name: "Dialog",
    slug: "dialog",
    description: "A modal panel for a focused task.",
    introducedIn: "1.0.0",
  },
  {
    name: "Drag & Drop",
    slug: "drag-and-drop",
    description:
      "Sortable and reorderable drag-and-drop for lists, cards, and boards.",
    introducedIn: "1.3.0",
  },
  {
    name: "Drawer",
    slug: "drawer",
    description: "A panel that slides in from the edge of the screen.",
    introducedIn: "1.1.0",
  },
  {
    name: "Dropdown Menu",
    slug: "dropdown-menu",
    description: "A menu of actions anchored to a button.",
    introducedIn: "1.0.0",
  },
  {
    name: "Empty State",
    slug: "empty-state",
    description: "A composable empty state for lists and dashboard panels.",
    introducedIn: "1.3.0",
  },
  {
    name: "File Upload",
    slug: "file-upload",
    description: "A native file picker with drag and drop.",
    introducedIn: "1.0.0",
  },
  {
    name: "Hover Card",
    slug: "hover-card",
    description: "A preview that opens on hover or focus.",
    introducedIn: "1.0.0",
  },
  {
    name: "Input",
    slug: "input",
    description: "A styled native input for single-line user input.",
    introducedIn: "1.0.0",
  },
  {
    name: "Input Group",
    slug: "input-group",
    description: "A field with icons, addons, and actions.",
    introducedIn: "1.0.0",
  },
  {
    name: "Input OTP",
    slug: "input-otp",
    description: "A grouped one-time code field.",
    introducedIn: "1.0.0",
  },
  {
    name: "Kbd",
    slug: "kbd",
    description: "A compact label for a keyboard key.",
    introducedIn: "1.0.0",
  },
  {
    name: "Label",
    slug: "label",
    description: "An accessible label for form controls.",
    introducedIn: "1.0.0",
  },
  {
    name: "Marker",
    slug: "marker",
    description: "An inline status, bordered row, or labeled divider.",
    introducedIn: "1.0.0",
  },
  {
    name: "Native Select",
    slug: "native-select",
    description: "A composed native select with options and groups.",
    introducedIn: "1.0.0",
  },
  {
    name: "Navigation Menu",
    slug: "navigation-menu",
    description:
      "A composable site navigation menu with rich mega-menu content panels.",
    introducedIn: "1.3.0",
  },
  {
    name: "Pagination",
    slug: "pagination",
    description:
      "Composable page navigation with previous, next, links, and ellipsis.",
    introducedIn: "1.3.0",
  },
  {
    name: "Popover",
    slug: "popover",
    description: "A floating panel with interactive content.",
    introducedIn: "1.0.0",
  },
  {
    name: "Progress",
    slug: "progress",
    description: "A native progress indicator for a known amount of work.",
    introducedIn: "1.0.0",
  },
  {
    name: "Radio Group",
    slug: "radio-group",
    description: "A group of mutually exclusive selectable options.",
    introducedIn: "1.0.0",
  },
  {
    name: "Resizable",
    slug: "resizable",
    description:
      "Resizable panel layouts with accessible handles for dashboards.",
    introducedIn: "1.3.0",
  },
  {
    name: "Scroll Area",
    slug: "scroll-area",
    description: "A native scroll container with a thin scrollbar.",
    introducedIn: "1.0.0",
  },
  {
    name: "Select",
    slug: "select",
    description:
      "A custom select with grouped options and keyboard-friendly listbox behavior.",
    introducedIn: "1.3.0",
  },
  {
    name: "Separator",
    slug: "separator",
    description: "A horizontal or vertical divider between content.",
    introducedIn: "1.0.0",
  },
  {
    name: "Sheet",
    slug: "sheet",
    description:
      "A side modal for settings, details, filters, and mobile navigation.",
    introducedIn: "1.3.0",
  },
  {
    name: "Sidebar",
    slug: "sidebar",
    description:
      "Composable dashboard sidebar with collapsed and mobile navigation.",
    introducedIn: "1.3.0",
  },
  {
    name: "Skeleton",
    slug: "skeleton",
    description: "A placeholder shown while content is loading.",
    introducedIn: "1.0.0",
  },
  {
    name: "Slider",
    slug: "slider",
    description: "A native range input for a value between two bounds.",
    introducedIn: "1.0.0",
  },
  {
    name: "Spinner",
    slug: "spinner",
    description: "A small loading indicator.",
    introducedIn: "1.0.0",
  },
  {
    name: "Switch",
    slug: "switch",
    description: "A switch for a binary setting.",
    introducedIn: "1.0.0",
  },
  {
    name: "Table",
    slug: "table",
    description: "A semantic table for rows and columns.",
    introducedIn: "1.0.0",
  },
  {
    name: "Tabs",
    slug: "tabs",
    description: "A set of panels that share one visible view at a time.",
    introducedIn: "1.1.0",
  },
  {
    name: "Textarea",
    slug: "textarea",
    description: "A styled multiline text input.",
    introducedIn: "1.0.0",
  },
  {
    name: "Toast",
    slug: "toast",
    description: "A temporary notice.",
    introducedIn: "1.0.0",
  },
  {
    name: "Tooltip",
    slug: "tooltip",
    description: "A short label for a control.",
    introducedIn: "1.0.0",
  },
  {
    name: "Typography",
    slug: "typography",
    description: "Semantic text styles for titles, body, and supporting copy.",
    introducedIn: "1.0.0",
  },
];

function withRegistryCategory(source: ComponentMetaSource): ComponentMeta {
  const category = registryComponentCategories[source.slug];

  if (!category) {
    throw new Error(
      `Missing registry category for docs component "${source.slug}".`,
    );
  }

  return { ...source, category };
}

export const components: readonly ComponentMeta[] =
  componentSources.map(withRegistryCategory);

/** v1.0.0 ships the full catalog. The progress max matches that count. */
export const targetComponentCount = components.length;

export const categoryOrder = registryCategories.map(
  (id) => [id, registryCategoryLabels[id]] as const,
);

export function componentsInCategory(category: ComponentCategory) {
  return components.filter((component) => component.category === category);
}

export function componentHref(slug: string) {
  return `/components/${slug}`;
}

/** Components introduced in the current docs/website release. */
export function isNewComponent(component: ComponentMeta) {
  return component.introducedIn === currentVersion;
}

/** Sorted new components for nav indicators and the New Components section. */
export function newComponents() {
  return components
    .filter(isNewComponent)
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name));
}

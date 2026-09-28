export type ComponentCategory =
  "form" | "feedback" | "layout" | "navigation" | "display" | "overlay";

/** The docs version whose additions count as New Components. */
export const currentVersion = "0.2";

export type ReleaseVersion = "0.1" | "0.2";

export type ComponentMeta = {
  name: string;
  slug: string;
  description: string;
  category: ComponentCategory;
  introducedIn: ReleaseVersion;
};

/**
 * Alphabetical catalog. Sidebar, New Components, and All Components read this list.
 * New means introducedIn matches currentVersion. Button is the only v0.1 component.
 */
export const components: readonly ComponentMeta[] = [
  {
    name: "Accordion",
    slug: "accordion",
    description: "A stack of sections that expand and collapse.",
    category: "layout",
    introducedIn: "0.2",
  },
  {
    name: "Alert",
    slug: "alert",
    description: "A notice for a status that should be announced.",
    category: "feedback",
    introducedIn: "0.2",
  },
  {
    name: "Avatar",
    slug: "avatar",
    description: "An image with a fallback for a person or entity.",
    category: "display",
    introducedIn: "0.2",
  },
  {
    name: "Badge",
    slug: "badge",
    description: "A compact label for status or category.",
    category: "display",
    introducedIn: "0.2",
  },
  {
    name: "Breadcrumb",
    slug: "breadcrumb",
    description: "A trail of links for the current page.",
    category: "navigation",
    introducedIn: "0.2",
  },
  {
    name: "Button",
    slug: "button",
    description: "A versatile button primitive for actions and commands.",
    category: "form",
    introducedIn: "0.1",
  },
  {
    name: "Card",
    slug: "card",
    description: "A bordered container for related content.",
    category: "layout",
    introducedIn: "0.2",
  },
  {
    name: "Checkbox",
    slug: "checkbox",
    description: "A native checkbox control for selecting one or more options.",
    category: "form",
    introducedIn: "0.2",
  },
  {
    name: "Dialog",
    slug: "dialog",
    description: "A modal panel for a focused task.",
    category: "overlay",
    introducedIn: "0.2",
  },
  {
    name: "Dropdown Menu",
    slug: "dropdown-menu",
    description: "A menu of actions anchored to a button.",
    category: "overlay",
    introducedIn: "0.2",
  },
  {
    name: "Hover Card",
    slug: "hover-card",
    description: "A preview that opens on hover or focus.",
    category: "overlay",
    introducedIn: "0.2",
  },
  {
    name: "Input",
    slug: "input",
    description: "A styled native input for single-line user input.",
    category: "form",
    introducedIn: "0.2",
  },
  {
    name: "Kbd",
    slug: "kbd",
    description: "A compact label for a keyboard key.",
    category: "display",
    introducedIn: "0.2",
  },
  {
    name: "Label",
    slug: "label",
    description: "An accessible label for form controls.",
    category: "form",
    introducedIn: "0.2",
  },
  {
    name: "Marker",
    slug: "marker",
    description: "An inline status, bordered row, or labeled divider.",
    category: "display",
    introducedIn: "0.2",
  },
  {
    name: "Native Select",
    slug: "native-select",
    description: "A composed native select with options and groups.",
    category: "form",
    introducedIn: "0.2",
  },
  {
    name: "Popover",
    slug: "popover",
    description: "A floating panel with interactive content.",
    category: "overlay",
    introducedIn: "0.2",
  },
  {
    name: "Progress",
    slug: "progress",
    description: "A native progress indicator for a known amount of work.",
    category: "feedback",
    introducedIn: "0.2",
  },
  {
    name: "Radio Group",
    slug: "radio-group",
    description: "A group of mutually exclusive selectable options.",
    category: "form",
    introducedIn: "0.2",
  },
  {
    name: "Scroll Area",
    slug: "scroll-area",
    description: "A native scroll container with a thin scrollbar.",
    category: "layout",
    introducedIn: "0.2",
  },
  {
    name: "Separator",
    slug: "separator",
    description: "A horizontal or vertical divider between content.",
    category: "layout",
    introducedIn: "0.2",
  },
  {
    name: "Skeleton",
    slug: "skeleton",
    description: "A placeholder shown while content is loading.",
    category: "display",
    introducedIn: "0.2",
  },
  {
    name: "Slider",
    slug: "slider",
    description: "A native range input for a value between two bounds.",
    category: "form",
    introducedIn: "0.2",
  },
  {
    name: "Spinner",
    slug: "spinner",
    description: "A small loading indicator.",
    category: "feedback",
    introducedIn: "0.2",
  },
  {
    name: "Switch",
    slug: "switch",
    description: "A switch for a binary setting.",
    category: "form",
    introducedIn: "0.2",
  },
  {
    name: "Table",
    slug: "table",
    description: "A semantic table for rows and columns.",
    category: "display",
    introducedIn: "0.2",
  },
  {
    name: "Textarea",
    slug: "textarea",
    description: "A styled multiline text input.",
    category: "form",
    introducedIn: "0.2",
  },
  {
    name: "Toast",
    slug: "toast",
    description: "A temporary notice.",
    category: "feedback",
    introducedIn: "0.2",
  },
  {
    name: "Tooltip",
    slug: "tooltip",
    description: "A short label for a control.",
    category: "overlay",
    introducedIn: "0.2",
  },
];

/** v0.2 ships this many components, with forms as the main focus. */
export const targetComponentCount = 29;

export function componentHref(slug: string) {
  return `/components/${slug}`;
}

export function componentIsNew(component: ComponentMeta) {
  return component.introducedIn === currentVersion;
}

export function newComponents() {
  return components.filter(componentIsNew);
}

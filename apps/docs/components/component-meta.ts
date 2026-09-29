export type ComponentCategory =
  | "form"
  | "feedback"
  | "layout"
  | "navigation"
  | "display"
  | "overlay"
  | "utility";

/** The docs version whose additions count as New Components. */
export const currentVersion = "1.1.0";

export type ReleaseVersion = "0.1" | "1.0.0" | "1.1.0";

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
    introducedIn: "1.0.0",
  },
  {
    name: "Alert",
    slug: "alert",
    description: "A notice for a status that should be announced.",
    category: "feedback",
    introducedIn: "1.0.0",
  },
  {
    name: "Aspect Ratio",
    slug: "aspect-ratio",
    description: "Displays content within a desired ratio.",
    category: "layout",
    introducedIn: "1.1.0",
  },
  {
    name: "Attachment",
    slug: "attachment",
    description: "A file or image chip with media, metadata, and actions.",
    category: "display",
    introducedIn: "1.1.0",
  },
  {
    name: "Avatar",
    slug: "avatar",
    description: "An image with a fallback for a person or entity.",
    category: "display",
    introducedIn: "1.0.0",
  },
  {
    name: "Badge",
    slug: "badge",
    description: "A compact label for status or category.",
    category: "display",
    introducedIn: "1.0.0",
  },
  {
    name: "Breadcrumb",
    slug: "breadcrumb",
    description: "A trail of links for the current page.",
    category: "navigation",
    introducedIn: "1.0.0",
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
    introducedIn: "1.0.0",
  },
  {
    name: "Checkbox",
    slug: "checkbox",
    description: "A native checkbox control for selecting one or more options.",
    category: "form",
    introducedIn: "1.0.0",
  },
  {
    name: "Command",
    slug: "command",
    description: "A searchable list of actions and pages.",
    category: "navigation",
    introducedIn: "1.0.0",
  },
  {
    name: "Dialog",
    slug: "dialog",
    description: "A modal panel for a focused task.",
    category: "overlay",
    introducedIn: "1.0.0",
  },
  {
    name: "Dropdown Menu",
    slug: "dropdown-menu",
    description: "A menu of actions anchored to a button.",
    category: "overlay",
    introducedIn: "1.0.0",
  },
  {
    name: "File Upload",
    slug: "file-upload",
    description: "A native file picker with drag and drop.",
    category: "form",
    introducedIn: "1.0.0",
  },
  {
    name: "Hover Card",
    slug: "hover-card",
    description: "A preview that opens on hover or focus.",
    category: "overlay",
    introducedIn: "1.0.0",
  },
  {
    name: "Input",
    slug: "input",
    description: "A styled native input for single-line user input.",
    category: "form",
    introducedIn: "1.0.0",
  },
  {
    name: "Input Group",
    slug: "input-group",
    description: "A field with icons, addons, and actions.",
    category: "form",
    introducedIn: "1.0.0",
  },
  {
    name: "Input OTP",
    slug: "input-otp",
    description: "A grouped one-time code field.",
    category: "form",
    introducedIn: "1.0.0",
  },
  {
    name: "Kbd",
    slug: "kbd",
    description: "A compact label for a keyboard key.",
    category: "display",
    introducedIn: "1.0.0",
  },
  {
    name: "Label",
    slug: "label",
    description: "An accessible label for form controls.",
    category: "form",
    introducedIn: "1.0.0",
  },
  {
    name: "Marker",
    slug: "marker",
    description: "An inline status, bordered row, or labeled divider.",
    category: "utility",
    introducedIn: "1.0.0",
  },
  {
    name: "Native Select",
    slug: "native-select",
    description: "A composed native select with options and groups.",
    category: "form",
    introducedIn: "1.0.0",
  },
  {
    name: "Popover",
    slug: "popover",
    description: "A floating panel with interactive content.",
    category: "overlay",
    introducedIn: "1.0.0",
  },
  {
    name: "Progress",
    slug: "progress",
    description: "A native progress indicator for a known amount of work.",
    category: "feedback",
    introducedIn: "1.0.0",
  },
  {
    name: "Radio Group",
    slug: "radio-group",
    description: "A group of mutually exclusive selectable options.",
    category: "form",
    introducedIn: "1.0.0",
  },
  {
    name: "Scroll Area",
    slug: "scroll-area",
    description: "A native scroll container with a thin scrollbar.",
    category: "layout",
    introducedIn: "1.0.0",
  },
  {
    name: "Separator",
    slug: "separator",
    description: "A horizontal or vertical divider between content.",
    category: "layout",
    introducedIn: "1.0.0",
  },
  {
    name: "Skeleton",
    slug: "skeleton",
    description: "A placeholder shown while content is loading.",
    category: "display",
    introducedIn: "1.0.0",
  },
  {
    name: "Slider",
    slug: "slider",
    description: "A native range input for a value between two bounds.",
    category: "form",
    introducedIn: "1.0.0",
  },
  {
    name: "Spinner",
    slug: "spinner",
    description: "A small loading indicator.",
    category: "feedback",
    introducedIn: "1.0.0",
  },
  {
    name: "Switch",
    slug: "switch",
    description: "A switch for a binary setting.",
    category: "form",
    introducedIn: "1.0.0",
  },
  {
    name: "Table",
    slug: "table",
    description: "A semantic table for rows and columns.",
    category: "display",
    introducedIn: "1.0.0",
  },
  {
    name: "Tabs",
    slug: "tabs",
    description: "A set of panels that share one visible view at a time.",
    category: "navigation",
    introducedIn: "1.1.0",
  },
  {
    name: "Textarea",
    slug: "textarea",
    description: "A styled multiline text input.",
    category: "form",
    introducedIn: "1.0.0",
  },
  {
    name: "Toast",
    slug: "toast",
    description: "A temporary notice.",
    category: "feedback",
    introducedIn: "1.0.0",
  },
  {
    name: "Tooltip",
    slug: "tooltip",
    description: "A short label for a control.",
    category: "overlay",
    introducedIn: "1.0.0",
  },
  {
    name: "Typography",
    slug: "typography",
    description: "Semantic text styles for titles, body, and supporting copy.",
    category: "display",
    introducedIn: "1.0.0",
  },
];

/** v1.0.0 ships the full catalog. The progress max matches that count. */
export const targetComponentCount = components.length;

export const categoryOrder = [
  ["form", "Forms"],
  ["feedback", "Feedback"],
  ["layout", "Layout"],
  ["navigation", "Navigation"],
  ["display", "Data Display"],
  ["overlay", "Overlays"],
  ["utility", "Utilities"],
] as const;

export function componentsInCategory(category: ComponentCategory) {
  return components.filter((component) => component.category === category);
}

export function componentHref(slug: string) {
  return `/components/${slug}`;
}

export function componentIsNew(component: ComponentMeta) {
  return component.introducedIn === currentVersion;
}

export function newComponents() {
  return components.filter(componentIsNew);
}

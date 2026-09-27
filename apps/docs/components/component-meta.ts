export type ComponentCategory =
  "form" | "feedback" | "layout" | "navigation" | "display" | "overlay";

export type ComponentMeta = {
  name: string;
  slug: string;
  description: string;
  category: ComponentCategory;
  isNew?: boolean;
};

/**
 * Alphabetical catalog. Sidebar, New Components, and All Components read this list.
 * isNew is only for components that were just added, not the whole catalog.
 */
export const components: readonly ComponentMeta[] = [
  {
    name: "Avatar",
    slug: "avatar",
    description: "An image with a fallback for a person or entity.",
    category: "display",
    isNew: true,
  },
  {
    name: "Button",
    slug: "button",
    description: "A versatile button primitive for actions and commands.",
    category: "form",
  },
  {
    name: "Checkbox",
    slug: "checkbox",
    description: "A native checkbox control for selecting one or more options.",
    category: "form",
    isNew: true,
  },
  {
    name: "Input",
    slug: "input",
    description: "A styled native input for single-line user input.",
    category: "form",
  },
  {
    name: "Kbd",
    slug: "kbd",
    description: "A compact label for a keyboard key.",
    category: "display",
    isNew: true,
  },
  {
    name: "Label",
    slug: "label",
    description: "An accessible label for form controls.",
    category: "form",
  },
  {
    name: "Progress",
    slug: "progress",
    description: "A native progress indicator for a known amount of work.",
    category: "feedback",
    isNew: true,
  },
  {
    name: "Radio Group",
    slug: "radio-group",
    description: "A group of mutually exclusive selectable options.",
    category: "form",
    isNew: true,
  },
  {
    name: "Separator",
    slug: "separator",
    description: "A horizontal or vertical divider between content.",
    category: "layout",
    isNew: true,
  },
  {
    name: "Skeleton",
    slug: "skeleton",
    description: "A placeholder shown while content is loading.",
    category: "display",
    isNew: true,
  },
  {
    name: "Textarea",
    slug: "textarea",
    description: "A styled multiline text input.",
    category: "form",
  },
];

export function componentHref(slug: string) {
  return `/components/${slug}`;
}

export function newComponents() {
  return components.filter((component) => component.isNew);
}

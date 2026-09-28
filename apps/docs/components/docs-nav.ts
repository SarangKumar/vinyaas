import {
  categoryOrder,
  componentHref,
  componentIsNew,
  componentsInCategory,
  type ComponentMeta,
} from "@/components/component-meta";
import type { NavIconName } from "@/components/icons";

export const githubUrl = "https://github.com/SarangKumar/vinyaas";

/** Future component and block showcase. Intentionally empty for now. */
export const homePath = "/";

/** Canonical introduction. It is not an alias of the homepage. */
export const introductionPath = "/introduction";

export type DocsNavItem = {
  title: string;
  href: string;
  description?: string;
  isNew?: boolean;
  icon?: NavIconName;
};

export type DocsNavSection = {
  title: string;
  icon: NavIconName;
  items: DocsNavItem[];
};

export type DocsNavGroup = {
  title: string;
  items?: DocsNavItem[];
  sections?: DocsNavSection[];
};

function componentNavItem(component: ComponentMeta): DocsNavItem {
  return {
    title: component.name,
    href: componentHref(component.slug),
    description: component.description,
    isNew: componentIsNew(component),
  };
}

const categoryIcons: Record<(typeof categoryOrder)[number][0], NavIconName> = {
  form: "forms",
  feedback: "feedback",
  layout: "layout",
  navigation: "navigation",
  display: "display",
  overlay: "overlays",
  utility: "utilities",
};

export const docsNav: DocsNavGroup[] = [
  {
    title: "Getting Started",
    items: [
      { title: "Introduction", href: introductionPath, icon: "book" },
      { title: "Installation", href: "/installation", icon: "terminal" },
      { title: "Changelog", href: "/changelog", icon: "book" },
    ],
  },
  {
    title: "Components",
    sections: categoryOrder.map(([category, title]) => ({
      title,
      icon: categoryIcons[category],
      items: componentsInCategory(category).map(componentNavItem),
    })),
  },
  {
    title: "CLI",
    items: [
      { title: "Installation", href: "/installation#cli", icon: "terminal" },
      { title: "init", href: "/installation#init", icon: "terminal" },
      { title: "add", href: "/installation#add", icon: "terminal" },
      { title: "Registry", href: "/installation#registry", icon: "terminal" },
    ],
  },
  {
    title: "Resources",
    items: [
      {
        title: "Examples",
        href: "/components#using-components",
        icon: "layout",
      },
      {
        title: "API Reference",
        href: "/components#all-components",
        icon: "book",
      },
    ],
  },
];

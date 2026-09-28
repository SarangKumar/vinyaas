import {
  componentHref,
  componentIsNew,
  components,
  type ComponentMeta,
} from "@/components/component-meta";
import type { NavIconName } from "@/components/icons";

export const githubUrl = "https://github.com/SarangKumar/vinyaas";

/** Future component and block showcase. Intentionally empty for now. */
export const homePath = "/";

/** Canonical introduction. It is not an alias of the homepage. */
export const introductionPath = "/introduction";

export const componentsJsonPath = "/components-json";

export type DocsNavItem = {
  title: string;
  href: string;
  description?: string;
  isNew?: boolean;
  icon?: NavIconName;
};

export type DocsNavGroup = {
  title: string;
  /** Section label above child links. Direct destinations leave this unset. */
  label?: boolean;
  icon?: NavIconName;
  items: DocsNavItem[];
};

function componentNavItem(component: ComponentMeta): DocsNavItem {
  return {
    title: component.name,
    href: componentHref(component.slug),
    description: component.description,
    isNew: componentIsNew(component),
  };
}

export const docsNav: DocsNavGroup[] = [
  {
    title: "Introduction",
    items: [{ title: "Introduction", href: introductionPath, icon: "book" }],
  },
  {
    title: "Components",
    label: true,
    icon: "components",
    items: [...components]
      .sort((a, b) => a.name.localeCompare(b.name))
      .map(componentNavItem),
  },
  {
    title: "GET STARTED",
    label: true,
    icon: "terminal",
    items: [
      {
        title: "Installation",
        href: "/installation",
        icon: "terminal",
      },
      {
        title: "components.json",
        href: componentsJsonPath,
        icon: "file",
      },
      {
        title: "CLI",
        href: "/installation#cli",
        icon: "terminal",
      },
    ],
  },
  {
    title: "Changelog",
    items: [{ title: "Changelog", href: "/changelog", icon: "book" }],
  },
];

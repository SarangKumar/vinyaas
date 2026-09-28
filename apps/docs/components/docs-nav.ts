import {
  componentHref,
  componentIsNew,
  components,
  type ComponentMeta,
} from "@/components/component-meta";

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
};

export type DocsNavGroup = {
  title: string;
  /** Section label above child links. A single destination leaves this unset. */
  label?: boolean;
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
    items: [{ title: "Introduction", href: introductionPath }],
  },
  {
    title: "Components",
    label: true,
    items: [...components]
      .sort((a, b) => a.name.localeCompare(b.name))
      .map(componentNavItem),
  },
  {
    title: "Get Started",
    label: true,
    items: [
      { title: "Installation", href: "/installation" },
      { title: "components.json", href: componentsJsonPath },
      { title: "CLI", href: "/installation#cli" },
    ],
  },
  {
    title: "Resources",
    label: true,
    items: [{ title: "Changelog", href: "/changelog" }],
  },
];

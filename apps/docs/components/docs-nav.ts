import {
  componentHref,
  components,
  type ComponentMeta,
} from "@/components/component-meta";

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
};

function componentNavItem(component: ComponentMeta): DocsNavItem {
  return {
    title: component.name,
    href: componentHref(component.slug),
    description: component.description,
    isNew: component.isNew,
  };
}

export const docsNav: { title: string; items: DocsNavItem[] }[] = [
  {
    title: "Getting Started",
    items: [
      { title: "Introduction", href: introductionPath },
      { title: "Installation", href: "/installation" },
      { title: "Changelog", href: "/changelog" },
    ],
  },
  {
    title: "Components",
    items: components.map(componentNavItem),
  },
];

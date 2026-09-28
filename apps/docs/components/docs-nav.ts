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

export const componentsPath = "/components";

export const componentsJsonPath = "/components-json";

export type DocsNavItem = {
  title: string;
  href: string;
  description?: string;
  isNew?: boolean;
};

export type DocsNavGroup = {
  title: string;
  /** Section label above child links. */
  label?: boolean;
  /** Dense name grid when the container is wide enough. */
  layout?: "names";
  items: DocsNavItem[];
};

function componentNavItem(component: ComponentMeta): DocsNavItem {
  return {
    title: component.name,
    href: componentHref(component.slug),
    isNew: componentIsNew(component),
  };
}

export const cliPath = "/installation#cli";

export const changelogPath = "/changelog";

export const docsNav: DocsNavGroup[] = [
  {
    title: "SECTIONS",
    label: true,
    items: [
      { title: "Installation", href: "/installation" },
      { title: "CLI", href: cliPath },
    ],
  },
  {
    title: "COMPONENTS",
    label: true,
    layout: "names",
    items: [...components]
      .sort((a, b) => a.name.localeCompare(b.name))
      .map(componentNavItem),
  },
  {
    title: "GET STARTED",
    label: true,
    items: [
      { title: "Introduction", href: introductionPath },
      { title: "Components", href: componentsPath },
      { title: "components.json", href: componentsJsonPath },
    ],
  },
  {
    title: "RESOURCES",
    label: true,
    items: [{ title: "Changelog", href: changelogPath }],
  },
];

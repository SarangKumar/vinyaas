import {
  componentHref,
  componentIsNew,
  components,
  type ComponentMeta,
} from "@/components/component-meta";
import { installationFrameworks } from "@/lib/installation/frameworks";

export const githubUrl = "https://github.com/SarangKumar/vinyaas";

/** Future component and block showcase. Intentionally empty for now. */
export const homePath = "/";

/** Canonical introduction. It is not an alias of the homepage. */
export const introductionPath = "/introduction";

export const componentsPath = "/components";

export const componentsJsonPath = "/components-json";

export const installationPath = "/installation";

export const themesPath = "/themes";

export const typesetPath = "/typeset";

export type DocsNavItem = {
  title: string;
  href: string;
  description?: string;
  isNew?: boolean;
  /** Nested links (e.g. framework installation guides). */
  children?: DocsNavItem[];
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

/** Start of the installation flow (framework selection). */
export const cliPath = installationPath;

export const changelogPath = "/changelog";

export const docsNav: DocsNavGroup[] = [
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
      {
        title: "Installation",
        href: installationPath,
        children: installationFrameworks.map((framework) => ({
          title: framework.name,
          href: framework.href,
        })),
      },
      { title: "components.json", href: componentsJsonPath },
      { title: "CLI", href: cliPath },
      { title: "Themes", href: themesPath },
      { title: "Typeset", href: typesetPath },
    ],
  },
  {
    title: "RESOURCES",
    label: true,
    items: [{ title: "Changelog", href: changelogPath }],
  },
];

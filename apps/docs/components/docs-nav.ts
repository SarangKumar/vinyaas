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

export const componentsPath = "/components";

export const componentsJsonPath = "/components-json";

export const installationPath = "/installation";

export const cliPath = "/cli";

/** Named registry catalogs for discovery and bulk install. */
export const catalogsPath = "/catalogs";

/** Accessibility contract for registry components. */
export const accessibilityPath = "/accessibility";

/** Companion feature area (separate from registry UI components). */
export const companionPath = "/companion";

export const companionInstallationPath = "/companion/installation";

/** Docs page for companion.json configuration. */
export const companionJsonPath = "/companion/configuration";

export const companionCustomPath = "/companion/custom";

export const companionAnimationsPath = "/companion/animations";

export const companionInteractionsPath = "/companion/interactions";

export const companionExamplesPath = "/companion/examples";

export const companionGalleryPath = "/companion/gallery";

/** Theme system documentation (tokens, CSS variables, customization). */
export const themingPath = "/theming";

/** Visual theme playground / showcase. */
export const themesPath = "/themes";

/** Typeset documentation (content rhythm and Markdown presentation). */
export const typesetPath = "/typeset";

/** Typeset playground / showcase. */
export const typesetPlaygroundPath = "/typeset/playground";

export const packageImportPath = "/package-import";

export const darkModePath = "/dark-mode";

export const changelogPath = "/changelog";

export type DocsNavItem = {
  title: string;
  href: string;
  description?: string;
  /** Subtle status mark (e.g. beta). */
  indicator?: "beta";
  /** Nested links. Prefer flat items — avoid third-level nesting. */
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
  };
}

export const docsNav: DocsNavGroup[] = [
  {
    title: "SECTIONS",
    label: true,
    items: [
      { title: "Home", href: homePath },
      { title: "Introduction", href: introductionPath },
      { title: "Components", href: componentsPath },
      { title: "Installation", href: installationPath },
      { title: "CLI", href: cliPath },
      { title: "Catalogs", href: catalogsPath },
      { title: "Accessibility", href: accessibilityPath },
      { title: "Theming", href: themingPath },
      { title: "Typeset", href: typesetPath },
      { title: "Changelog", href: changelogPath },
    ],
  },
  {
    title: "COMPANION",
    label: true,
    items: [
      { title: "Introduction", href: companionPath, indicator: "beta" },
      { title: "Installation", href: companionInstallationPath },
      { title: "companion.json", href: companionJsonPath },
      { title: "Animations", href: companionAnimationsPath },
      { title: "Interactions", href: companionInteractionsPath },
      { title: "Custom Companion", href: companionCustomPath },
      { title: "Examples", href: companionExamplesPath },
      { title: "Gallery", href: companionGalleryPath },
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
      { title: "Installation", href: installationPath },
      { title: "components.json", href: componentsJsonPath },
      { title: "Theming", href: themingPath },
      { title: "Typeset", href: typesetPath },
      { title: "Package Import", href: packageImportPath },
      { title: "Dark Mode", href: darkModePath },
      { title: "CLI", href: cliPath },
    ],
  },
];

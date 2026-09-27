export const githubUrl = "https://github.com/SarangKumar/vinyaas";

/**
 * `/` is the introduction. A future showcase can take this path, and the
 * introduction can move, without changing header call sites.
 */
export const introductionPath = "/";

export type DocsNavItem = {
  title: string;
  href: string;
  description?: string;
  isNew?: boolean;
};

export const docsNav: { title: string; items: DocsNavItem[] }[] = [
  {
    title: "Getting Started",
    items: [
      { title: "Introduction", href: introductionPath },
      { title: "Installation", href: "/installation" },
    ],
  },
  {
    title: "Components",
    items: [
      {
        title: "Button",
        href: "/components/button",
        description: "A versatile button primitive for actions and commands.",
        isNew: true,
      },
      {
        title: "Checkbox",
        href: "/components/checkbox",
        description:
          "A native checkbox control for selecting one or more options.",
        isNew: true,
      },
      {
        title: "Input",
        href: "/components/input",
        description: "A styled native input for single-line user input.",
        isNew: true,
      },
      {
        title: "Label",
        href: "/components/label",
        description: "An accessible label for form controls.",
        isNew: true,
      },
      {
        title: "Radio Group",
        href: "/components/radio-group",
        description: "A group of mutually exclusive selectable options.",
        isNew: true,
      },
      {
        title: "Textarea",
        href: "/components/textarea",
        description: "A styled multiline text input.",
        isNew: true,
      },
    ],
  },
];

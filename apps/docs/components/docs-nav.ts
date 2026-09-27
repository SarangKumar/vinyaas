export const githubUrl = "https://github.com/SarangKumar/vinyaas";

export type DocsNavItem = {
  title: string;
  href: string;
  isNew?: boolean;
};

export const docsNav: { title: string; items: DocsNavItem[] }[] = [
  {
    title: "Getting Started",
    items: [
      { title: "Introduction", href: "/" },
      { title: "Installation", href: "/installation" },
    ],
  },
  {
    title: "Components",
    items: [
      { title: "Button", href: "/components/button", isNew: true },
      { title: "Input", href: "/components/input", isNew: true },
      { title: "Textarea", href: "/components/textarea", isNew: true },
    ],
  },
];

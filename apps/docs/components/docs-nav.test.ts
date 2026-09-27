import { describe, expect, it } from "vitest";

import { docsNav, githubUrl, introductionPath } from "./docs-nav";

describe("documentation navigation", () => {
  it("lists the getting started pages and the current components", () => {
    expect(githubUrl).toBe("https://github.com/SarangKumar/vinyaas");
    expect(introductionPath).toBe("/");
    expect(docsNav).toEqual([
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
          {
            title: "Button",
            href: "/components/button",
            description:
              "A versatile button primitive for actions and commands.",
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
    ]);
  });

  it("keeps component links in alphabetical order", () => {
    const titles =
      docsNav
        .find((group) => group.title === "Components")
        ?.items.map((item) => item.title) ?? [];

    expect(titles).toEqual([
      "Button",
      "Checkbox",
      "Input",
      "Label",
      "Radio Group",
      "Textarea",
    ]);
  });
});

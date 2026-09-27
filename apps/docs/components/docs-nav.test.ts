import { describe, expect, it } from "vitest";

import { docsNav, githubUrl } from "./docs-nav";

describe("documentation navigation", () => {
  it("lists the getting started pages and the current components", () => {
    expect(githubUrl).toBe("https://github.com/SarangKumar/vinyaas");
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
          { title: "Button", href: "/components/button" },
          { title: "Input", href: "/components/input" },
        ],
      },
    ]);
  });
});

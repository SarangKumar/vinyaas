import { describe, expect, it } from "vitest";

import { components, currentVersion } from "@/components/component-meta";
import { docsNav, llmsTxtPath } from "@/components/docs-nav";

import { buildLlmsTxt } from "./llms";

describe("llm.txt", () => {
  it("lists the docs and every component with absolute links", () => {
    const text = buildLlmsTxt();

    expect(text.startsWith("# Vinyaas\n\n> ")).toBe(true);
    expect(text).toContain(`v${currentVersion}`);
    expect(text).toContain("- [CLI](https://vinyaas.vercel.app/cli)");

    for (const component of components) {
      expect(text).toContain(
        `[${component.name}](https://vinyaas.vercel.app/components/${component.slug})`,
      );
    }

    expect(text).not.toContain("(/");
    expect(text).not.toContain("llm.txt)");
  });

  it("is the last Get Started link in the sidebar", () => {
    const getStarted = docsNav.find((group) => group.title === "GET STARTED");

    expect(getStarted?.items.at(-1)).toEqual({
      title: "llm.txt",
      href: llmsTxtPath,
    });
  });
});

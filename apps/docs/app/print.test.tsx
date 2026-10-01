import { readFileSync } from "node:fs";
import path from "node:path";

import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { DocsShell } from "@/components/docs-shell";

const navigation = vi.hoisted(() => ({
  pathname: "/themes",
}));

vi.mock("next/navigation", () => ({
  usePathname: () => navigation.pathname,
  useRouter: () => ({ push: vi.fn() }),
}));

describe("docs print styles", () => {
  it("unlocks overflow and supports print-from-scroll offset", () => {
    const css = readFileSync(path.join(process.cwd(), "app/docs.css"), "utf8");

    expect(css).toContain("@media print");
    expect(css).toContain("overflow: visible !important");
    expect(css).toContain("--print-scroll-offset");
    expect(css).toContain("[data-print-from-scroll");
  });

  it("hides sidebars on themes and typeset showcase frames", () => {
    navigation.pathname = "/themes";

    const { unmount } = render(
      <DocsShell>
        <article data-page="themes">
          <h1>Themes</h1>
        </article>
      </DocsShell>,
    );

    expect(document.querySelector("[data-docs-frame]")).toHaveAttribute(
      "data-docs-frame",
      "themes",
    );
    expect(document.querySelector("[data-docs-sidebar]")).toBeNull();
    expect(document.querySelector("header")?.className).toContain(
      "print:hidden",
    );

    unmount();
    navigation.pathname = "/typeset/playground";

    render(
      <DocsShell>
        <article data-page="typeset-playground">
          <h1>Typeset</h1>
        </article>
      </DocsShell>,
    );

    expect(document.querySelector("[data-docs-frame]")).toHaveAttribute(
      "data-docs-frame",
      "typeset",
    );
    expect(document.querySelector("[data-docs-sidebar]")).toBeNull();
  });

  it("keeps the typeset documentation page in the docs frame", () => {
    navigation.pathname = "/typeset";

    render(
      <DocsShell>
        <article data-page="typeset">
          <h1>Typeset</h1>
        </article>
      </DocsShell>,
    );

    expect(document.querySelector("[data-docs-frame]")).toHaveAttribute(
      "data-docs-frame",
      "docs",
    );
    expect(document.querySelector("[data-docs-sidebar]")).not.toBeNull();
  });
});

import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import {
  playgroundColumnItemClassName,
  playgroundColumnsClassName,
  playgroundDenseChromeInlineClassName,
  playgroundDenseChromeShowClassName,
  playgroundShowcaseColumnClassName,
  playgroundShowcaseGridClassName,
} from "./playground-layout";

const docsCss = readFileSync(
  path.join(path.dirname(fileURLToPath(import.meta.url)), "../../app/docs.css"),
  "utf8",
);

describe("playground layout utilities", () => {
  it("registers shared playground breakpoints in docs.css", () => {
    expect(docsCss).toContain("--breakpoint-playground: 87.5rem");
    expect(docsCss).toContain("--breakpoint-playground-wide: 118.75rem");
  });

  it("encodes shared Themes/Typeset masonry up to 4 columns", () => {
    expect(playgroundColumnsClassName).toContain("columns-1");
    expect(playgroundColumnsClassName).toContain("md:columns-2");
    expect(playgroundColumnsClassName).toContain("lg:columns-3");
    expect(playgroundColumnsClassName).toContain("xl:columns-4");
    expect(playgroundColumnsClassName).not.toContain("columns-5");
    expect(playgroundColumnItemClassName).toContain("break-inside-avoid");
  });

  it("encodes homepage shadcn-style grid of flex columns up to 5", () => {
    expect(playgroundShowcaseGridClassName).toContain("grid");
    expect(playgroundShowcaseGridClassName).toContain("md:grid-cols-2");
    expect(playgroundShowcaseGridClassName).toContain("lg:grid-cols-3");
    expect(playgroundShowcaseGridClassName).toContain(
      "min-[1400px]:grid-cols-4!",
    );
    expect(playgroundShowcaseGridClassName).toContain(
      "min-[1900px]:grid-cols-5!",
    );
    expect(playgroundShowcaseGridClassName).toContain("xl:max-w-[1600px]");
    expect(playgroundShowcaseGridClassName).toContain("2xl:max-w-[1900px]");
    expect(playgroundShowcaseColumnClassName.base).toContain("flex-col");
    expect(playgroundShowcaseColumnClassName.md).toContain("md:flex");
    expect(playgroundShowcaseColumnClassName.lg).toContain("lg:flex");
    expect(playgroundShowcaseColumnClassName.wide).toContain(
      "min-[1400px]:flex",
    );
    expect(playgroundShowcaseColumnClassName.ultra).toContain(
      "min-[1900px]:flex",
    );
  });

  it("shows Typeset inline options above 1400px", () => {
    expect(playgroundDenseChromeShowClassName).toBe("min-[1400px]:hidden");
    expect(playgroundDenseChromeInlineClassName).toContain("min-[1400px]:flex");
  });
});

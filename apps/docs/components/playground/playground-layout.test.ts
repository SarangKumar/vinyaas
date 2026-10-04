import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import {
  playgroundColumnItemClassName,
  playgroundColumnsClassName,
  playgroundDenseChromeInlineClassName,
  playgroundDenseChromeShowClassName,
  playgroundShowcaseColumnsClassName,
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

  it("encodes shared Pinterest CSS-columns masonry up to 4 columns", () => {
    expect(playgroundColumnsClassName).toContain("columns-1");
    expect(playgroundColumnsClassName).toContain("md:columns-2");
    expect(playgroundColumnsClassName).toContain("lg:columns-3");
    expect(playgroundColumnsClassName).toContain("xl:columns-4");
    expect(playgroundColumnsClassName).not.toContain("columns-5");
    expect(playgroundColumnItemClassName).toContain("break-inside-avoid");
    expect(playgroundColumnItemClassName).toContain("mb-(--gap)");
  });

  it("allows a fifth homepage column at 1900px for side-blur desktops", () => {
    expect(playgroundShowcaseColumnsClassName).toBe("min-[1900px]:columns-5!");
  });

  it("shows Typeset inline options above 1400px", () => {
    expect(playgroundDenseChromeShowClassName).toBe("min-[1400px]:hidden");
    expect(playgroundDenseChromeInlineClassName).toContain("min-[1400px]:flex");
  });
});

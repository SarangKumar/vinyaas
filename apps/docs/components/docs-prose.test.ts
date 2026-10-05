import { describe, expect, it } from "vitest";

import { docsBodyClassName, docsMutedBodyClassName } from "./docs-prose";

describe("docs prose typography", () => {
  it("uses the shared documentation body scale", () => {
    expect(docsBodyClassName).toContain("text-base");
    expect(docsBodyClassName).toContain("leading-7");
    expect(docsMutedBodyClassName).toContain("text-base");
    expect(docsMutedBodyClassName).toContain("leading-7");
    expect(docsBodyClassName).not.toContain("text-sm");
    expect(docsMutedBodyClassName).not.toContain("text-sm");
  });
});

import { describe, expect, it } from "vitest";

import {
  accessibilityContract,
  accessibilityTestConvention,
} from "./accessibility";

describe("accessibility contract", () => {
  it("covers the release-wide checklist topics", () => {
    const ids = accessibilityContract.map((item) => item.id);

    expect(ids).toEqual([
      "keyboard",
      "focus-visible",
      "focus-management",
      "escape",
      "activation",
      "aria",
      "name",
      "disabled",
      "loading",
      "touch",
      "motion",
      "no-trap",
    ]);

    for (const item of accessibilityContract) {
      expect(item.title.trim().length).toBeGreaterThan(0);
      expect(item.requirement.trim().length).toBeGreaterThan(16);
    }
  });

  it("includes a concise test convention", () => {
    expect(accessibilityTestConvention.length).toBeGreaterThan(2);
  });
});

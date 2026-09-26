import { describe, expect, it } from "vitest";

import { cn } from "./utils";

describe("cn", () => {
  it("combines classes", () => {
    expect(cn("px-4", "py-2")).toBe("px-4 py-2");
  });

  it("removes falsy values", () => {
    expect(cn("px-4", false && "px-8", undefined, null)).toBe("px-4");
  });

  it("resolves Tailwind conflicts", () => {
    expect(cn("bg-black", "bg-red-500")).toBe("bg-red-500");
    expect(cn("px-4", "px-8")).toBe("px-8");
  });
});

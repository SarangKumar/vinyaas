import { afterEach, describe, expect, it, vi } from "vitest";

import { portfolioUrl } from "./public-env";

describe("portfolioUrl", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("reads an http or https portfolio url", () => {
    vi.stubEnv("NEXT_PUBLIC_PORTFOLIO_URL", "https://sarangkumar.vercel.app");

    expect(portfolioUrl()).toBe("https://sarangkumar.vercel.app/");
  });

  it("returns null when the variable is missing or not a web url", () => {
    vi.stubEnv("NEXT_PUBLIC_PORTFOLIO_URL", "");
    expect(portfolioUrl()).toBeNull();

    vi.stubEnv("NEXT_PUBLIC_PORTFOLIO_URL", "javascript:alert(1)");
    expect(portfolioUrl()).toBeNull();
  });
});

import { describe, expect, it } from "vitest";

import { formatStarCount, githubRepoApiUrl } from "./github-link";

describe("github-link helpers", () => {
  it("builds the public repos API URL", () => {
    expect(githubRepoApiUrl("https://github.com/SarangKumar/vinyaas")).toBe(
      "https://api.github.com/repos/SarangKumar/vinyaas",
    );
    expect(githubRepoApiUrl("https://example.com/not-github")).toBeNull();
  });

  it("formats star counts for compact display", () => {
    expect(formatStarCount(12)).toBe("12");
    expect(formatStarCount(999)).toBe("999");
    expect(formatStarCount(1000)).toBe("1k");
    expect(formatStarCount(2400)).toBe("2.4k");
    expect(formatStarCount(12500)).toBe("13k");
  });
});

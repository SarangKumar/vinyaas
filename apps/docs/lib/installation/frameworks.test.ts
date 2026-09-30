import { describe, expect, it } from "vitest";

import {
  getInstallationFramework,
  installationFrameworkPaths,
  installationFrameworks,
} from "./frameworks";

describe("installation frameworks", () => {
  it("lists supported frameworks with CLI detection ids and routes", () => {
    expect(installationFrameworks.map((item) => item.id)).toEqual([
      "nextjs",
      "vite",
      "react",
    ]);
    expect(installationFrameworks.map((item) => item.cliId)).toEqual([
      "next",
      "vite",
      "react",
    ]);
    expect(installationFrameworkPaths()).toEqual([
      "/installation/nextjs",
      "/installation/vite",
      "/installation/react",
    ]);
    expect(getInstallationFramework("nextjs").name).toBe("Next.js");
    expect(getInstallationFramework("vite").preferredCss).toBe("src/index.css");
    expect(getInstallationFramework("react").supported).toBe(true);
  });
});

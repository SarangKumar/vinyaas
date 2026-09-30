import { describe, expect, it } from "vitest";

import {
  darkModeFrameworkHref,
  darkModeFrameworkPaths,
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

  it("exposes dark mode routes derived from framework ids", () => {
    expect(darkModeFrameworkHref("nextjs")).toBe("/dark-mode/nextjs");
    expect(darkModeFrameworkPaths()).toEqual([
      "/dark-mode/nextjs",
      "/dark-mode/vite",
      "/dark-mode/react",
    ]);
  });

  it("defines fresh, existing, and shadcn-style setups per framework", () => {
    for (const framework of installationFrameworks) {
      expect(framework.setups.map((setup) => setup.id)).toEqual([
        "fresh",
        "existing",
        "shadcn",
      ]);
      expect(framework.prerequisites.length).toBeGreaterThan(0);
    }

    const nextFresh = getInstallationFramework("nextjs").setups.find(
      (setup) => setup.id === "fresh",
    );
    expect(nextFresh?.preludeCommands).toContain("create-next-app@latest");
    expect(nextFresh?.preludeCommands).toContain("--typescript");

    const viteFresh = getInstallationFramework("vite").setups.find(
      (setup) => setup.id === "fresh",
    );
    expect(viteFresh?.preludeCommands).toContain("create vite@latest");
    expect(viteFresh?.preludeCommands).toContain("react-ts");

    const reactFresh = getInstallationFramework("react").setups.find(
      (setup) => setup.id === "fresh",
    );
    expect(reactFresh?.preludeCommands).toBeUndefined();
  });
});

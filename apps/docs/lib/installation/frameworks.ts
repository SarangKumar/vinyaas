/**
 * Framework guides for the installation docs.
 * Matches CLI detection labels: next → nextjs route, vite, react.
 */
export type InstallationFrameworkId = "nextjs" | "vite" | "react";

/** CLI `detectProject` framework values for cross-reference. */
export type CliFrameworkId = "next" | "vite" | "react";

export type InstallationFramework = {
  id: InstallationFrameworkId;
  /** CLI detection id (`next` for Next.js). */
  cliId: CliFrameworkId;
  name: string;
  description: string;
  href: string;
  supported: true;
  /** Preferred CSS path after init for this ecosystem. */
  preferredCss: string;
  /** Extra prerequisite notes shown on the guide. */
  prerequisites: string[];
};

export const installationFrameworks: InstallationFramework[] = [
  {
    id: "nextjs",
    cliId: "next",
    name: "Next.js",
    description: "React framework with App Router and Tailwind v4 support.",
    href: "/installation/nextjs",
    supported: true,
    preferredCss: "app/globals.css",
    prerequisites: [
      "Next.js App Router project (or Pages with a global stylesheet).",
      "TypeScript is recommended (`tsconfig.json`).",
      "Tailwind CSS v4 and a lockfile (pnpm, npm, yarn, or bun).",
      "An `@/*` path alias in `tsconfig.json` or `jsconfig.json`.",
    ],
  },
  {
    id: "vite",
    cliId: "vite",
    name: "React + Vite",
    description: "Vite + React apps with a CSS entry such as src/index.css.",
    href: "/installation/vite",
    supported: true,
    preferredCss: "src/index.css",
    prerequisites: [
      "A Vite + React project with `react` and `react-dom`.",
      "Tailwind CSS v4 wired to your CSS entry (often `src/index.css`).",
      "An `@/*` path alias in `tsconfig.json` or `jsconfig.json`.",
      "A package manager lockfile in the project root.",
    ],
  },
  {
    id: "react",
    cliId: "react",
    name: "React",
    description: "Other React projects that already use Tailwind CSS v4.",
    href: "/installation/react",
    supported: true,
    preferredCss: "src/index.css",
    prerequisites: [
      "`react` and `react-dom` declared in the project.",
      "Tailwind CSS v4 (v3 is not supported).",
      "A global stylesheet such as `app/globals.css`, `src/app/globals.css`, `src/index.css`, or `index.css`.",
      "An `@/*` path alias and a package manager lockfile.",
    ],
  },
];

export function getInstallationFramework(
  id: InstallationFrameworkId,
): InstallationFramework {
  const framework = installationFrameworks.find((item) => item.id === id);

  if (!framework) {
    throw new Error(`Unknown installation framework: ${id}`);
  }

  return framework;
}

export function installationFrameworkPaths(): string[] {
  return installationFrameworks.map((framework) => framework.href);
}

/**
 * Framework guides for the installation docs.
 * Matches CLI detection labels: next → nextjs route, vite, react.
 */
import {
  createNextAppCommands,
  createViteAppCommands,
  type PackageManagerCommands,
} from "@/components/package-managers";

export type InstallationFrameworkId = "nextjs" | "vite" | "react";

/** CLI `detectProject` framework values for cross-reference. */
export type CliFrameworkId = "next" | "vite" | "react";

export type ProjectSetupId = "fresh" | "existing" | "shadcn";

export type ProjectSetupOption = {
  id: ProjectSetupId;
  title: string;
  summary: string;
  /** Shell commands shown before `vinyaas init` (create-app / install). */
  preludeCommands?: PackageManagerCommands;
  bullets: string[];
};

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
  /** Fresh / existing / shadcn-style flows for this framework. */
  setups: ProjectSetupOption[];
};

const sharedExistingSetup = (
  summary: string,
  bullets: string[],
): ProjectSetupOption => ({
  id: "existing",
  title: "Existing project",
  summary,
  bullets,
});

const sharedShadcnSetup = (
  summary: string,
  bullets: string[],
): ProjectSetupOption => ({
  id: "shadcn",
  title: "Existing shadcn-style project",
  summary,
  bullets,
});

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
      "Node.js 20 or newer.",
      "TypeScript is recommended (`tsconfig.json`).",
      "A package manager lockfile (pnpm, npm, yarn, or bun) before `vinyaas add`.",
    ],
    setups: [
      {
        id: "fresh",
        title: "Fresh project",
        summary:
          "Create a new Next.js app with the recommended flags, then initialize Vinyaas.",
        preludeCommands: createNextAppCommands(),
        bullets: [
          "Creates the Next.js App Router application.",
          "Configures TypeScript, ESLint, and Tailwind.",
          "Sets the `@/*` import alias and `src/` layout.",
          "Then `vinyaas init` writes theme tokens, `components.json`, and utils.",
        ],
      },
      sharedExistingSetup(
        "You already have a Next.js app. Run init in the project root.",
        [
          "Detects Next.js when `next` is present.",
          "Detects TypeScript from `tsconfig.json`.",
          "Finds or prefers `app/globals.css` / `src/app/globals.css`.",
          "Creates `components.json` when missing; does not overwrite an existing one.",
        ],
      ),
      sharedShadcnSetup(
        "Your app already has a UI folder, aliases, or a similar registry layout.",
        [
          "Keeps existing structure where possible.",
          "Creates or updates Vinyaas configuration (`components.json`, theme tokens) when safe.",
          "Does not migrate or rewrite shadcn components automatically.",
          "Run `vinyaas init`, then add only the Vinyaas components you need.",
        ],
      ),
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
      "Node.js 20 or newer.",
      "Tailwind CSS v4 on your CSS entry before or right after init.",
      "An `@/*` path alias in `tsconfig.json` or `jsconfig.json`.",
      "A package manager lockfile in the project root.",
    ],
    setups: [
      {
        id: "fresh",
        title: "Fresh project",
        summary:
          "Scaffold Vite + React + TypeScript, install dependencies, add Tailwind v4, then initialize Vinyaas.",
        preludeCommands: createViteAppCommands(),
        bullets: [
          "Creates a Vite + React + TypeScript application.",
          "Install project dependencies, then wire Tailwind CSS v4 to `src/index.css`.",
          "Ensure an `@/*` alias exists before or during init.",
          "Then `vinyaas init` configures theme tokens, `components.json`, and utils.",
        ],
      },
      sharedExistingSetup(
        "You already have a Vite + React app. Run init from the project root.",
        [
          "Detects Vite when `vite` is present.",
          "Detects TypeScript from `tsconfig.json`.",
          "Looks for `src/index.css`, `index.css`, or existing app globals.",
          "Creates `components.json` when missing; does not overwrite an existing one.",
        ],
      ),
      sharedShadcnSetup(
        "Your Vite app already follows a shadcn-style components layout.",
        [
          "Keeps existing structure where possible.",
          "Creates or updates Vinyaas configuration when safe.",
          "Does not migrate existing UI files automatically.",
          "Run `vinyaas init`, then `vinyaas add` for the components you want.",
        ],
      ),
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
    setups: [
      {
        id: "fresh",
        title: "Fresh project",
        summary:
          "Scaffold any React app that meets the prerequisites, then initialize Vinyaas. There is no single create command for every React toolchain.",
        bullets: [
          "Create your React app with your preferred bundler or template.",
          "Add Tailwind CSS v4 and a global stylesheet.",
          "Configure an `@/*` path alias.",
          "Then `vinyaas init` prepares the registry config and theme tokens.",
        ],
      },
      sharedExistingSetup(
        "Your React app already has React, Tailwind v4, and a stylesheet. Run init in the root.",
        [
          "Used when neither `next` nor `vite` is detected.",
          "Detects TypeScript from `tsconfig.json` when present.",
          "Finds a supported CSS entry among the known candidates.",
          "Creates `components.json` when missing; does not overwrite an existing one.",
        ],
      ),
      sharedShadcnSetup(
        "Your React app already uses a similar UI registry layout.",
        [
          "Keeps existing folders and aliases where possible.",
          "Creates or updates Vinyaas configuration when safe.",
          "Does not migrate components from another registry automatically.",
          "Run `vinyaas init`, then add Vinyaas components as needed.",
        ],
      ),
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

export function darkModeFrameworkHref(
  id: InstallationFrameworkId,
): `/dark-mode/${InstallationFrameworkId}` {
  return `/dark-mode/${id}`;
}

export function darkModeFrameworkPaths(): string[] {
  return installationFrameworks.map((framework) =>
    darkModeFrameworkHref(framework.id),
  );
}

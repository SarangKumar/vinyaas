export const packageManagers = ["npm", "pnpm", "yarn", "bun"] as const;

export type PackageManager = (typeof packageManagers)[number];

export type PackageManagerCommands = Record<PackageManager, string>;

export function cliCommands(args: string): PackageManagerCommands {
  return {
    npm: `npx vinyaas ${args}`,
    pnpm: `pnpm dlx vinyaas ${args}`,
    yarn: `yarn dlx vinyaas ${args}`,
    bun: `bunx vinyaas ${args}`,
  };
}

export function packageInstallCommands(
  packageName: string,
): PackageManagerCommands {
  return {
    npm: `npm install ${packageName}`,
    pnpm: `pnpm add ${packageName}`,
    yarn: `yarn add ${packageName}`,
    bun: `bun add ${packageName}`,
  };
}

const nextAppFlags = `my-app \\
  --typescript \\
  --tailwind \\
  --eslint \\
  --app \\
  --src-dir \\
  --import-alias "@/*"

cd my-app`;

/** Fresh Next.js create-app commands per package manager. */
export function createNextAppCommands(): PackageManagerCommands {
  return {
    npm: `npx create-next-app@latest ${nextAppFlags}`,
    pnpm: `pnpm create next-app@latest ${nextAppFlags}`,
    yarn: `yarn create next-app ${nextAppFlags}`,
    bun: `bunx create-next-app@latest ${nextAppFlags}`,
  };
}

/** Fresh Vite + React + TypeScript scaffold commands per package manager. */
export function createViteAppCommands(): PackageManagerCommands {
  return {
    npm: `npm create vite@latest my-app -- --template react-ts
cd my-app
npm install`,
    pnpm: `pnpm create vite@latest my-app --template react-ts
cd my-app
pnpm install`,
    yarn: `yarn create vite my-app --template react-ts
cd my-app
yarn`,
    bun: `bun create vite@latest my-app --template react-ts
cd my-app
bun install`,
  };
}

export const packageManagers = ["npm", "pnpm", "yarn", "bun"] as const;

export type PackageManager = (typeof packageManagers)[number];

export type PackageManagerCommands = Record<PackageManager, string>;

export function cliCommands(args: string): PackageManagerCommands {
  return {
    npm: `npx @vinyaas/cli ${args}`,
    pnpm: `pnpm dlx @vinyaas/cli ${args}`,
    yarn: `yarn dlx @vinyaas/cli ${args}`,
    bun: `bunx @vinyaas/cli ${args}`,
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

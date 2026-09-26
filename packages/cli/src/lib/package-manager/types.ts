export const packageManagers = ["pnpm", "npm", "yarn", "bun"] as const;

export type PackageManager = (typeof packageManagers)[number];

/** One package-manager invocation. Arguments are separate from the command. */
export interface PackageManagerCommand {
  command: string;
  args: string[];
  cwd: string;
  env: NodeJS.ProcessEnv;
}

export type RunPackageManager = (
  command: PackageManagerCommand,
) => Promise<void>;

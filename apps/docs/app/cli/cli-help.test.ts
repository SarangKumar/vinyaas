import path from "node:path";

import { describe, expect, it } from "vitest";

import { cliHelp } from "./cli-help";

type HelpCommand = {
  name(): string;
  configureHelp(options: { helpWidth: number }): void;
  helpInformation(): string;
};

// Loaded at runtime so the docs typecheck does not pull in the CLI sources,
// which are typed against the CLI package's own Node environment.
const programModule = path.join(
  process.cwd(),
  "../../packages/cli/src/program.ts",
);

describe("CLI help on /cli", () => {
  it("matches the help each CLI command prints", async () => {
    const { createProgram } = (await import(
      /* @vite-ignore */ programModule
    )) as { createProgram: () => { commands: HelpCommand[] } };
    const program = createProgram();
    const names = program.commands.map((command) => command.name()).sort();

    expect(Object.keys(cliHelp).sort()).toEqual(names);

    for (const command of program.commands) {
      command.configureHelp({ helpWidth: 80 });
      expect(cliHelp[command.name() as keyof typeof cliHelp]).toBe(
        command.helpInformation().trimEnd(),
      );
    }
  });
});

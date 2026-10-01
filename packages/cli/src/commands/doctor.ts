import { Command } from "commander";

import { CliError } from "../lib/cli-error.ts";
import { formatDoctorReport, runDoctorChecks } from "../lib/doctor/checks.ts";
import { resolveProjectRoot } from "../lib/project/cwd.ts";

export function registerDoctorCommand(program: Command): void {
  program
    .command("doctor")
    .description("Validate an existing Vinyaas project setup.")
    .option("--cwd <path>", "Consumer project directory.")
    .option("--json", "Print machine-readable JSON to stdout.")
    .addHelpText(
      "after",
      [
        "",
        "Examples:",
        "  $ vinyaas doctor",
        "  $ vinyaas doctor --json",
        "  $ vinyaas doctor --cwd ./my-app",
      ].join("\n"),
    )
    .action(async (options: { cwd?: string; json?: boolean }) => {
      try {
        const report = await executeDoctor({
          cwd: options.cwd,
          json: options.json === true,
        });

        if (!report.ok) {
          process.exitCode = 1;
        }
      } catch (error) {
        if (error instanceof CliError) {
          console.error(error.message);
          process.exit(1);
        }

        throw error;
      }
    });
}

export async function executeDoctor({
  cwd,
  from = process.cwd(),
  json = false,
  env = process.env,
  fetch: fetchImpl,
}: {
  cwd?: string;
  from?: string;
  json?: boolean;
  env?: Record<string, string | undefined>;
  fetch?: typeof fetch;
}): Promise<{ ok: boolean }> {
  const projectRoot = await resolveProjectRoot(cwd, from);
  const report = await runDoctorChecks(projectRoot, {
    env,
    fetch: fetchImpl,
  });

  if (json) {
    console.log(JSON.stringify(report, null, 2));
  } else {
    console.log(formatDoctorReport(report));
  }

  return { ok: report.ok };
}

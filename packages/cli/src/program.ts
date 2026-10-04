import { Command } from "commander";

import { registerAddCommand } from "./commands/add.js";
import { registerCatalogCommand } from "./commands/catalog.js";
import { registerDoctorCommand } from "./commands/doctor.js";
import { registerInfoCommand } from "./commands/info.js";
import { registerInitCommand } from "./commands/init.js";
import { registerListCommand } from "./commands/list.js";
import { registerSearchCommand } from "./commands/search.js";
import { registerStatusCommand } from "./commands/status.js";
import { readPackageVersion } from "./lib/version.js";

export { readPackageVersion };

/** Builds the Vinyaas CLI. Subcommands register on the returned program. */
export function createProgram(): Command {
  const program = new Command()
    .name("vinyaas")
    .description(
      "Install and discover Vinyaas UI components from the registry.",
    )
    .version(readPackageVersion())
    .showSuggestionAfterError(true);

  registerInitCommand(program);
  registerAddCommand(program);
  registerCatalogCommand(program);
  registerListCommand(program);
  registerSearchCommand(program);
  registerInfoCommand(program);
  registerStatusCommand(program);
  registerDoctorCommand(program);

  return program;
}

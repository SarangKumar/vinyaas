/**
 * `vinyaas <command> --help` output (Commander, 80 columns), rendered on /cli.
 * Generated from packages/cli/src/program.ts; app/cli/cli-help.test.ts fails
 * when it drifts. Regenerate by copying `helpInformation()` for each command.
 */
export const cliHelp = {
  init: "Usage: vinyaas init [options]\n\nPrepare a React project for Vinyaas (Tailwind v4, theme CSS, aliases,\ncomponents.json).\n\nOptions:\n  --cwd <path>  Consumer project directory.\n  -y, --yes     Skip prompts and use safe defaults.\n  -h, --help    display help for command",
  add: "Usage: vinyaas add [options] [name...]\n\nAdd one or more components from the Vinyaas registry.\n\nArguments:\n  name                   Component names to install\n\nOptions:\n  --cwd <path>           Consumer project directory.\n  --force                Overwrite existing component files instead of skipping\n                         them.\n  --dry-run              Resolve the install plan and print it without writing\n                         files or installing packages.\n  --catalog <catalog>    Install every component in a named registry catalog.\n  --category <category>  Install every component in a registry category.\n  -y, --yes              Skip confirmation prompts.\n  -h, --help             display help for command",
  update:
    "Usage: vinyaas update|upgrade [options] [name...]\n\nUpdate installed components to the latest registry versions (alias: upgrade).\n\nArguments:\n  name          Component names to update. Omit to update every installed\n                component.\n\nOptions:\n  --cwd <path>  Consumer project directory.\n  --dry-run     Resolve the update plan and print it without writing files.\n  -y, --yes     Skip confirmation prompts.\n  -h, --help    display help for command",
  catalog:
    "Usage: vinyaas catalog [options] [command]\n\nList and inspect named component catalogs from the registry.\n\nOptions:\n  -h, --help                display help for command\n\nCommands:\n  list [options]            List available component catalogs.\n  info [options] <catalog>  Show details for one component catalog.\n  help [command]            display help for command",
  list: "Usage: vinyaas list [options]\n\nList installable components from the Vinyaas registry.\n\nOptions:\n  --json                 Print machine-readable JSON to stdout.\n  --category <category>  Filter components by registry category.\n  -h, --help             display help for command",
  search:
    "Usage: vinyaas search [options] <query>\n\nSearch registry components by name or description.\n\nArguments:\n  query                  Search query\n\nOptions:\n  --json                 Print machine-readable JSON to stdout.\n  --category <category>  Limit search to a registry category.\n  -h, --help             display help for command",
  info: "Usage: vinyaas info [options] <component>\n\nShow registry details for a component before installing it.\n\nArguments:\n  component   Component name\n\nOptions:\n  --json      Print machine-readable JSON to stdout.\n  -h, --help  display help for command",
  status:
    "Usage: vinyaas status [options]\n\nShow components installed by Vinyaas in this project.\n\nOptions:\n  --cwd <path>  Consumer project directory.\n  --json        Print machine-readable JSON to stdout.\n  -h, --help    display help for command",
  doctor:
    "Usage: vinyaas doctor [options]\n\nValidate an existing Vinyaas project setup.\n\nOptions:\n  --cwd <path>  Consumer project directory.\n  --json        Print machine-readable JSON to stdout.\n  -h, --help    display help for command",
} as const;

export type CliHelpCommand = keyof typeof cliHelp;

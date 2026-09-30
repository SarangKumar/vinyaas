import type { DependencyInstallPlan } from "../dependencies/classify.ts";
import type { InstallPlan } from "../install-plan.ts";

export interface AddSummaryInput {
  plan: InstallPlan;
  dependencyInstall: DependencyInstallPlan;
  requested: readonly string[];
  /** Registry items installed only because something requested depended on them. */
  registryDependencies: readonly string[];
}

export function formatAddSummary(input: AddSummaryInput): string {
  const installedRequested = requestedInstalled(input);
  const lines: string[] = [];

  if (installedRequested.length > 0 || input.plan.entries.length > 0) {
    lines.push("✓ Added components", "");
  }

  if (installedRequested.length > 0) {
    lines.push("Installed");
    for (const name of installedRequested) {
      lines.push(`✓ ${name}`);
    }
    lines.push("");
  }

  if (input.plan.entries.length > 0) {
    lines.push("Files");
    for (const entry of input.plan.entries) {
      lines.push(`✓ ${entry.destinationPath}`);
    }
    lines.push("");
  }

  const dependencies = dependencyNames(input.dependencyInstall);
  if (dependencies.length > 0 && input.plan.entries.length > 0) {
    lines.push("Dependencies");
    for (const name of dependencies) {
      lines.push(`✓ ${name}`);
    }
    lines.push("");
  }

  if (input.registryDependencies.length > 0 && input.plan.entries.length > 0) {
    lines.push("Registry dependencies");
    for (const name of input.registryDependencies) {
      lines.push(`✓ ${name}`);
    }
    lines.push("");
  } else if (installedRequested.length > 0 && input.plan.entries.length > 0) {
    lines.push("Registry dependencies", "none", "");
  }

  if (input.plan.skipped.length > 0) {
    lines.push("Skipped");
    for (const name of input.plan.skipped) {
      lines.push(`• ${name} (already exists)`);
    }
    lines.push("");
  }

  if (input.plan.failed.length > 0) {
    lines.push("Failed");
    for (const name of input.plan.failed) {
      lines.push(`• ${name} (not found)`);
    }
    lines.push("");
  }

  if (
    installedRequested.length === 0 &&
    input.plan.entries.length === 0 &&
    input.plan.skipped.length > 0 &&
    input.plan.failed.length === 0
  ) {
    lines.push("Use --force to overwrite.", "");
  }

  if (input.plan.entries.length > 0) {
    lines.push("Next:", "Import components from:", "@/components/ui/*");
  }

  while (lines.at(-1) === "") {
    lines.pop();
  }

  return lines.join("\n");
}

export function formatDryRunSummary(input: AddSummaryInput): string {
  const installedRequested = requestedInstalled(input);
  const lines = ["Vinyaas dry run", ""];

  if (installedRequested.length > 0 || input.plan.entries.length > 0) {
    lines.push("Would install:", "");
  }

  if (installedRequested.length > 0) {
    lines.push("Components");
    for (const name of installedRequested) {
      lines.push(`✓ ${name}`);
    }
    lines.push("");
  }

  if (input.plan.entries.length > 0) {
    lines.push("Files");
    for (const entry of input.plan.entries) {
      lines.push(entry.destinationPath);
    }
    lines.push("");
  }

  const dependencies = dependencyNames(input.dependencyInstall);
  if (dependencies.length > 0 && input.plan.entries.length > 0) {
    lines.push("Dependencies");
    for (const name of dependencies) {
      lines.push(name);
    }
    lines.push("");
  } else if (input.plan.entries.length > 0) {
    lines.push("Dependencies", "none", "");
  }

  if (input.plan.entries.length > 0) {
    lines.push("Registry dependencies");
    if (input.registryDependencies.length > 0) {
      for (const name of input.registryDependencies) {
        lines.push(name);
      }
    } else {
      lines.push("none");
    }
    lines.push("");
  }

  if (input.plan.skipped.length > 0) {
    lines.push("Skipped");
    for (const name of input.plan.skipped) {
      lines.push(`• ${name} (already exists)`);
    }
    lines.push("");
  }

  if (input.plan.failed.length > 0) {
    lines.push("Failed");
    for (const name of input.plan.failed) {
      lines.push(`• ${name} (not found)`);
    }
    lines.push("");
  }

  lines.push("No changes made.");

  return lines.join("\n");
}

export function formatCategoryInstallPrompt(
  input: AddSummaryInput & { category: string },
): string {
  const installedRequested = requestedInstalled(input);
  const dependencies = dependencyNames(input.dependencyInstall);

  return [
    "Category install",
    "",
    "Category:",
    input.category,
    "",
    "Components:",
    ...(installedRequested.length > 0 ? installedRequested : ["none"]),
    "",
    "Files:",
    String(input.plan.entries.length),
    "",
    "Dependencies:",
    ...(dependencies.length > 0 ? dependencies : ["none"]),
  ].join("\n");
}

export function formatAddInstallPrompt(input: AddSummaryInput): string {
  const installedRequested = requestedInstalled(input);
  const dependencies = dependencyNames(input.dependencyInstall);
  const fileCount = input.plan.entries.length;

  return [
    "Add components",
    "",
    "Components:",
    ...(installedRequested.length > 0
      ? installedRequested.map((name) => ` ✓ ${name}`)
      : [" none"]),
    "",
    "Files:",
    ` ${fileCount} ${fileCount === 1 ? "file" : "files"}`,
    "",
    "Dependencies:",
    ...(dependencies.length > 0
      ? dependencies.map((name) => ` ${name}`)
      : [" none"]),
  ].join("\n");
}

function requestedInstalled(input: AddSummaryInput): string[] {
  return input.requested.filter(
    (component) =>
      !input.plan.skipped.includes(component) &&
      !input.plan.failed.includes(component) &&
      input.plan.items.includes(component),
  );
}

function dependencyNames(plan: DependencyInstallPlan): string[] {
  const names = [
    ...plan.installDependencies,
    ...plan.installDevDependencies,
    ...plan.present.map((item) => item.name),
  ];
  return [...new Set(names)].sort((left, right) => left.localeCompare(right));
}

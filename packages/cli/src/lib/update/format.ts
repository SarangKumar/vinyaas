/** Confirmation preview for `vinyaas update`. */
export function formatUpdatePrompt({
  targets,
  updateAll,
}: {
  targets: readonly string[];
  updateAll: boolean;
}): string {
  const lines: string[] = [
    updateAll ? "Update all installed components" : "Update components",
    "",
    "Components:",
  ];

  for (const name of targets) {
    lines.push(` ✓ ${name}`);
  }

  lines.push(
    "",
    "This overwrites local component files with the latest registry versions,",
    "including any edits you made to those files.",
  );

  return lines.join("\n");
}

export function formatUpdateConfirmQuestion({
  targets,
  updateAll,
}: {
  targets: readonly string[];
  updateAll: boolean;
}): string {
  if (updateAll) {
    return "Update all installed components and overwrite local changes? (y/N)";
  }

  if (targets.length === 1) {
    return `Overwrite local changes for ${targets[0]}? (y/N)`;
  }

  return "Overwrite local changes for these components? (y/N)";
}

import type { DetectedProject } from "../detect-project.ts";

export interface InitSummary {
  framework: DetectedProject["framework"];
  typescript: boolean;
  /** Display value such as `v4` or a detected version string. */
  tailwind: string;
  configured: {
    componentsJson: boolean;
    cssVariables: boolean;
    aliases: boolean;
    utilsPath: string;
  };
  dependencies: string[];
}

export function formatInitSummary(summary: InitSummary): string {
  const lines = [
    "✓ Vinyaas initialized",
    "",
    "Project",
    `  Framework: ${frameworkLabel(summary.framework)}`,
    `  TypeScript: ${summary.typescript ? "enabled" : "disabled"}`,
    `  Tailwind: ${summary.tailwind}`,
    "",
    "Configured",
  ];

  if (summary.configured.componentsJson) {
    lines.push("  ✓ components.json");
  }
  if (summary.configured.cssVariables) {
    lines.push("  ✓ CSS variables");
  }
  if (summary.configured.aliases) {
    lines.push("  ✓ aliases");
  }
  lines.push(`  ✓ ${summary.configured.utilsPath}`);

  if (summary.dependencies.length > 0) {
    lines.push("", "Dependencies");
    for (const dependency of summary.dependencies) {
      lines.push(`  ✓ ${dependency}`);
    }
  }

  lines.push(
    "",
    "Ready:",
    "  vinyaas add button",
    "",
    "Explore:",
    "  vinyaas list",
    "  vinyaas search <query>",
    "  vinyaas info <component>",
    "  vinyaas doctor",
  );

  return lines.join("\n");
}

function frameworkLabel(framework: DetectedProject["framework"]): string {
  if (framework === "next") return "Next.js";
  if (framework === "vite") return "Vite";
  return "React";
}

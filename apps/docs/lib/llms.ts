import {
  componentHref,
  components,
  currentVersion,
} from "@/components/component-meta";
import { docsNav, llmsTxtPath } from "@/components/docs-nav";
import { siteDescription, siteName, siteUrl } from "@/lib/site";
import { componentCatalogs } from "@/registry/catalogs";

function absolute(href: string) {
  return href.startsWith("http") ? href : `${siteUrl}${href}`;
}

/**
 * Plain-text site map for language models (llms.txt convention): a title,
 * a one-line summary, then Markdown link lists. Built from the same metadata
 * as the sidebar, so it never drifts from the docs.
 */
export function buildLlmsTxt(): string {
  const lines: string[] = [
    `# ${siteName}`,
    "",
    `> ${siteDescription}`,
    "",
    `Current release: v${currentVersion}. Components install as editable source with \`npx vinyaas add <name>\`. Installable registry JSON lives at ${siteUrl}/r/new-york/<name>.json.`,
    "",
  ];

  for (const group of docsNav) {
    if (group.title === "COMPONENTS") {
      continue;
    }

    const items = group.items.filter((item) => item.href !== llmsTxtPath);

    if (items.length === 0) {
      continue;
    }

    lines.push(
      `## ${group.title.charAt(0)}${group.title.slice(1).toLowerCase()}`,
      "",
    );

    for (const item of items) {
      lines.push(
        `- [${item.title}](${absolute(item.href)})${item.description ? `: ${item.description}` : ""}`,
      );
    }

    lines.push("");
  }

  lines.push("## Components", "");

  for (const component of [...components].sort((a, b) =>
    a.name.localeCompare(b.name),
  )) {
    lines.push(
      `- [${component.name}](${absolute(componentHref(component.slug))}): ${component.description} Install: \`npx vinyaas add ${component.slug}\`.`,
    );
  }

  lines.push("", "## Catalogs", "");

  for (const catalog of componentCatalogs) {
    lines.push(
      `- ${catalog.name} (\`npx vinyaas add --catalog ${catalog.id}\`): ${catalog.description} Includes ${catalog.components.join(", ")}.`,
    );
  }

  lines.push("");

  return lines.join("\n");
}

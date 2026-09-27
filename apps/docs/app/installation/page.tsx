import { CodeBlock } from "@/components/code-block";
import { DocsArticle } from "@/components/docs-article";

const sectionHeading =
  "text-foreground scroll-mt-8 text-xl font-semibold tracking-tight";

export default function InstallationPage() {
  return (
    <DocsArticle
      title="Installation"
      description="Install the CLI, initialize a Next.js project, then add a component."
    >
      <section className="flex flex-col gap-6">
        <h2 id="cli" className={sectionHeading}>
          CLI
        </h2>
        <CodeBlock code="npm install -g @vinyaas/cli" language="bash" />
      </section>
      <section className="flex flex-col gap-6">
        <h2 id="project" className={sectionHeading}>
          Project
        </h2>
        <p className="text-body text-base leading-7">
          The project needs Node.js 20 or newer, Next.js, React, Tailwind CSS, a
          global stylesheet at{" "}
          <code className="font-mono">app/globals.css</code> or{" "}
          <code className="font-mono">src/app/globals.css</code>, an{" "}
          <code className="font-mono">@/*</code> path alias, and one package
          manager lockfile.
        </p>
        <CodeBlock code={"vinyaas init\nvinyaas add button"} language="bash" />
      </section>
    </DocsArticle>
  );
}

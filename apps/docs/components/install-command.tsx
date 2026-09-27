import { CodeBlock } from "@/components/code-block";

export function InstallCommand({ command }: { command: string }) {
  return <CodeBlock code={command} language="bash" />;
}

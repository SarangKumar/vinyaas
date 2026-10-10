import type { ReactNode } from "react";

import { CopyButton } from "@/components/copy-button";

const heading = "text-[var(--syntax-number)]";
const term = "text-[var(--syntax-number)]";
const text = "text-[var(--syntax-string)]";

/**
 * Colors Commander help: section labels and option/argument terms in the
 * number color, descriptions in the string color (like a terminal theme).
 */
function renderLine(line: string): ReactNode {
  const usage = /^(Usage:)(.*)$/.exec(line);

  if (usage) {
    return (
      <>
        <span className={heading}>{usage[1]}</span>
        <span className={text}>{usage[2]}</span>
      </>
    );
  }

  if (/^[A-Z][A-Za-z ]*:$/.test(line)) {
    return <span className={heading}>{line}</span>;
  }

  const entry = /^(\s{2})(\S.*?)(\s{2,})(\S.*)$/.exec(line);

  if (entry) {
    return (
      <>
        {entry[1]}
        <span className={term}>{entry[2]}</span>
        {entry[3]}
        <span className={text}>{entry[4]}</span>
      </>
    );
  }

  return <span className={text}>{line}</span>;
}

export function CliHelpBlock({ help }: { help: string }) {
  return (
    <div
      data-code-frame
      data-cli-help
      className="relative overflow-hidden rounded-md border"
    >
      <div className="absolute top-2 right-2">
        <CopyButton value={help} />
      </div>
      <pre className="overflow-x-auto p-4 pr-12 font-mono text-[13px] leading-6">
        <code>
          {help.split("\n").map((line, index) => (
            <span key={index} className="block min-h-6 whitespace-pre">
              {renderLine(line)}
            </span>
          ))}
        </code>
      </pre>
    </div>
  );
}

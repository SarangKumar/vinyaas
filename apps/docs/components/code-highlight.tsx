import type { ReactNode } from "react";
import hljs from "highlight.js/lib/core";
import bash from "highlight.js/lib/languages/bash";
import javascript from "highlight.js/lib/languages/javascript";
import xml from "highlight.js/lib/languages/xml";

hljs.registerLanguage("bash", bash);
hljs.registerLanguage("javascript", javascript);
// JSX in TSX/JSX demos is highlighted via the javascript → xml sublanguage.
hljs.registerLanguage("xml", xml);

function decodeEntity(entity: string) {
  switch (entity) {
    case "&lt;":
      return "<";
    case "&gt;":
      return ">";
    case "&amp;":
      return "&";
    case "&quot;":
      return '"';
    case "&#39;":
    case "&#x27;":
      return "'";
    default:
      return entity;
  }
}

type Frame = {
  className: string;
  children: ReactNode[];
};

/**
 * highlight.js emits a small HTML subset (nested spans and entities).
 * Turn that into React nodes instead of injecting HTML into the document.
 */
export function highlightCode(
  code: string,
  language?: string,
): ReactNode[] | null {
  const grammar =
    language === "bash"
      ? "bash"
      : language === "tsx" || language === "jsx"
        ? "javascript"
        : null;

  if (!grammar) {
    return null;
  }

  return htmlToNodes(hljs.highlight(code, { language: grammar }).value);
}

function htmlToNodes(html: string): ReactNode[] {
  const root: Frame = { className: "", children: [] };
  const stack: Frame[] = [root];
  let index = 0;
  let key = 0;

  while (index < html.length) {
    if (html.startsWith("</span>", index)) {
      if (stack.length > 1) {
        const frame = stack.pop()!;
        const parent = stack[stack.length - 1]!;
        parent.children.push(
          <span key={key} className={frame.className || undefined}>
            {frame.children}
          </span>,
        );
        key += 1;
      }
      index += 7;
      continue;
    }

    if (html.startsWith("<span", index)) {
      const end = html.indexOf(">", index);

      if (end === -1) {
        break;
      }

      const tag = html.slice(index, end + 1);
      const match = /class="([^"]*)"/.exec(tag);
      stack.push({ className: match?.[1] ?? "", children: [] });
      index = end + 1;
      continue;
    }

    if (html[index] === "&") {
      const end = html.indexOf(";", index);

      if (end === -1) {
        stack[stack.length - 1]!.children.push(html[index]);
        index += 1;
        continue;
      }

      stack[stack.length - 1]!.children.push(
        decodeEntity(html.slice(index, end + 1)),
      );
      index = end + 1;
      continue;
    }

    let end = html.length;
    const nextTag = html.indexOf("<", index);
    const nextEntity = html.indexOf("&", index);

    if (nextTag !== -1) {
      end = Math.min(end, nextTag);
    }

    if (nextEntity !== -1) {
      end = Math.min(end, nextEntity);
    }

    stack[stack.length - 1]!.children.push(html.slice(index, end));
    index = end;
  }

  return root.children;
}

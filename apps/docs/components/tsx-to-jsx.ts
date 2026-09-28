/**
 * Lightweight TSX → JSX presentation transform for docs examples.
 * Strips common TypeScript-only syntax without a full AST.
 */
export function tsxToJsx(source: string): string {
  let out = source;

  out = out.replace(/^import\s+type\s+[\s\S]*?;\s*$/gm, "");
  out = out.replace(/,\s*type\s+[A-Za-z_$][\w$]*/g, "");
  out = out.replace(/\{\s*type\s+[A-Za-z_$][\w$]*\s*,\s*/g, "{ ");
  out = out.replace(/\{\s*type\s+[A-Za-z_$][\w$]*\s*\}/g, "{}");

  out = out.replace(
    /^export\s+(?:type|interface)\s+[A-Za-z_$][\w$]*(?:<[^>]*>)?[\s\S]*?(?:;|(?<=\}))\s*$/gm,
    "",
  );
  out = out.replace(
    /^(?:type|interface)\s+[A-Za-z_$][\w$]*(?:<[^>]*>)?[\s\S]*?(?:;|(?<=\}))\s*$/gm,
    "",
  );

  out = out.replace(/\}\s*:\s*[A-Za-z_$][\w$.|<>,\s[\]]*\s*\)/g, "})");
  out = out.replace(/(\))\s*:\s*[A-Za-z_$][\w$.|<>,\s[\]&|]*(?=\s*\{)/g, "$1");
  out = out.replace(
    /(:\s*)([A-Za-z_$][\w$]*(?:<[^>]*>)?(?:\s*\|\s*[A-Za-z_$][\w$]*(?:<[^>]*>)?)*)(?=\s*[=,)])/g,
    "",
  );

  out = out.replace(/\s+as\s+const\b/g, "");
  out = out.replace(/\s+as\s+[A-Za-z_$][\w$.|<>,\s[\]]+/g, "");
  out = out.replace(/\s+satisfies\s+[A-Za-z_$][\w$.|<>,\s[\]]+/g, "");

  out = out.replace(/^\s*\{\}\s*;?\s*$/gm, "");
  out = out.replace(/\n{3,}/g, "\n\n");
  out = out.replace(/[ \t]+$/gm, "");

  const trimmed = out.replace(/^\n+/, "").replace(/\n+$/, "");
  return source.endsWith("\n") ? `${trimmed}\n` : trimmed;
}

export const codeLanguages = [
  "tsx",
  "jsx",
  "typescript",
  "javascript",
  "bash",
] as const;

export type CodeLanguage = (typeof codeLanguages)[number];

export type DemoCode = string | Partial<Record<CodeLanguage, string>>;

export function isCodeLanguage(value: string | null): value is CodeLanguage {
  return codeLanguages.some((language) => language === value);
}

/**
 * A string is source for one language and is never relabeled.
 * A record follows the session preference only when that language has source.
 */
export function resolveDemoCode(
  code: DemoCode,
  language: CodeLanguage | undefined,
  preference: CodeLanguage,
): { code: string; language: CodeLanguage } {
  if (typeof code === "string") {
    return { code, language: language ?? "tsx" };
  }

  const preferred = code[preference];

  if (preferred) {
    return { code: preferred, language: preference };
  }

  const declared = language && code[language] ? language : undefined;
  const fallback =
    declared ?? codeLanguages.find((item) => code[item] !== undefined);

  return {
    code: fallback ? (code[fallback] ?? "") : "",
    language: fallback ?? "tsx",
  };
}

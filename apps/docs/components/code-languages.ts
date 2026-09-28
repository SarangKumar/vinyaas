export const codeLanguages = ["tsx", "jsx"] as const;

export type CodeLanguage = (typeof codeLanguages)[number];

export type DemoCode = string | Partial<Record<CodeLanguage, string>>;

const labels: Record<CodeLanguage, string> = {
  tsx: "TSX",
  jsx: "JSX",
};

export function codeLanguageLabel(language: CodeLanguage) {
  return labels[language];
}

/**
 * Resolves example source for the current global preference.
 * String demos stay on the declared language label; dual records follow Redux.
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

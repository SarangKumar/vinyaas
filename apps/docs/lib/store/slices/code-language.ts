import { codeLanguages, type CodeLanguage } from "@/components/code-languages";

export type CodeLanguageState = {
  value: CodeLanguage;
};

export type SetCodeLanguageAction = {
  type: "codeLanguage/setCodeLanguage";
  payload: CodeLanguage;
};

export function setCodeLanguage(language: CodeLanguage): SetCodeLanguageAction {
  return { type: "codeLanguage/setCodeLanguage", payload: language };
}

export function codeLanguageReducer(
  state: CodeLanguageState = { value: "tsx" },
  action: SetCodeLanguageAction,
): CodeLanguageState {
  return action.type === "codeLanguage/setCodeLanguage" &&
    state.value !== action.payload
    ? { value: action.payload }
    : state;
}

export function isCodeLanguage(value: string | null): value is CodeLanguage {
  return codeLanguages.some((language) => language === value);
}

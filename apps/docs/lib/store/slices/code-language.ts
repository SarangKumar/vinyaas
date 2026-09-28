import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import { codeLanguages, type CodeLanguage } from "@/components/code-languages";

export type CodeLanguageState = {
  value: CodeLanguage;
};

const codeLanguageSlice = createSlice({
  name: "codeLanguage",
  initialState: { value: "tsx" } as CodeLanguageState,
  reducers: {
    setCodeLanguage(state, action: PayloadAction<CodeLanguage>) {
      state.value = action.payload;
    },
  },
});

export const { setCodeLanguage } = codeLanguageSlice.actions;

export const codeLanguageReducer = codeLanguageSlice.reducer;

export function isCodeLanguage(value: string | null): value is CodeLanguage {
  return codeLanguages.some((language) => language === value);
}

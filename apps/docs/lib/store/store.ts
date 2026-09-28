import { configureStore } from "@reduxjs/toolkit";

import { codeLanguageReducer } from "@/lib/store/slices/code-language";

export const store = configureStore({
  reducer: {
    codeLanguage: codeLanguageReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

import {
  codeLanguageReducer,
  type CodeLanguageState,
  type SetCodeLanguageAction,
} from "@/lib/store/slices/code-language";

/**
 * The docs keep one piece of shared client state (the TSX/JSX example
 * language). A tiny external store replaces Redux Toolkit + react-redux: same
 * dispatch/getState shape, read with useSyncExternalStore, and no shared
 * dependency that pulled Recharts' state layer into every page's first load.
 */
export type RootState = { codeLanguage: CodeLanguageState };

let state: RootState = {
  codeLanguage: codeLanguageReducer(undefined, {
    type: "codeLanguage/setCodeLanguage",
    payload: "tsx",
  }),
};
const listeners = new Set<() => void>();

export const store = {
  getState: (): RootState => state,
  dispatch(action: SetCodeLanguageAction) {
    const codeLanguage = codeLanguageReducer(state.codeLanguage, action);

    if (codeLanguage !== state.codeLanguage) {
      state = { ...state, codeLanguage };

      for (const listener of listeners) {
        listener();
      }
    }

    return action;
  },
  subscribe(listener: () => void) {
    listeners.add(listener);

    return () => {
      listeners.delete(listener);
    };
  },
};

export type AppDispatch = typeof store.dispatch;

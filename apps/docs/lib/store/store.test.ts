import { describe, expect, it } from "vitest";

import { setCodeLanguage } from "@/lib/store/slices/code-language";
import { store } from "@/lib/store/store";

describe("docs store", () => {
  it("starts on TSX and switches between the two example languages", () => {
    store.dispatch(setCodeLanguage("tsx"));

    expect(store.getState().codeLanguage.value).toBe("tsx");

    store.dispatch(setCodeLanguage("jsx"));
    expect(store.getState().codeLanguage.value).toBe("jsx");

    store.dispatch(setCodeLanguage("tsx"));
    expect(store.getState().codeLanguage.value).toBe("tsx");
  });
});

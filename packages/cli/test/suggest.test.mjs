import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  formatUnknownComponentMessage,
  suggestRegistryNames,
} from "../src/lib/registry/suggest.ts";

const names = [
  "badge",
  "button",
  "card",
  "input",
  "input-otp",
  "textarea",
  "toast",
];

describe("suggestRegistryNames", () => {
  it("suggests close typos", () => {
    assert.deepEqual(suggestRegistryNames("buton", names), ["button"]);
    assert.deepEqual(suggestRegistryNames("toas", names), ["toast"]);
  });

  it("prefers shared prefixes", () => {
    assert.deepEqual(suggestRegistryNames("inpu", names).slice(0, 2), [
      "input",
      "input-otp",
    ]);
  });

  it("returns nothing for unrelated queries", () => {
    assert.deepEqual(suggestRegistryNames("xyzzy", names), []);
  });
});

describe("formatUnknownComponentMessage", () => {
  it("includes suggestions when available", () => {
    const message = formatUnknownComponentMessage(["buton"], names);

    assert.match(message, /Unknown component "buton"\./);
    assert.match(message, /Did you mean:/);
    assert.match(message, / {2}button/);
  });

  it("lists multiple unknown names", () => {
    const message = formatUnknownComponentMessage(
      ["nope", "also-nope"],
      names,
    );

    assert.match(message, /Unknown components:/);
    assert.match(message, /- nope/);
    assert.match(message, /- also-nope/);
    assert.doesNotMatch(message, /Did you mean:/);
  });

  it("suggests close typos like buttton", () => {
    const catalog = ["button", "button-group", "badge", "input"];
    const message = formatUnknownComponentMessage(["buttton"], catalog);

    assert.match(message, /Unknown component "buttton"\./);
    assert.match(message, /Did you mean:/);
    assert.match(message, / {2}button/);
  });
});

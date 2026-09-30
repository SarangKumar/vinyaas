import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { ensureConsumerCss } from "../src/lib/theme/ensure-css.ts";
import { renderConsumerCssTemplate } from "../src/lib/theme/tokens.ts";

function assertManagedOrder(css) {
  const importAt = css.indexOf('@import "tailwindcss"');
  const variantAt = css.indexOf("@custom-variant dark");
  const rootAt = css.search(/(^|\n):root\s*\{/);
  const darkAt = css.search(/(^|\n)\.dark\s*\{/);
  const themeAt = css.indexOf("@theme inline");

  assert.ok(importAt >= 0, "missing @import");
  assert.ok(variantAt > importAt, "dark variant must follow @import");
  assert.ok(rootAt > variantAt, ":root must follow dark variant");
  assert.ok(darkAt > rootAt, ".dark must follow :root");
  assert.ok(themeAt > darkAt, "@theme inline must follow .dark");
  assert.equal(css.split('@import "tailwindcss"').length - 1, 1);
  assert.equal(css.split("@custom-variant dark").length - 1, 1);
  assert.equal(css.split("@theme inline").length - 1, 1);
}

describe("ensureConsumerCss", () => {
  it("creates a full consumer theme when missing", () => {
    const { next, created, changed } = ensureConsumerCss(null);

    assert.equal(created, true);
    assert.equal(changed, true);
    assert.equal(next, renderConsumerCssTemplate());
    assertManagedOrder(next);
    assert.match(next, /color-scheme:\s*light/);
    assert.doesNotMatch(next, /font-geist/);
    assert.doesNotMatch(next, /--playground-/);
  });

  it("is idempotent", () => {
    const first = ensureConsumerCss('@import "tailwindcss";\n');
    const second = ensureConsumerCss(first.next);

    assert.equal(second.changed, false);
    assert.equal(second.next, first.next);
    assertManagedOrder(second.next);
  });

  it("normalizes managed blocks into Tailwind v4 order", () => {
    const existing = `@theme inline {
  --color-primary: var(--primary);
}

.dark {
  --primary: black;
}

:root {
  --primary: tomato;
}

@custom-variant dark (&:where(.dark, .dark *));

@import "tailwindcss";

.hero {
  letter-spacing: 0.05em;
}
`;
    const { next, changed } = ensureConsumerCss(existing);

    assert.equal(changed, true);
    assertManagedOrder(next);
    assert.match(next, /--primary:\s*tomato/);
    assert.match(next, /\.dark\s*\{[^}]*--primary:\s*black/);
    assert.match(next, /\.hero\s*\{/);
    assert.ok(next.indexOf("@theme inline") < next.indexOf(".hero"));
  });

  it("preserves custom declarations and user token values", () => {
    const existing = `@import "tailwindcss";

.hero {
  letter-spacing: 0.05em;
}

:root {
  --primary: tomato;
}
`;
    const { next, changed } = ensureConsumerCss(existing);

    assert.equal(changed, true);
    assertManagedOrder(next);
    assert.match(next, /\.hero\s*\{/);
    assert.match(next, /--primary:\s*tomato/);
    assert.match(next, /--background:/);
    assert.match(next, /--color-primary:\s*var\(--primary\)/);
  });

  it("strips create-next-app prefers-color-scheme :root overrides", () => {
    const existing = `@import "tailwindcss";

:root {
  --background: #ffffff;
  --foreground: #171717;
}

@media (prefers-color-scheme: dark) {
  :root {
    --background: #0a0a0a;
    --foreground: #ededed;
  }
}

body {
  background: var(--background);
}
`;
    const { next, changed } = ensureConsumerCss(existing);

    assert.equal(changed, true);
    assertManagedOrder(next);
    assert.doesNotMatch(next, /prefers-color-scheme/);
    assert.match(next, /\.dark\s*\{/);
    assert.match(next, /body\s*\{/);
    assert.match(next, /--background:\s*#ffffff/);
  });
});

import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { formatInitSummary } from "../src/lib/init/format.ts";

describe("formatInitSummary", () => {
  it("renders a grouped onboarding summary from detected state", () => {
    const output = formatInitSummary({
      framework: "next",
      typescript: true,
      tailwind: "v4",
      configured: {
        componentsJson: true,
        cssVariables: true,
        aliases: true,
        utilsPath: "lib/utils.ts",
      },
      dependencies: ["clsx", "tailwind-merge"],
    });

    assert.match(output, /^✓ Vinyaas initialized/);
    assert.match(output, /Framework: Next\.js/);
    assert.match(output, /TypeScript: enabled/);
    assert.match(output, /Tailwind: v4/);
    assert.match(output, /✓ components\.json/);
    assert.match(output, /✓ CSS variables/);
    assert.match(output, /✓ aliases/);
    assert.match(output, /✓ lib\/utils\.ts/);
    assert.match(output, /✓ clsx/);
    assert.match(output, /✓ tailwind-merge/);
    assert.match(output, /vinyaas add button/);
    assert.match(output, /vinyaas doctor/);
  });
});

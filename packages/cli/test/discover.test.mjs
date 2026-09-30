import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { executeInfo } from "../src/commands/info.ts";
import { executeList } from "../src/commands/list.ts";
import { executeSearch } from "../src/commands/search.ts";
import {
  RegistryError,
  buildRegistryCatalogUrl,
  parseRegistryCatalog,
} from "../src/lib/registry/client.ts";
import { searchRegistryCatalog } from "../src/lib/registry/search.ts";
import { toRegistryItemSummary } from "../src/lib/registry/format.ts";

const catalog = {
  style: "new-york",
  items: [
    {
      name: "badge",
      type: "registry:ui",
      description: "A compact label for status or category.",
      dependencies: ["clsx"],
      files: ["ui/badge/index.tsx"],
    },
    {
      name: "button",
      type: "registry:ui",
      description: "A reusable button component with variants.",
      dependencies: ["class-variance-authority", "clsx", "tailwind-merge"],
      files: ["ui/button/index.tsx"],
    },
    {
      name: "input",
      type: "registry:ui",
      description: "A text field that passes through native input attributes.",
      dependencies: ["clsx", "tailwind-merge"],
      files: ["ui/input/index.tsx"],
    },
    {
      name: "input-otp",
      type: "registry:ui",
      description: "A one-time code made of grouped digit slots.",
      dependencies: ["clsx", "tailwind-merge"],
      files: ["ui/input-otp/index.tsx"],
    },
    {
      name: "textarea",
      type: "registry:ui",
      description:
        "A multiline text field that passes through native textarea attributes.",
      dependencies: ["clsx", "tailwind-merge"],
      files: ["ui/textarea/index.tsx"],
    },
    {
      name: "toast",
      type: "registry:ui",
      description:
        "A temporary notice for success, error, or informational feedback.",
      dependencies: ["clsx", "tailwind-merge"],
      files: ["ui/toast/index.tsx", "ui/toast/toast.css"],
    },
    {
      name: "attachment",
      type: "registry:ui",
      description: "A file or image chip with media and actions.",
      dependencies: ["clsx"],
      registryDependencies: ["button"],
      files: ["ui/attachment/index.tsx"],
    },
  ],
};

const buttonItem = {
  $schema: "https://vinyaas.vercel.app/schema/registry-item.json",
  name: "button",
  type: "registry:ui",
  description: "A reusable button component with variants.",
  dependencies: ["class-variance-authority", "clsx", "tailwind-merge"],
  files: [
    {
      path: "ui/button/index.tsx",
      content: "export function Button() { return null; }\n",
      type: "registry:ui",
    },
  ],
  docs: "https://vinyaas.vercel.app/components/button",
};

const toastItem = {
  $schema: "https://vinyaas.vercel.app/schema/registry-item.json",
  name: "toast",
  type: "registry:ui",
  description:
    "A temporary notice for success, error, or informational feedback.",
  dependencies: ["clsx", "tailwind-merge"],
  files: [
    {
      path: "ui/toast/index.tsx",
      content: "export function toast() {}\n",
      type: "registry:ui",
    },
    {
      path: "ui/toast/toast.css",
      content: ".toast {}\n",
      type: "registry:ui",
    },
  ],
  docs: "https://vinyaas.vercel.app/components/toast",
};

const attachmentItem = {
  $schema: "https://vinyaas.vercel.app/schema/registry-item.json",
  name: "attachment",
  type: "registry:ui",
  description: "A file or image chip with media and actions.",
  dependencies: ["clsx"],
  registryDependencies: ["button"],
  files: [
    {
      path: "ui/attachment/index.tsx",
      content: "export function Attachment() { return null; }\n",
      type: "registry:ui",
    },
  ],
};

function jsonResponse(status, body) {
  return {
    ok: status >= 200 && status < 300,
    status,
    async json() {
      return body;
    },
  };
}

function catalogFetch(overrides = {}) {
  return async (url) => {
    const href = String(url);

    if (href.endsWith("/index.json")) {
      if (overrides.catalogError instanceof Error) {
        throw overrides.catalogError;
      }

      if (overrides.catalogStatus) {
        return jsonResponse(overrides.catalogStatus, overrides.catalogBody ?? {});
      }

      return jsonResponse(200, catalog);
    }

    const name = decodeURIComponent(
      href.split("/").pop().replace(/\.json$/, ""),
    );

    if (overrides.itemError instanceof Error) {
      throw overrides.itemError;
    }

    const items = {
      button: buttonItem,
      toast: toastItem,
      attachment: attachmentItem,
      ...(overrides.items ?? {}),
    };
    const item = items[name];

    if (!item) {
      return jsonResponse(404, {});
    }

    return jsonResponse(200, item);
  };
}

function captureLogs(run) {
  const logs = [];
  const errors = [];
  const originalLog = console.log;
  const originalError = console.error;

  console.log = (...args) => {
    logs.push(args.join(" "));
  };
  console.error = (...args) => {
    errors.push(args.join(" "));
  };

  return Promise.resolve()
    .then(run)
    .then((value) => ({ value, stdout: logs.join("\n"), stderr: errors.join("\n") }))
    .finally(() => {
      console.log = originalLog;
      console.error = originalError;
    });
}

describe("registry catalog url", () => {
  it("builds the style catalog url", () => {
    assert.equal(
      buildRegistryCatalogUrl({
        baseUrl: "https://vinyaas.vercel.app",
        style: "new-york",
      }),
      "https://vinyaas.vercel.app/r/new-york/index.json",
    );
  });

  it("parses and sorts catalog items", () => {
    const parsed = parseRegistryCatalog({
      style: "new-york",
      items: [
        {
          name: "toast",
          type: "registry:ui",
          dependencies: [],
          files: ["ui/toast/index.tsx"],
        },
        {
          name: "button",
          type: "registry:ui",
          description: "A button.",
          dependencies: ["clsx"],
          files: ["ui/button/index.tsx"],
        },
      ],
    });

    assert.deepEqual(
      parsed.items.map((item) => item.name),
      ["button", "toast"],
    );
  });
});

describe("searchRegistryCatalog", () => {
  const items = parseRegistryCatalog(catalog).items;

  it("ranks exact, prefix, name, and description matches", () => {
    assert.deepEqual(
      searchRegistryCatalog(items, "input").map((item) => item.name),
      ["input", "input-otp"],
    );
    assert.deepEqual(
      searchRegistryCatalog(items, "INPUT").map((item) => item.name),
      ["input", "input-otp"],
    );
    assert.deepEqual(
      searchRegistryCatalog(items, "otp").map((item) => item.name),
      ["input-otp"],
    );
    assert.deepEqual(
      searchRegistryCatalog(items, "temporary notice").map((item) => item.name),
      ["toast"],
    );
    assert.deepEqual(
      searchRegistryCatalog(items, "informational feedback").map(
        (item) => item.name,
      ),
      ["toast"],
    );
  });

  it("returns an empty list when nothing matches", () => {
    assert.deepEqual(searchRegistryCatalog(items, "xyz"), []);
  });
});

describe("vinyaas list", () => {
  it("lists sorted components with descriptions", async () => {
    const { stdout } = await captureLogs(() =>
      executeList({
        env: { REGISTRY_BASE_URL: "http://localhost:3000" },
        fetch: catalogFetch(),
      }),
    );

    assert.match(stdout, /^Components\n/);
    assert.match(stdout, /attachment/);
    assert.match(stdout, /button/);
    assert.match(stdout, /A reusable button component with variants\./);
    assert.ok(stdout.indexOf("attachment") < stdout.indexOf("badge"));
    assert.ok(stdout.indexOf("badge") < stdout.indexOf("button"));
  });

  it("returns JSON summaries", async () => {
    const { stdout } = await captureLogs(() =>
      executeList({
        json: true,
        env: { REGISTRY_BASE_URL: "http://localhost:3000" },
        fetch: catalogFetch(),
      }),
    );
    const parsed = JSON.parse(stdout);

    assert.ok(Array.isArray(parsed));
    assert.equal(parsed[0].name, "attachment");
    assert.deepEqual(parsed.find((item) => item.name === "button").files, [
      "ui/button/index.tsx",
    ]);
    assert.equal(
      JSON.stringify(parsed).includes("export function"),
      false,
    );
  });

  it("fails clearly when the registry is unreachable", async () => {
    await assert.rejects(
      () =>
        executeList({
          env: { REGISTRY_BASE_URL: "http://localhost:3000" },
          fetch: catalogFetch({ catalogError: new Error("offline") }),
        }),
      (error) => {
        assert.ok(error instanceof RegistryError);
        assert.match(error.message, /Unable to load Vinyaas registry/);
        return true;
      },
    );
  });
});

describe("vinyaas search", () => {
  it("prints matching components", async () => {
    const { stdout } = await captureLogs(() =>
      executeSearch({
        query: "input",
        env: { REGISTRY_BASE_URL: "http://localhost:3000" },
        fetch: catalogFetch(),
      }),
    );

    assert.match(stdout, /Results/);
    assert.match(stdout, /input\n/);
    assert.match(stdout, /input-otp/);
    assert.doesNotMatch(stdout, /button/);
  });

  it("reports no matches without failing", async () => {
    const { stdout } = await captureLogs(() =>
      executeSearch({
        query: "nonexistent-component",
        env: { REGISTRY_BASE_URL: "http://localhost:3000" },
        fetch: catalogFetch(),
      }),
    );

    assert.equal(stdout, 'No components found for "nonexistent-component".');
  });

  it("returns JSON for matches", async () => {
    const { stdout } = await captureLogs(() =>
      executeSearch({
        query: "button",
        json: true,
        env: { REGISTRY_BASE_URL: "http://localhost:3000" },
        fetch: catalogFetch(),
      }),
    );
    const parsed = JSON.parse(stdout);

    assert.equal(parsed.length, 1);
    assert.equal(parsed[0].name, "button");
    assert.deepEqual(parsed[0].registryDependencies, []);
  });

  it("fails clearly when the registry catalog cannot be fetched", async () => {
    await assert.rejects(
      () =>
        executeSearch({
          query: "button",
          env: { REGISTRY_BASE_URL: "http://localhost:3000" },
          fetch: catalogFetch({ catalogStatus: 500 }),
        }),
      /Unable to load Vinyaas registry/,
    );
  });
});

describe("vinyaas info", () => {
  it("shows details for an existing component", async () => {
    const { stdout } = await captureLogs(() =>
      executeInfo({
        name: "button",
        env: { REGISTRY_BASE_URL: "http://localhost:3000" },
        fetch: catalogFetch(),
      }),
    );

    assert.match(stdout, /^Button\n/);
    assert.match(stdout, /Description:\nA reusable button component with variants\./);
    assert.match(stdout, /Files:\n✓ components\/ui\/button\/index\.tsx/);
    assert.match(stdout, /Dependencies:\n✓ class-variance-authority/);
    assert.match(stdout, /✓ clsx/);
    assert.match(stdout, /✓ tailwind-merge/);
    assert.match(stdout, /Registry dependencies:\nnone/);
    assert.match(
      stdout,
      /Documentation:\nhttps:\/\/vinyaas\.vercel\.app\/components\/button/,
    );
    assert.doesNotMatch(stdout, /apps\/docs/);
    assert.doesNotMatch(stdout, /registry:ui/);
  });

  it("shows supporting CSS and registry dependencies", async () => {
    const toast = await captureLogs(() =>
      executeInfo({
        name: "toast",
        env: { REGISTRY_BASE_URL: "http://localhost:3000" },
        fetch: catalogFetch(),
      }),
    );
    const attachment = await captureLogs(() =>
      executeInfo({
        name: "attachment",
        env: { REGISTRY_BASE_URL: "http://localhost:3000" },
        fetch: catalogFetch(),
      }),
    );

    assert.match(toast.stdout, /✓ components\/ui\/toast\/toast\.css/);
    assert.match(attachment.stdout, /Registry dependencies:\n✓ button/);
  });

  it("returns JSON without file contents", async () => {
    const { stdout } = await captureLogs(() =>
      executeInfo({
        name: "button",
        json: true,
        env: { REGISTRY_BASE_URL: "http://localhost:3000" },
        fetch: catalogFetch(),
      }),
    );
    const parsed = JSON.parse(stdout);

    assert.deepEqual(parsed, toRegistryItemSummary(buttonItem));
    assert.equal(parsed.files[0], "ui/button/index.tsx");
    assert.equal(parsed.docs, "https://vinyaas.vercel.app/components/button");
    assert.equal("content" in parsed, false);
  });

  it("fails for an unknown component with catalog suggestions", async () => {
    await assert.rejects(
      () =>
        executeInfo({
          name: "buton",
          env: { REGISTRY_BASE_URL: "http://localhost:3000" },
          fetch: catalogFetch(),
        }),
      (error) => {
        assert.match(error.message, /Component "buton" not found\./);
        assert.match(error.message, /Did you mean:/);
        assert.match(error.message, /- button/);
        return true;
      },
    );
  });

  it("fails for an unknown component", async () => {
    await assert.rejects(
      () =>
        executeInfo({
          name: "nonexistent-component",
          env: { REGISTRY_BASE_URL: "http://localhost:3000" },
          fetch: catalogFetch(),
        }),
      /Component "nonexistent-component" not found\./,
    );
  });

  it("fails clearly when the registry is unreachable", async () => {
    await assert.rejects(
      () =>
        executeInfo({
          name: "button",
          env: { REGISTRY_BASE_URL: "http://localhost:3000" },
          fetch: async () => {
            throw new Error("offline");
          },
        }),
      /Unable to load Vinyaas registry/,
    );
  });
});

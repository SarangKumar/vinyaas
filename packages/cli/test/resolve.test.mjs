import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { RegistryError } from "../src/lib/registry/client.ts";
import { resolveRegistryItems } from "../src/lib/registry/resolve.ts";

function item(name, extra = {}) {
  return {
    $schema: "https://vinyaas.vercel.app/schema/registry-item.json",
    name,
    type: "registry:ui",
    dependencies: [],
    files: [{ path: `ui/${name}.tsx`, content: name }],
    ...extra,
  };
}

function catalogFetch(catalog) {
  const counts = {};
  const fetchImpl = async (url) => {
    const itemName = decodeURIComponent(
      String(url)
        .split("/")
        .pop()
        .replace(/\.json$/, ""),
    );
    counts[itemName] = (counts[itemName] ?? 0) + 1;
    const registryItem = catalog[itemName];

    if (!registryItem) {
      return {
        ok: false,
        status: 404,
        async json() {
          return {};
        },
      };
    }

    return {
      ok: true,
      status: 200,
      async json() {
        return registryItem;
      },
    };
  };

  return { fetch: fetchImpl, counts };
}

function resolve(name, catalog) {
  const client = catalogFetch(catalog);

  return resolveRegistryItems({
    style: "new-york",
    name,
    baseUrl: "http://localhost:3000",
    fetch: client.fetch,
  }).then((items) => ({ items, counts: client.counts }));
}

describe("registry dependency resolution", () => {
  it("resolves an item with no registry dependencies", async () => {
    const { items, counts } = await resolve("button", {
      button: item("button"),
    });

    assert.deepEqual(
      items.map((entry) => entry.name),
      ["button"],
    );
    assert.equal(counts.button, 1);
  });

  it("resolves one direct dependency before the requested item", async () => {
    const { items } = await resolve("button", {
      utils: item("utils", { dependencies: ["clsx", "some-package"] }),
      button: item("button", {
        dependencies: ["clsx", "tailwind-merge"],
        registryDependencies: ["utils"],
      }),
    });

    assert.deepEqual(
      items.map((entry) => entry.name),
      ["utils", "button"],
    );
  });

  it("resolves nested dependencies first", async () => {
    const { items } = await resolve("button", {
      cn: item("cn"),
      utils: item("utils", { registryDependencies: ["cn"] }),
      button: item("button", { registryDependencies: ["utils"] }),
    });

    assert.deepEqual(
      items.map((entry) => entry.name),
      ["cn", "utils", "button"],
    );
  });

  it("resolves a repeated dependency only once", async () => {
    const { items, counts } = await resolve("button", {
      utils: item("utils"),
      button: item("button", { registryDependencies: ["utils", "utils"] }),
    });

    assert.deepEqual(
      items.map((entry) => entry.name),
      ["utils", "button"],
    );
    assert.equal(counts.utils, 1);
  });

  it("resolves a dependency shared by multiple branches once", async () => {
    const { items, counts } = await resolve("button", {
      utils: item("utils"),
      icon: item("icon", { registryDependencies: ["utils"] }),
      button: item("button", { registryDependencies: ["utils", "icon"] }),
    });

    assert.deepEqual(
      items.map((entry) => entry.name),
      ["utils", "icon", "button"],
    );
    assert.equal(counts.utils, 1);
    assert.equal(counts.icon, 1);
  });

  it("orders siblings by their declaration order", async () => {
    const { items } = await resolve("button", {
      icon: item("icon"),
      utils: item("utils"),
      button: item("button", { registryDependencies: ["utils", "icon"] }),
    });

    assert.deepEqual(
      items.map((entry) => entry.name),
      ["utils", "icon", "button"],
    );
  });

  it("reports a dependency cycle", async () => {
    await assert.rejects(
      () =>
        resolve("button", {
          utils: item("utils", { registryDependencies: ["button"] }),
          button: item("button", { registryDependencies: ["utils"] }),
        }),
      (error) => {
        assert.ok(error instanceof RegistryError);
        assert.equal(
          error.message,
          "Registry dependency cycle detected:\nbutton -> utils -> button",
        );
        return true;
      },
    );
  });

  it("reports a missing registry dependency", async () => {
    await assert.rejects(
      () =>
        resolve("button", {
          button: item("button", {
            registryDependencies: ["does-not-exist"],
          }),
        }),
      (error) => {
        assert.ok(error instanceof RegistryError);
        assert.match(error.message, /Registry item not found/);
        assert.match(
          error.message,
          /http:\/\/localhost:3000\/r\/new-york\/does-not-exist\.json/,
        );
        return true;
      },
    );
  });
});

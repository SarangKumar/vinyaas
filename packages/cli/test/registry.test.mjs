import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  RegistryError,
  buildRegistryItemUrl,
  fetchRegistryItem,
} from "../src/lib/registry/client.ts";

const buttonItem = {
  $schema: "https://vinyaas.vercel.app/schema/registry-item.json",
  name: "button",
  type: "registry:ui",
  dependencies: ["class-variance-authority", "clsx", "tailwind-merge"],
  files: [
    {
      path: "ui/button/index.tsx",
      content: "export function Button() { return null; }\n",
      type: "registry:ui",
    },
  ],
};

function jsonResponse(status, body, { invalidJson = false } = {}) {
  return {
    ok: status >= 200 && status < 300,
    status,
    async json() {
      if (invalidJson) {
        throw new SyntaxError("Unexpected token");
      }

      return body;
    },
  };
}

function mockFetch(response) {
  const calls = [];
  const fetchImpl = async (url, init) => {
    calls.push({ url: String(url), init });

    if (response instanceof Error) {
      throw response;
    }

    if (typeof response === "function") {
      return response();
    }

    return response;
  };

  return { fetch: fetchImpl, calls };
}

describe("registry item url", () => {
  it("builds a registry item url without a trailing slash on the base", () => {
    assert.equal(
      buildRegistryItemUrl({
        baseUrl: "https://vinyaas.vercel.app",
        style: "new-york",
        name: "button",
      }),
      "https://vinyaas.vercel.app/r/new-york/button.json",
    );
  });

  it("builds the same url when the base has a trailing slash", () => {
    assert.equal(
      buildRegistryItemUrl({
        baseUrl: "https://vinyaas.vercel.app/",
        style: "new-york",
        name: "button",
      }),
      "https://vinyaas.vercel.app/r/new-york/button.json",
    );
  });

  it("uses REGISTRY_BASE_URL for a local registry", async () => {
    const { fetch, calls } = mockFetch(jsonResponse(200, buttonItem));

    await fetchRegistryItem({
      style: "new-york",
      name: "button",
      env: { REGISTRY_BASE_URL: "http://localhost:3000" },
      fetch,
    });

    assert.equal(calls[0].url, "http://localhost:3000/r/new-york/button.json");
    assert.equal(calls[0].init.method, "GET");
  });

  it("encodes dynamic path segments", () => {
    assert.equal(
      buildRegistryItemUrl({
        baseUrl: "https://vinyaas.vercel.app",
        style: "new york",
        name: "my button",
      }),
      "https://vinyaas.vercel.app/r/new%20york/my%20button.json",
    );
  });

  it("rejects a component name that is a url", () => {
    assert.throws(
      () =>
        buildRegistryItemUrl({
          baseUrl: "https://vinyaas.vercel.app",
          style: "new-york",
          name: "https://evil.example/button",
        }),
      RegistryError,
    );
  });
});

describe("fetchRegistryItem", () => {
  it("returns a validated button registry item", async () => {
    const { fetch, calls } = mockFetch(jsonResponse(200, buttonItem));
    const item = await fetchRegistryItem({
      baseUrl: "https://vinyaas.vercel.app",
      style: "new-york",
      name: "button",
      fetch,
    });

    assert.equal(
      calls[0].url,
      "https://vinyaas.vercel.app/r/new-york/button.json",
    );
    assert.deepEqual(item, buttonItem);
  });

  it("preserves optional registry metadata", async () => {
    const item = {
      ...buttonItem,
      devDependencies: ["@types/react"],
      registryDependencies: ["utils"],
      cssVars: {
        light: { background: "0 0% 100%" },
        dark: { background: "0 0% 0%" },
      },
      css: { ".button": "border-radius: 0.5rem;" },
      envVars: { NEXT_PUBLIC_API_URL: "https://example.com" },
      docs: "Button component.",
    };
    const { fetch } = mockFetch(jsonResponse(200, item));
    const parsed = await fetchRegistryItem({
      baseUrl: "https://vinyaas.vercel.app",
      style: "new-york",
      name: "button",
      fetch,
    });

    assert.deepEqual(parsed, item);
  });

  it("reports a missing registry item", async () => {
    const { fetch } = mockFetch(jsonResponse(404, { message: "missing" }));

    await assert.rejects(
      () =>
        fetchRegistryItem({
          baseUrl: "https://vinyaas.vercel.app",
          style: "new-york",
          name: "button",
          fetch,
        }),
      (error) => {
        assert.ok(error instanceof RegistryError);
        assert.equal(
          error.message,
          "Registry item not found:\nhttps://vinyaas.vercel.app/r/new-york/button.json",
        );
        return true;
      },
    );
  });

  it("reports other http failures", async () => {
    const { fetch } = mockFetch(jsonResponse(500, "unavailable"));

    await assert.rejects(
      () =>
        fetchRegistryItem({
          baseUrl: "https://vinyaas.vercel.app",
          style: "new-york",
          name: "button",
          fetch,
        }),
      (error) => {
        assert.ok(error instanceof RegistryError);
        assert.match(error.message, /Unable to load Vinyaas registry/);
        return true;
      },
    );
  });

  it("reports invalid json", async () => {
    const { fetch } = mockFetch(jsonResponse(200, null, { invalidJson: true }));

    await assert.rejects(
      () =>
        fetchRegistryItem({
          baseUrl: "https://vinyaas.vercel.app",
          style: "new-york",
          name: "button",
          fetch,
        }),
      (error) => {
        assert.ok(error instanceof RegistryError);
        assert.equal(error.message, "The registry returned invalid JSON.");
        assert.doesNotMatch(error.message, /SyntaxError/);
        return true;
      },
    );
  });

  it("reports a network failure", async () => {
    const { fetch } = mockFetch(new TypeError("connect ECONNREFUSED"));

    await assert.rejects(
      () =>
        fetchRegistryItem({
          baseUrl: "https://vinyaas.vercel.app",
          style: "new-york",
          name: "button",
          fetch,
        }),
      (error) => {
        assert.ok(error instanceof RegistryError);
        assert.match(error.message, /Unable to load Vinyaas registry/);
        assert.doesNotMatch(error.message, /ECONNREFUSED/);
        return true;
      },
    );
  });

  it("rejects a registry item that is missing required fields", async () => {
    const { fetch } = mockFetch(jsonResponse(200, { name: "button" }));

    await assert.rejects(
      () =>
        fetchRegistryItem({
          baseUrl: "https://vinyaas.vercel.app",
          style: "new-york",
          name: "button",
          fetch,
        }),
      (error) => {
        assert.ok(error instanceof RegistryError);
        assert.match(error.message, /missing/);
        assert.doesNotMatch(error.message, /at /);
        return true;
      },
    );
  });

  it("rejects an unsupported registry item type", async () => {
    const { fetch } = mockFetch(
      jsonResponse(200, { ...buttonItem, type: "registry:unknown" }),
    );

    await assert.rejects(
      () =>
        fetchRegistryItem({
          baseUrl: "https://vinyaas.vercel.app",
          style: "new-york",
          name: "button",
          fetch,
        }),
      (error) => {
        assert.ok(error instanceof RegistryError);
        assert.match(error.message, /type must be one of: registry:ui/);
        return true;
      },
    );
  });

  it("rejects malformed file entries", async () => {
    const { fetch } = mockFetch(
      jsonResponse(200, {
        ...buttonItem,
        files: [{ path: "ui/button/index.tsx" }],
      }),
    );

    await assert.rejects(
      () =>
        fetchRegistryItem({
          baseUrl: "https://vinyaas.vercel.app",
          style: "new-york",
          name: "button",
          fetch,
        }),
      (error) => {
        assert.ok(error instanceof RegistryError);
        assert.match(error.message, /files\[0\] is missing content/);
        return true;
      },
    );
  });
});

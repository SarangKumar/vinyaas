import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  componentsSchemaUrl,
  defaultRegistryBasePath,
  getRegistryBasePath,
  getRegistryOrigin,
  normalizeRegistryBasePath,
  registryItemSchemaUrl,
  RegistryBasePathError,
} from "../../../config/registry.ts";

describe("getRegistryBasePath", () => {
  it("uses REGISTRY_BASE_PATH for local development", () => {
    const path = getRegistryBasePath({
      REGISTRY_BASE_PATH: "http://localhost:3000/r",
    });

    assert.equal(path, "http://localhost:3000/r");
    assert.equal(
      registryItemSchemaUrl(path),
      "http://localhost:3000/r/schema/registry-item.json",
    );
    assert.equal(
      componentsSchemaUrl(path),
      "http://localhost:3000/r/schema/components.json",
    );
  });

  it("uses REGISTRY_BASE_PATH for production", () => {
    const path = getRegistryBasePath({
      REGISTRY_BASE_PATH: "https://vinyaas.vercel.app/r",
    });

    assert.equal(path, "https://vinyaas.vercel.app/r");
    assert.equal(
      registryItemSchemaUrl(path),
      "https://vinyaas.vercel.app/r/schema/registry-item.json",
    );
    assert.equal(
      componentsSchemaUrl(path),
      "https://vinyaas.vercel.app/r/schema/components.json",
    );
  });

  it("normalizes a legacy REGISTRY_BASE_URL origin to a /r path", () => {
    assert.equal(
      getRegistryBasePath({ REGISTRY_BASE_URL: "http://localhost:3000" }),
      "http://localhost:3000/r",
    );
    assert.equal(
      getRegistryBasePath({
        REGISTRY_BASE_URL: "https://vinyaas.vercel.app/",
      }),
      "https://vinyaas.vercel.app/r",
    );
  });

  it("prefers REGISTRY_BASE_PATH over REGISTRY_BASE_URL", () => {
    assert.equal(
      getRegistryBasePath({
        REGISTRY_BASE_PATH: "https://vinyaas.vercel.app/r",
        REGISTRY_BASE_URL: "http://localhost:3000",
      }),
      "https://vinyaas.vercel.app/r",
    );
  });

  it("falls back to the local development path when unset", () => {
    assert.equal(getRegistryBasePath({}), defaultRegistryBasePath);
    assert.equal(getRegistryOrigin(defaultRegistryBasePath), "http://localhost:3000");
  });

  it("fails clearly when required and missing", () => {
    assert.throws(
      () => getRegistryBasePath({}, { require: true }),
      (error) => {
        assert.ok(error instanceof RegistryBasePathError);
        assert.match(error.message, /REGISTRY_BASE_PATH is required/);
        return true;
      },
    );
  });

  it("fails clearly in production when missing", () => {
    assert.throws(
      () => getRegistryBasePath({ NODE_ENV: "production" }),
      RegistryBasePathError,
    );
  });

  it("rejects invalid values", () => {
    assert.throws(
      () => normalizeRegistryBasePath("not-a-url"),
      RegistryBasePathError,
    );
    assert.throws(
      () => normalizeRegistryBasePath("https://vinyaas.vercel.app/api"),
      RegistryBasePathError,
    );
  });
});

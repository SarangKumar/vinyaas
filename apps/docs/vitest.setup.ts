import "@testing-library/jest-dom/vitest";

// jsdom does not implement ResizeObserver; polyfill it for tests that render
// components using it (Beam, FuseButton). The no-op is intentional: jsdom has
// no layout engine so geometry will always be null anyway.
if (typeof global.ResizeObserver === "undefined") {
  global.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import registryItemSchema from "../public/schema/registry-item.json";
import { registry as newYork } from "./new-york/registry";
import { themes } from "./registry";
import { readRegistryItemFiles, serializeRegistryItem } from "./serialize";
import { registryItemTypes, type RegistryItem } from "./types";

const registryDirectory = path.dirname(fileURLToPath(import.meta.url));
const docsRoot = path.resolve(registryDirectory, "..");
const repoRoot = path.resolve(docsRoot, "../..");
const schemaUrl = "https://registry.example/schema/registry-item.json";

function buttonItem() {
  const button = newYork.find((item) => item.name === "button");

  if (!button) {
    throw new Error("Expected a button registry item");
  }

  return button;
}

describe("button registry item", () => {
  it("declares its npm dependencies and no registry dependency", () => {
    const button = buttonItem();

    expect(newYork.some((item) => item.name === "utils")).toBe(false);
    expect(button.type).toBe("registry:ui");
    expect(button.dependencies).toEqual([
      "class-variance-authority",
      "clsx",
      "tailwind-merge",
    ]);
    expect(
      button.dependencies?.some((dependency) => dependency.startsWith("@/")),
    ).toBe(false);
    expect(button.registryDependencies).toBeUndefined();
    expect(button.files).toEqual([
      {
        path: "ui/button/index.tsx",
        type: "registry:ui",
      },
    ]);
  });
});

describe("serializeRegistryItem", () => {
  it("represents registry dependencies and optional metadata", () => {
    const item: RegistryItem = {
      name: "card",
      type: "registry:ui",
      dependencies: ["zod"],
      devDependencies: ["@types/node"],
      registryDependencies: ["button"],
      files: [
        {
          path: "ui/card/index.tsx",
          type: "registry:ui",
          target: "components/ui/card.tsx",
        },
      ],
      cssVars: {
        light: { background: "0 0% 100%" },
        dark: { background: "0 0% 0%" },
      },
      css: {
        ".card": "border-radius: 0.5rem;",
      },
      envVars: {
        NEXT_PUBLIC_API_URL: "https://example.com",
      },
      docs: "Card layout.",
    };

    const payload = serializeRegistryItem(
      item,
      [
        {
          path: "ui/card/index.tsx",
          content: "export function Card() { return null; }\n",
          type: "registry:ui",
          target: "components/ui/card.tsx",
        },
      ],
      schemaUrl,
    );

    expect(payload).toEqual({
      $schema: schemaUrl,
      name: "card",
      type: "registry:ui",
      dependencies: ["zod"],
      devDependencies: ["@types/node"],
      registryDependencies: ["button"],
      files: [
        {
          path: "ui/card/index.tsx",
          content: "export function Card() { return null; }\n",
          type: "registry:ui",
          target: "components/ui/card.tsx",
        },
      ],
      cssVars: {
        light: { background: "0 0% 100%" },
        dark: { background: "0 0% 0%" },
      },
      css: {
        ".card": "border-radius: 0.5rem;",
      },
      envVars: {
        NEXT_PUBLIC_API_URL: "https://example.com",
      },
      docs: "Card layout.",
    });
    expect(Object.keys(payload)).toEqual([
      "$schema",
      "name",
      "type",
      "dependencies",
      "devDependencies",
      "registryDependencies",
      "files",
      "cssVars",
      "css",
      "envVars",
      "docs",
    ]);
  });

  it("omits empty optional metadata and keeps an empty dependency list", () => {
    const payload = serializeRegistryItem(
      {
        name: "plain",
        type: "registry:ui",
        devDependencies: [],
        registryDependencies: [],
        files: [{ path: "ui/plain.tsx" }],
        cssVars: { light: {}, dark: {} },
        css: {},
        envVars: {},
        docs: "   ",
      },
      [{ path: "ui/plain.tsx", content: "export {};\n" }],
      schemaUrl,
    );

    expect(payload).toEqual({
      $schema: schemaUrl,
      name: "plain",
      type: "registry:ui",
      dependencies: [],
      files: [{ path: "ui/plain.tsx", content: "export {};\n" }],
    });
  });

  it("keeps only the populated css variable modes", () => {
    const payload = serializeRegistryItem(
      {
        name: "theme",
        type: "registry:ui",
        files: [],
        cssVars: {
          dark: { background: "0 0% 0%" },
        },
      },
      [],
      schemaUrl,
    );

    expect(payload.cssVars).toEqual({
      dark: { background: "0 0% 0%" },
    });
  });

  it("serializes the same item to the same json", () => {
    const item: RegistryItem = {
      name: "card",
      type: "registry:ui",
      registryDependencies: ["button"],
      files: [{ path: "ui/card/index.tsx", type: "registry:ui" }],
      docs: "Card layout.",
    };
    const files = [
      {
        path: "ui/card/index.tsx",
        content: "export function Card() { return null; }\n",
        type: "registry:ui" as const,
      },
    ];

    expect(JSON.stringify(serializeRegistryItem(item, files, schemaUrl))).toBe(
      JSON.stringify(serializeRegistryItem(item, files, schemaUrl)),
    );
  });
});

describe("input registry item", () => {
  it("declares the class-name dependencies and no registry dependency", () => {
    const input = newYork.find((item) => item.name === "input");

    expect(input?.type).toBe("registry:ui");
    expect(input?.dependencies).toEqual(["clsx", "tailwind-merge"]);
    expect(input?.registryDependencies).toBeUndefined();
    expect(input?.files).toEqual([
      {
        path: "ui/input/index.tsx",
        type: "registry:ui",
      },
    ]);
  });
});

describe("registry build output", () => {
  it("uses index.tsx as the only component entry file layout", async () => {
    for (const item of newYork) {
      const entryFiles = item.files.filter((file) =>
        file.path.endsWith(".tsx"),
      );
      expect(entryFiles.length).toBeGreaterThan(0);

      for (const file of entryFiles) {
        expect(file.path).toBe(`ui/${item.name}/index.tsx`);
        expect(file.path).not.toBe(`ui/${item.name}/${item.name}.tsx`);
      }

      const sourceEntry = path.join(
        docsRoot,
        "registry/new-york",
        `ui/${item.name}/index.tsx`,
      );
      const legacyEntry = path.join(
        docsRoot,
        "registry/new-york",
        `ui/${item.name}/${item.name}.tsx`,
      );

      await expect(fs.access(sourceEntry)).resolves.toBeUndefined();
      await expect(fs.access(legacyEntry)).rejects.toThrow();
    }
  });

  it("keeps the new-york button artifact aligned with the source item", async () => {
    const outputPath = path.join(docsRoot, "public/r/new-york/button.json");
    const sourcePath = path.join(
      docsRoot,
      "registry/new-york/ui/button/index.tsx",
    );
    const [rawOutput, source] = await Promise.all([
      fs.readFile(outputPath, "utf8"),
      fs.readFile(sourcePath, "utf8"),
    ]);
    const generated = JSON.parse(rawOutput) as {
      $schema: string;
      dependencies: string[];
      registryDependencies?: string[];
      files: { path: string; content: string }[];
    };
    const button = buttonItem();
    const files = await readRegistryItemFiles(button, async (relativePath) => {
      expect(relativePath).toBe("ui/button/index.tsx");
      return source;
    });
    const payload = serializeRegistryItem(button, files, generated.$schema);

    expect(Object.keys(themes)).toEqual(["new-york"]);
    expect(generated.$schema).toMatch(/\/schema\/registry-item\.json$/);
    expect(generated).toEqual(payload);
    expect(generated.dependencies).toEqual([
      "class-variance-authority",
      "clsx",
      "tailwind-merge",
    ]);
    expect(generated.files.map((file) => file.path)).toEqual([
      "ui/button/index.tsx",
    ]);
    expect(generated.files[0]?.content).toBe(source);
    expect(generated.files[0]?.content).toContain('from "@/lib/utils"');
    expect(generated).not.toHaveProperty("registryDependencies");
    expect(generated).not.toHaveProperty("devDependencies");
    expect(generated).not.toHaveProperty("cssVars");
    expect(generated).not.toHaveProperty("css");
    expect(generated).not.toHaveProperty("envVars");
    expect(generated).not.toHaveProperty("docs");
  });

  it("keeps the new-york input artifact aligned with the source item", async () => {
    const outputPath = path.join(docsRoot, "public/r/new-york/input.json");
    const sourcePath = path.join(
      docsRoot,
      "registry/new-york/ui/input/index.tsx",
    );
    const [rawOutput, source] = await Promise.all([
      fs.readFile(outputPath, "utf8"),
      fs.readFile(sourcePath, "utf8"),
    ]);
    const generated = JSON.parse(rawOutput) as {
      $schema: string;
      name: string;
      type: string;
      dependencies: string[];
      files: { path: string; content: string }[];
    };
    const input = newYork.find((item) => item.name === "input");

    if (!input) {
      throw new Error("Expected an input registry item");
    }

    const files = await readRegistryItemFiles(input, async (relativePath) => {
      expect(relativePath).toBe("ui/input/index.tsx");
      return source;
    });
    const payload = serializeRegistryItem(input, files, generated.$schema);

    expect(generated).toEqual(payload);
    expect(generated.$schema).toBe(
      "https://vinyaas.vercel.app/schema/registry-item.json",
    );
    expect(generated.name).toBe("input");
    expect(generated.type).toBe("registry:ui");
    expect(generated.dependencies).toEqual(["clsx", "tailwind-merge"]);
    expect(generated.files[0]?.content).toBe(source);
    expect(generated.files[0]?.content).toContain('from "@/lib/utils"');
    expect(generated).not.toHaveProperty("registryDependencies");
  });

  it("keeps the new-york textarea artifact aligned with the source item", async () => {
    const outputPath = path.join(docsRoot, "public/r/new-york/textarea.json");
    const sourcePath = path.join(
      docsRoot,
      "registry/new-york/ui/textarea/index.tsx",
    );
    const [rawOutput, source] = await Promise.all([
      fs.readFile(outputPath, "utf8"),
      fs.readFile(sourcePath, "utf8"),
    ]);
    const generated = JSON.parse(rawOutput) as {
      $schema: string;
      name: string;
      type: string;
      dependencies: string[];
      files: { path: string; content: string }[];
    };
    const textarea = newYork.find((item) => item.name === "textarea");

    if (!textarea) {
      throw new Error("Expected a textarea registry item");
    }

    const files = await readRegistryItemFiles(
      textarea,
      async (relativePath) => {
        expect(relativePath).toBe("ui/textarea/index.tsx");
        return source;
      },
    );
    const payload = serializeRegistryItem(textarea, files, generated.$schema);

    expect(generated).toEqual(payload);
    expect(generated.$schema).toBe(
      "https://vinyaas.vercel.app/schema/registry-item.json",
    );
    expect(generated.name).toBe("textarea");
    expect(generated.type).toBe("registry:ui");
    expect(generated.dependencies).toEqual(["clsx", "tailwind-merge"]);
    expect(textarea.registryDependencies).toBeUndefined();
    expect(generated.files[0]?.content).toBe(source);
    expect(generated.files[0]?.content).toContain('from "@/lib/utils"');
    expect(generated).not.toHaveProperty("registryDependencies");
  });

  it("keeps the new-york label artifact aligned with the source item", async () => {
    const outputPath = path.join(docsRoot, "public/r/new-york/label.json");
    const sourcePath = path.join(
      docsRoot,
      "registry/new-york/ui/label/index.tsx",
    );
    const [rawOutput, source] = await Promise.all([
      fs.readFile(outputPath, "utf8"),
      fs.readFile(sourcePath, "utf8"),
    ]);
    const generated = JSON.parse(rawOutput) as {
      $schema: string;
      name: string;
      type: string;
      dependencies: string[];
      files: { path: string; content: string }[];
    };
    const label = newYork.find((item) => item.name === "label");

    if (!label) {
      throw new Error("Expected a label registry item");
    }

    const files = await readRegistryItemFiles(label, async (relativePath) => {
      expect(relativePath).toBe("ui/label/index.tsx");
      return source;
    });
    const payload = serializeRegistryItem(label, files, generated.$schema);

    expect(generated).toEqual(payload);
    expect(generated.$schema).toBe(
      "https://vinyaas.vercel.app/schema/registry-item.json",
    );
    expect(generated.name).toBe("label");
    expect(generated.type).toBe("registry:ui");
    expect(generated.dependencies).toEqual(["clsx", "tailwind-merge"]);
    expect(label.registryDependencies).toBeUndefined();
    expect(generated.files[0]?.content).toBe(source);
    expect(generated.files[0]?.content).toContain('from "@/lib/utils"');
    expect(generated).not.toHaveProperty("registryDependencies");
  });

  it("keeps the new-york checkbox artifact aligned with the source item", async () => {
    const outputPath = path.join(docsRoot, "public/r/new-york/checkbox.json");
    const sourcePath = path.join(
      docsRoot,
      "registry/new-york/ui/checkbox/index.tsx",
    );
    const [rawOutput, source] = await Promise.all([
      fs.readFile(outputPath, "utf8"),
      fs.readFile(sourcePath, "utf8"),
    ]);
    const generated = JSON.parse(rawOutput) as {
      $schema: string;
      name: string;
      type: string;
      dependencies: string[];
      files: { path: string; content: string }[];
    };
    const checkbox = newYork.find((item) => item.name === "checkbox");

    if (!checkbox) {
      throw new Error("Expected a checkbox registry item");
    }

    const files = await readRegistryItemFiles(
      checkbox,
      async (relativePath) => {
        expect(relativePath).toBe("ui/checkbox/index.tsx");
        return source;
      },
    );
    const payload = serializeRegistryItem(checkbox, files, generated.$schema);

    expect(generated).toEqual(payload);
    expect(generated.$schema).toBe(
      "https://vinyaas.vercel.app/schema/registry-item.json",
    );
    expect(generated.name).toBe("checkbox");
    expect(generated.type).toBe("registry:ui");
    expect(generated.dependencies).toEqual(["clsx", "tailwind-merge"]);
    expect(checkbox.registryDependencies).toBeUndefined();
    expect(generated.files[0]?.content).toBe(source);
    expect(generated).not.toHaveProperty("registryDependencies");
  });

  it("keeps the new-york radio-group artifact aligned with the source item", async () => {
    const outputPath = path.join(
      docsRoot,
      "public/r/new-york/radio-group.json",
    );
    const sourcePath = path.join(
      docsRoot,
      "registry/new-york/ui/radio-group/index.tsx",
    );
    const [rawOutput, source] = await Promise.all([
      fs.readFile(outputPath, "utf8"),
      fs.readFile(sourcePath, "utf8"),
    ]);
    const generated = JSON.parse(rawOutput) as {
      $schema: string;
      name: string;
      type: string;
      dependencies: string[];
      files: { path: string; content: string }[];
    };
    const radioGroup = newYork.find((item) => item.name === "radio-group");

    if (!radioGroup) {
      throw new Error("Expected a radio-group registry item");
    }

    const files = await readRegistryItemFiles(
      radioGroup,
      async (relativePath) => {
        expect(relativePath).toBe("ui/radio-group/index.tsx");
        return source;
      },
    );
    const payload = serializeRegistryItem(radioGroup, files, generated.$schema);

    expect(generated).toEqual(payload);
    expect(generated.$schema).toBe(
      "https://vinyaas.vercel.app/schema/registry-item.json",
    );
    expect(generated.name).toBe("radio-group");
    expect(generated.type).toBe("registry:ui");
    expect(generated.dependencies).toEqual(["clsx", "tailwind-merge"]);
    expect(radioGroup.registryDependencies).toBeUndefined();
    expect(generated.files[0]?.content).toBe(source);
    expect(generated.files[0]?.content).toContain('"use client"');
    expect(generated).not.toHaveProperty("registryDependencies");
  });

  it.each([
    ["avatar", ["ui/avatar/index.tsx"], '"use client"'],
    ["progress", ["ui/progress/index.tsx"], "<progress"],
    ["skeleton", ["ui/skeleton/index.tsx"], "aria-hidden"],
    ["separator", ["ui/separator/index.tsx"], "<hr"],
    ["kbd", ["ui/kbd/index.tsx"], "<kbd"],
    ["switch", ["ui/switch/index.tsx"], 'role="switch"'],
    ["table", ["ui/table/index.tsx"], "<table"],
    [
      "tooltip",
      ["ui/tooltip/index.tsx", "ui/tooltip/tooltip.css"],
      'role="tooltip"',
    ],
    ["native-select", ["ui/native-select/index.tsx"], "<select"],
    ["toast", ["ui/toast/index.tsx", "ui/toast/toast.css"], "toast.add"],
    ["popover", ["ui/popover/index.tsx"], "PopoverContent"],
    ["badge", ["ui/badge/index.tsx"], "<span"],
    ["spinner", ["ui/spinner/index.tsx"], "aria-hidden"],
    ["card", ["ui/card/index.tsx"], "CardAction"],
    ["alert", ["ui/alert/index.tsx"], 'role="alert"'],
    [
      "dialog",
      ["ui/dialog/index.tsx", "ui/dialog/dialog.css"],
      'role="dialog"',
    ],
    ["accordion", ["ui/accordion/index.tsx"], "aria-expanded"],
    ["breadcrumb", ["ui/breadcrumb/index.tsx"], "breadcrumb"],
    ["scroll-area", ["ui/scroll-area/index.tsx"], "data-scroll-area"],
    ["slider", ["ui/slider/index.tsx"], 'type="range"'],
    ["hover-card", ["ui/hover-card/index.tsx"], "HoverCardContent"],
    ["marker", ["ui/marker/index.tsx"], "MarkerContent"],
    ["input-group", ["ui/input-group/index.tsx"], "InputGroupInput"],
    ["input-otp", ["ui/input-otp/index.tsx"], "InputOTPSlot"],
    ["file-upload", ["ui/file-upload/index.tsx"], "FileUploadDropzone"],
    ["command", ["ui/command/index.tsx"], "CommandInput"],
    ["dropdown-menu", ["ui/dropdown-menu/index.tsx"], "DropdownMenuContent"],
    ["typography", ["ui/typography/index.tsx"], "TypographyH1"],
  ])(
    "keeps the new-york %s artifact aligned with the source item",
    async (name, filePaths, sourceMarker) => {
      const outputPath = path.join(docsRoot, `public/r/new-york/${name}.json`);
      const sources = Object.fromEntries(
        await Promise.all(
          filePaths.map(async (filePath) => {
            const source = await fs.readFile(
              path.join(docsRoot, `registry/new-york/${filePath}`),
              "utf8",
            );
            return [filePath, source] as const;
          }),
        ),
      );
      const rawOutput = await fs.readFile(outputPath, "utf8");
      const generated = JSON.parse(rawOutput) as {
        $schema: string;
        name: string;
        type: string;
        dependencies: string[];
        files: { path: string; content: string }[];
      };
      const item = newYork.find((entry) => entry.name === name);

      if (!item) {
        throw new Error(`Expected a ${name} registry item`);
      }

      const files = await readRegistryItemFiles(item, async (relativePath) => {
        expect(filePaths).toContain(relativePath);
        return sources[relativePath]!;
      });
      const payload = serializeRegistryItem(item, files, generated.$schema);
      const componentFile = generated.files.find((file) =>
        file.path.endsWith(".tsx"),
      );

      expect(generated).toEqual(payload);
      expect(generated.$schema).toBe(
        "https://vinyaas.vercel.app/schema/registry-item.json",
      );
      expect(generated.name).toBe(name);
      expect(generated.type).toBe("registry:ui");
      expect(generated.dependencies).toEqual(["clsx", "tailwind-merge"]);
      expect(item.registryDependencies).toBeUndefined();
      expect(generated.files.map((file) => file.path)).toEqual(filePaths);
      expect(componentFile?.content).toBe(sources[filePaths[0]!]!);
      expect(componentFile?.content).toContain('from "@/lib/utils"');
      expect(componentFile?.content).toContain(sourceMarker);
      expect(componentFile?.content).not.toContain("dangerouslySetInnerHTML");
      expect(componentFile?.content).not.toContain("<style");
      expect(generated).not.toHaveProperty("registryDependencies");
      expect(JSON.stringify(generated)).not.toContain("utils.json");

      for (const filePath of filePaths.filter((path) =>
        path.endsWith(".css"),
      )) {
        const cssFile = generated.files.find((file) => file.path === filePath);
        expect(cssFile?.content).toBe(sources[filePath]);
        expect(cssFile?.content).toContain("@keyframes");
        expect(cssFile?.content).toContain("prefers-reduced-motion");
        expect(componentFile?.content).toContain(
          `import "./${path.basename(filePath)}"`,
        );
      }
    },
  );

  it("does not publish utils as a registry item", async () => {
    const outputPath = path.join(docsRoot, "public/r/new-york/utils.json");

    await expect(fs.access(outputPath)).rejects.toThrow();
    expect(newYork.some((item) => item.name === "utils")).toBe(false);
  });

  it("does not publish a Select registry item", async () => {
    const outputPath = path.join(docsRoot, "public/r/new-york/select.json");

    await expect(fs.access(outputPath)).rejects.toThrow();
    expect(newYork.some((item) => item.name === "select")).toBe(false);
    expect(newYork).toHaveLength(34);
  });

  it("matches the json schema item types", () => {
    expect(registryItemSchema.properties.type.enum).toEqual([
      ...registryItemTypes,
    ]);
    expect(
      registryItemSchema.properties.files.items.properties.type.enum,
    ).toEqual([...registryItemTypes]);
    expect(Object.keys(registryItemSchema.properties).sort()).toEqual(
      [
        "$schema",
        "css",
        "cssVars",
        "dependencies",
        "devDependencies",
        "docs",
        "envVars",
        "files",
        "name",
        "registryDependencies",
        "type",
      ].sort(),
    );
  });
});

describe("local imports", () => {
  it("does not turn local imports into dependencies or extra files", async () => {
    const source = [
      'import { cn } from "@/lib/utils";',
      'import { Button } from "../button";',
      "",
      "export function Card() {",
      "  return null;",
      "}",
      "",
    ].join("\n");
    const reads: string[] = [];
    const item: RegistryItem = {
      name: "card",
      type: "registry:ui",
      registryDependencies: ["button"],
      files: [{ path: "ui/card/index.tsx", type: "registry:ui" }],
    };

    const files = await readRegistryItemFiles(item, async (relativePath) => {
      reads.push(relativePath);
      return source;
    });
    const payload = serializeRegistryItem(item, files, schemaUrl);

    expect(reads).toEqual(["ui/card/index.tsx"]);
    expect(payload.dependencies).toEqual([]);
    expect(payload.registryDependencies).toEqual(["button"]);
    expect(payload.files.map((file) => file.path)).toEqual([
      "ui/card/index.tsx",
    ]);
    expect(payload.files[0]?.content).toContain('from "@/lib/utils"');
  });

  it("does not use the removed local import resolver", async () => {
    const resolverPath = path.join(repoRoot, "scripts/resolve-dependencies.ts");
    const buildScript = await fs.readFile(
      path.join(repoRoot, "scripts/build-registry.ts"),
      "utf8",
    );

    await expect(fs.access(resolverPath)).rejects.toThrow();
    expect(buildScript).not.toContain("resolve-dependencies");
    expect(buildScript).not.toContain("resolveDependencies");
  });
});

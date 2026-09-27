# Vinyaas

Vinyaas is a CLI that installs reusable UI components from a registry into an existing project. Components are copied in as source files. They are not consumed from a runtime component package.

## Prerequisites

- Node.js 20 or newer
- An existing Next.js project with React, Tailwind CSS, a global stylesheet at `app/globals.css` or `src/app/globals.css`, and an `@/*` path alias in `tsconfig.json` or `jsconfig.json`
- One of pnpm, npm, yarn, or bun

Vinyaas detects the package manager from the project lockfile: `pnpm-lock.yaml`, `yarn.lock`, `package-lock.json`, `bun.lock`, or `bun.lockb`. It does not fall back to npm when no lockfile is present. If a component needs packages that are not already declared, the install fails until the project has exactly one of those lockfiles.

## Installation

Install the published package:

```bash
npm install -g @vinyaas/cli
```

```bash
vinyaas --version
vinyaas --help
```

## Initialize a project

From the project root:

```bash
vinyaas init
```

`init` detects the project and creates `components.json` and `lib/utils.ts`. It does not overwrite an existing `components.json`. If `lib/utils.ts` already exists, that file is left unchanged. `lib/utils.ts` is project infrastructure, not a registry component. It exports `cn` for class names.

A TypeScript Next.js app with `app/globals.css` gets:

```json
{
  "$schema": "https://vinyaas.vercel.app/schema/components.json",
  "style": "new-york",
  "tsx": true,
  "tailwind": {
    "css": "app/globals.css",
    "baseColor": "neutral",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "ui": "@/components/ui",
    "utils": "@/lib/utils"
  }
}
```

- `style` selects the registry style. The current style is `new-york`.
- `tailwind.css` is the stylesheet Vinyaas updates. It is `app/globals.css` or `src/app/globals.css`, whichever exists.
- `tailwind.baseColor` is `neutral`. `tailwind.cssVariables` is `true`.
- `tsx` is `true` when `tsconfig.json` exists, and `false` otherwise.
- `aliases` map registry files onto import paths. `ui` is where UI components are installed. `utils` is the import path for the `cn` helper at `lib/utils.ts`.

## Add a component

```bash
vinyaas add button
```

For each component, Vinyaas:

1. Fetches the registry item.
2. Resolves registry dependencies when the item declares them. Button does not declare any.
3. Collects the npm dependencies declared by those items.
4. Installs dependencies that the project does not already declare.
5. Writes the component source files.
6. Applies CSS only when the registry item declares `cssVars` or `css`.
7. Reports required environment variables only when the item declares `envVars`.
8. Reports documentation URLs only when the item declares `docs`.

Not every component includes CSS, environment variables, or documentation.

## Where files are installed

The `ui` alias controls UI component paths. The default `@/components/ui` installs files under `components/ui/`.

`lib/utils.ts` is created by `vinyaas init`. Registry items do not install it.

## `--cwd`

`--cwd` selects the consumer project. Relative paths are resolved from the current working directory. It does not change the registry URL.

```bash
vinyaas init --cwd ./my-app
vinyaas add button --cwd ./my-app
vinyaas add --cwd ./my-app button
```

## `--force`

```bash
vinyaas add button --force
```

`--force` replaces existing component files with the exact registry content. It does not overwrite CSS when the existing value differs, and it does not modify `.env` files or `components.json`. Path checks, dependency conflicts, and other validation still run. `vinyaas init` does not accept `--force`.

## CSS

CSS is changed only when a registry item declares `cssVars` or `css`. Those changes are written to the file in `tailwind.css`. An existing variable or rule with a different value stops the install instead of being replaced. Vinyaas does not create or modify environment files.

## Environment variables

A registry item can declare environment variables it requires. Vinyaas reports which names are missing and which are already set. It does not create `.env` files, does not generate secret values, and does not print existing values.

## Registry

The CLI uses `https://vinyaas.vercel.app` when `REGISTRY_BASE_URL` is unset. Leave it unset for the default registry.

To use another registry, set the variable for that command:

```bash
REGISTRY_BASE_URL=http://localhost:3000 vinyaas add button
```

## Example

From a Next.js app:

```bash
npm install -g @vinyaas/cli

cd my-next-app

vinyaas init
vinyaas add button
```

`vinyaas init` writes `components.json` and `lib/utils.ts`. `vinyaas add button` adds `class-variance-authority`, `clsx`, and `tailwind-merge` when they are not already declared, and writes the button source:

```text
components.json
lib/utils.ts
components/ui/button/button.tsx
```

The current Button item does not declare CSS, environment variables, or a documentation URL, so those steps do not change `app/globals.css` and do not print an environment or documentation section.

## Component conventions

v0.2 components follow the existing Button.

- Registry name, folder, and file use the same lowercase name: `button` → `ui/button/button.tsx`.
- `vinyaas add button` installs that file under the `ui` alias, by default `components/ui/button/button.tsx`.
- The file exports a PascalCase component, `Button`, and a props type, `ButtonProps`.
- Variants use `class-variance-authority` when a component has more than one visual style. Input, Textarea, Label, Checkbox, and Radio Group do not use it.
- Class names are merged with `cn` from `@/lib/utils`.
- Components render the native element and pass through its attributes, including `disabled` and `aria-*`.
- Colors use semantic utilities such as `bg-primary`, `text-foreground`, and `border-border`. The docs site defines those tokens in `apps/docs/app/globals.css`. Installed projects do not receive that theme file yet.
- Documentation pages live at `/components/<name>`. Each page shows a live example, the install command, a usage snippet, and the registry source.

## Accessibility

Components use the native element and the browser’s keyboard behavior.

- Button is a `<button>`. Enter and Space activate it. `disabled` blocks activation. Visible text is the accessible name. It is not a clickable `<div>`.
- Input is an `<input>`. A label associates with `htmlFor` and `id`. `disabled`, `aria-invalid`, and other ARIA attributes pass through. It does not wrap the control in an extra element.
- Textarea is a `<textarea>`. It uses the same label, focus, and disabled behavior as Input, and it passes through `rows`, `cols`, and the other native attributes.
- Label is a `<label>`. `htmlFor` matches the control `id`. It does not validate, store form state, or mark a field required.
- Checkbox is a native checkbox. Space toggles it. `name` and `value` submit with the form. `indeterminate` is the native mixed state.
- Radio Group is a set of native radios that share a name. Arrow keys move the selection. One option is submitted.
- Interactive elements use a visible `focus-visible` ring. Disabled controls use `cursor-not-allowed`.
- Future components should keep native semantics before adding custom keyboard behavior.
- Registry JSON embeds that source. It lists npm dependencies. It does not list `lib/utils.ts`.

## Development

The CLI is `packages/cli`. The registry and docs app are `apps/docs`.

```bash
pnpm install
pnpm --filter @vinyaas/cli build
pnpm --filter @vinyaas/cli test
pnpm test
```

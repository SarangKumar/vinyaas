# Vinyaas

Vinyaas is a CLI that installs reusable UI components from a registry into an existing project. Components are copied in as source files. They are not consumed from a runtime component package.

**v1.4.0** is the current release. It adds Toggle, Toggle Group, and Score Ring, `vinyaas update` (alias `upgrade`), an auto-growing Textarea (`maxRows`), single-key `⌘K` Kbd labels, a restyled Toast, and form, dialog, resizable, data table, and chart refinements, plus a static, lighter docs site with `/llm.txt` — on top of registry-owned catalogs, a release-wide accessibility contract, and CLI catalog/`--dry-run` UX across the existing installable set (forms, feedback, layout, navigation, data display, overlays, charts, typography, and utilities). Each item is independently installable. The homepage at `/` is the component showcase. `/introduction` is the documentation introduction. Full CLI reference: [vinyaas.vercel.app/cli](https://vinyaas.vercel.app/cli).

## Prerequisites

- Node.js 20 or newer
- An existing React, Next.js, or Vite project with Tailwind CSS v4, a global stylesheet, and an `@/*` path alias in `tsconfig.json` or `jsconfig.json`
- One of pnpm, npm, yarn, or bun

Vinyaas detects the package manager from the project lockfile: `pnpm-lock.yaml`, `yarn.lock`, `package-lock.json`, `bun.lock`, or `bun.lockb`. It does not fall back to npm when no lockfile is present. If a component needs packages that are not already declared, the install fails until the project has exactly one of those lockfiles.

## Installation

Install the CLI globally (recommended):

```bash
npm install -g vinyaas
pnpm add -g vinyaas
yarn global add vinyaas
bun add -g vinyaas
```

Or run once without a global install:

```bash
npx vinyaas init
pnpm dlx vinyaas init
yarn dlx vinyaas init
bunx vinyaas init
```

```bash
npx vinyaas --version
npx vinyaas --help
```

## Initialize a project

From the project root:

```bash
vinyaas init
vinyaas doctor
```

`init` detects the project and creates `components.json` and `lib/utils.ts` when missing. It does not overwrite an existing `components.json`. If `lib/utils.ts` already exists, that file is left unchanged. `lib/utils.ts` is project infrastructure, not a registry component. It exports `cn` for class names.

`doctor` validates Project, Styling, Dependencies, and Registry setup without writing files.

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

Install multiple components in one call. Shared packages install once:

```bash
vinyaas add button card badge
```

Install by registry category (metadata groups — not collections/packages):

```bash
vinyaas add --category forms
vinyaas add --category forms --yes
```

Preview without writing files:

```bash
vinyaas add button --dry-run
vinyaas add --category forms --dry-run
```

Already-installed components are skipped. Missing ones still install. Overwrite only with `--force`:

```bash
vinyaas add button --force
```

Check what Vinyaas recorded locally:

```bash
vinyaas status
```

Refresh installed components from the registry (overwrites local edits after confirmation):

```bash
vinyaas update button
vinyaas update
vinyaas update --yes
vinyaas upgrade button card   # upgrade is an alias of update
```

For each component, Vinyaas:

1. Fetches the registry item.
2. Resolves registry dependencies when the item declares them.
3. Collects the npm dependencies declared by those items.
4. Installs dependencies that the project does not already declare.
5. Writes the component source files under `components/ui/<name>/index.tsx`.
6. Applies CSS only when the registry item declares `cssVars` or `css`.
7. Reports required environment variables only when the item declares `envVars`.
8. Reports documentation URLs only when the item declares `docs`.

Not every component includes CSS, environment variables, or documentation. Some components also ship local CSS beside `index.tsx` (for example `toast.css`).

## Discover components

Browse the registry without installing anything:

```bash
vinyaas list
vinyaas list --category forms
vinyaas search input
vinyaas info button
```

- `vinyaas list` prints installable components (optionally filtered by `--category`).
- `vinyaas search <query>` matches component names and descriptions.
- `vinyaas info <component>` shows files, dependencies, registry dependencies, and documentation before you run `add`.

Each discovery command accepts `--json` for machine-readable stdout:

```bash
vinyaas list --json
vinyaas search input --json
vinyaas info toast --json
```

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

`--force` replaces existing component files with the exact registry content. Without it, already-installed components are skipped and the command continues. It does not overwrite CSS when the existing value differs, and it does not modify `.env` files or `components.json`. Path checks, dependency conflicts, and other validation still run. `vinyaas init` does not accept `--force`.

## CSS

CSS is changed only when a registry item declares `cssVars` or `css`. Those changes are written to the file in `tailwind.css`. An existing variable or rule with a different value stops the install instead of being replaced. Vinyaas does not create or modify environment files.

## Environment variables

A registry item can declare environment variables it requires. Vinyaas reports which names are missing and which are already set. It does not create `.env` files, does not generate secret values, and does not print existing values.

## Registry

Prefer `REGISTRY_BASE_PATH` (registry root ending in `/r`). Published CLI builds default to the Vinyaas registry. Leave the variable unset for that default.

To use another registry:

```bash
REGISTRY_BASE_PATH=https://vinyaas.vercel.app/r vinyaas add button
```

`REGISTRY_BASE_URL` (site origin) is accepted as a legacy alias and normalized to `/r`.

## Example

From a Next.js app:

```bash
npm install -g vinyaas

cd my-next-app

vinyaas init
vinyaas add button
```

`vinyaas init` prepares the consumer project for Vinyaas: Tailwind CSS v4, semantic theme tokens in the project CSS entry, `components.json`, import aliases, PostCSS, and `lib/utils`. `vinyaas add button` adds `class-variance-authority`, `clsx`, and `tailwind-merge` when they are not already declared, and writes the button source:

```text
components.json
lib/utils.ts
components/ui/button/index.tsx
```

The current Button item does not declare CSS, environment variables, or a documentation URL, so those steps do not change `app/globals.css` and do not print an environment or documentation section.

## Component conventions

Registry components follow the Button layout conventions:

- Registry name and folder use the same lowercase name; the entry file is `index.tsx`: `button` → `ui/button/index.tsx`.
- `vinyaas add button` installs that file under the `ui` alias, by default `components/ui/button/index.tsx`.
- Consumers import the directory: `import { Button } from "@/components/ui/button"`.
- The file exports a PascalCase component, `Button`, and a props type, `ButtonProps`.
- Variants use `class-variance-authority` when a component has more than one visual style. Input, Textarea, Label, Checkbox, Radio Group, Avatar, Progress, Skeleton, Separator, and Kbd do not use it.
- Class names are merged with `cn` from `@/lib/utils`.
- Form controls share one height scale: `sm` is `h-8`, the default is `h-9`, and `lg` is `h-10`. Button `md` and Input are both `h-9` and `text-sm`. Textarea uses the same border, type, padding, focus, and disabled treatment, with a content height.
- Components render the native element and pass through its attributes, including `disabled` and `aria-*`.
- Colors use semantic utilities such as `bg-primary`, `text-foreground`, and `border-border`. `vinyaas init` writes those tokens into the consumer global CSS for Tailwind CSS v4.
- Documentation pages live at `/components/<name>`. Each page shows a live example, the install command, a usage snippet, and the registry source.

## Accessibility

Components use the native element and the browser’s keyboard behavior.

- Button is a `<button>`. Enter and Space activate it. `disabled` blocks activation. Visible text is the accessible name. It is not a clickable `<div>`.
- Input is an `<input>`. A label associates with `htmlFor` and `id`. `disabled`, `aria-invalid`, and other ARIA attributes pass through. It does not wrap the control in an extra element.
- Textarea is a `<textarea>`. It uses the same label, focus, and disabled behavior as Input, and it passes through `rows`, `cols`, and the other native attributes.
- Label is a `<label>`. `htmlFor` matches the control `id`. It does not validate, store form state, or mark a field required.
- Checkbox is a native checkbox. Space toggles it. `name` and `value` submit with the form. `indeterminate` is the native mixed state.
- Radio Group is a set of native radios that share a name. Arrow keys move the selection. One option is submitted.
- Avatar is an image plus a fallback. The image uses `alt`. The fallback is not announced together with a loaded image.
- Progress is a native `<progress>` element. Omit `value` for the indeterminate state.
- Skeleton is a decorative placeholder with `aria-hidden`. The pulse stops under `prefers-reduced-motion`.
- Separator is an `<hr>` when horizontal. A vertical separator sets `aria-orientation="vertical"`.
- Kbd is a native `<kbd>`. It displays a key and does not handle keyboard events.
- Switch is a button with `role="switch"`. Click, Space, and Enter toggle it. It is not submitted with a form.
- Table is a native `<table>` with header, body, footer, and caption elements. It does not sort or paginate. A wide table scrolls inside its wrapper.
- Tooltip shows short, non-interactive text on hover and keyboard focus. Escape hides it. It does not take focus.
- Native Select is a composed native `<select>`, `<option>`, and `<optgroup>`. A plain `<select>` is enough when the composed parts are not needed. A custom popup Select is not implemented.
- Toast renders through an explicit `<Toaster />`. Error toasts use `role="alert"`. Other toasts use `role="status"`. A toast does not take focus when it appears.
- Popover opens a non-modal dialog. Escape and an outside click close it and return focus to the trigger. The panel may contain controls. It follows its trigger while the page scrolls, and long content scrolls inside the panel.
- Spinner hides its graphic from assistive technology and exposes a text label. The animation stops under `prefers-reduced-motion`.
- Badge is an inline label. It is not a button.
- Toggle is a `<button>` with `aria-pressed`. Click, Space, and Enter flip it. Icon-only toggles need an `aria-label`.
- Toggle Group is a `role="group"` of toggle buttons. Every item stays in the Tab order, and arrow keys, Home, and End also move focus between enabled items.
- Score Ring is a `role="meter"` with `aria-valuenow`, `aria-valuemin`, and `aria-valuemax`. Pass `label` to name it.
- Interactive elements use a visible `focus-visible` ring. Disabled controls use `cursor-not-allowed`.
- Future components should keep native semantics before adding custom keyboard behavior.
- Registry JSON embeds that source. It lists npm dependencies. It does not list `lib/utils.ts`.

## Development

The CLI is `packages/cli`. The registry and docs app are `apps/docs`.

```bash
pnpm install
pnpm registry:build
pnpm cli:build
pnpm verify
```

`pnpm verify` runs typecheck, lint, and tests for docs and the CLI.

Useful scripts:

- `pnpm dev` — docs app
- `pnpm registry:build` — rebuild `apps/docs/public/r` (uses `REGISTRY_BASE_PATH` / `.env`)
- `pnpm registry:schema:local` — rebuild from production, then point only `$schema` URLs at `http://localhost:3000/r` (local testing; docs URLs stay production)
- `pnpm registry:schema:production` — rebuild registry JSON with production `$schema` URLs under `https://vinyaas.vercel.app/r`
- `pnpm cli:build` — bundle the CLI
- `pnpm format` / `pnpm format:check` — Prettier
- `pnpm test:watch` — docs Vitest watch mode

`registry:schema:*` only changes generated `$schema` URLs via a full registry rebuild. It does not rewrite docs, npm, or GitHub links. `pnpm cli:release-check` fails if localhost registry URLs are present in generated JSON — restore with `pnpm registry:schema:production` before releasing.

### CLI release preparation

Development builds embed `http://localhost:3000/r` by default:

```bash
pnpm cli:build
```

Production release builds (registry + CLI, no publish) embed `https://vinyaas.vercel.app/r` and reject localhost:

```bash
pnpm cli:release-build
```

Deploy the docs site so `https://vinyaas.vercel.app/r` serves the rebuilt registry, then:

```bash
pnpm cli:release-check
```

Publish manually when ready:

```bash
cd packages/cli
npm publish --access public
```

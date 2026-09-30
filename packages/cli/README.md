# vinyaas

**Vinyaas** is a registry-driven React component library. The CLI installs UI components as **source** into your project — the same style of workflow as shadcn-style registries — built for **Tailwind CSS v4**.

Components land in your tree so you can edit them. They are not imported from a locked runtime package.

Docs: [https://vinyaas.vercel.app](https://vinyaas.vercel.app) · npm: [https://www.npmjs.com/package/vinyaas](https://www.npmjs.com/package/vinyaas)

## Installation

Global:

```bash
npm install -g vinyaas
# or
pnpm add -g vinyaas
yarn global add vinyaas
bun add -g vinyaas
```

Project-local (recommended for apps):

```bash
npm install vinyaas
pnpm add vinyaas
yarn add vinyaas
bun add vinyaas
```

Or run without installing:

```bash
npx vinyaas --help
pnpm dlx vinyaas --help
yarn dlx vinyaas --help
bunx vinyaas --help
```

Requires Node.js 20+.

## Quick start

```bash
vinyaas init
vinyaas add button
```

`init` prepares a React, Next.js, or Vite project (theme tokens, aliases, `components.json`, utils). `add` copies components into `components/ui/` and installs missing npm dependencies.

## Features

- Source-based components you own and edit
- Tailwind CSS v4 theme tokens and setup
- Registry architecture with installable JSON items
- Customizable UI after install — no locked design package
- Discovery commands (`list`, `search`, `info`) before you add files

## Commands

### Project setup

```bash
vinyaas init
```

Creates `components.json`, configures Tailwind v4 theme tokens and aliases, and installs required utilities when needed. Safe to re-run; does not overwrite an existing `components.json` or utils file.

### Project health

```bash
vinyaas doctor
```

Validates `components.json`, aliases, Tailwind v4, theme tokens, utility dependencies, and registry reachability without writing files. Use `--json` for scripting.

### Component installation

```bash
vinyaas add button
vinyaas add button card
vinyaas add button --yes
vinyaas add button --dry-run
vinyaas add button --force
vinyaas add --category forms
vinyaas add --category forms --yes
vinyaas add button card --dry-run
```

Copies registry source into your project. Files stay editable. Registry and npm dependencies resolve automatically. Already-installed components are skipped unless you pass `--force`.

Use component names for a precise install. Use `--category` to discover and install a whole group. Multi-component and category installs prompt for confirmation unless you pass `--yes`. Dry-run resolves the plan without writing files.

Successful installs record components in `.vinyaas/manifest.json`.

### Installation status

```bash
vinyaas status
vinyaas status --json
```

Shows components Vinyaas installed in this project. Vinyaas tracks installed components locally to support future update/remove workflows.

### Component discovery

```bash
vinyaas list
vinyaas list --category forms
vinyaas search button
vinyaas search input --category forms
vinyaas info button
```

Browse the catalog without writing files. List and info show each component's category. Filter with `--category`. Each command accepts `--json` for scripting.

## Documentation

- Site: [https://vinyaas.vercel.app](https://vinyaas.vercel.app)
- Installation: [https://vinyaas.vercel.app/installation](https://vinyaas.vercel.app/installation)
- Components: [https://vinyaas.vercel.app/components](https://vinyaas.vercel.app/components)
- Source: [https://github.com/SarangKumar/vinyaas](https://github.com/SarangKumar/vinyaas)

## License

MIT

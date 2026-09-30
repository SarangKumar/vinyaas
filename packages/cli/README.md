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

### Component installation

```bash
vinyaas add button
vinyaas add card dialog
vinyaas add button --force
```

Copies registry source into your project. Files stay editable. Registry and npm dependencies resolve automatically. Already-installed components are skipped unless you pass `--force`.

### Component discovery

```bash
vinyaas list
vinyaas search button
vinyaas info button
```

Browse the catalog without writing files. Each command accepts `--json` for scripting.

## Documentation

- Site: [https://vinyaas.vercel.app](https://vinyaas.vercel.app)
- Installation: [https://vinyaas.vercel.app/installation](https://vinyaas.vercel.app/installation)
- Components: [https://vinyaas.vercel.app/components](https://vinyaas.vercel.app/components)
- Source: [https://github.com/SarangKumar/vinyaas](https://github.com/SarangKumar/vinyaas)

## License

MIT

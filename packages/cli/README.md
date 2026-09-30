# vinyaas

CLI for installing [Vinyaas](https://vinyaas.vercel.app) UI components from the registry into an existing React project. Components are copied in as source — not consumed from a runtime package.

**npm:** [https://www.npmjs.com/package/vinyaas](https://www.npmjs.com/package/vinyaas)

## Requirements

- Node.js 20+
- A React project with Tailwind CSS v4
- A package manager lockfile (`pnpm-lock.yaml`, `package-lock.json`, `yarn.lock`, or `bun.lock` / `bun.lockb`)

## Install

```bash
npm install vinyaas
# or
pnpm add vinyaas
yarn add vinyaas
bun add vinyaas
```

Run without a local install:

```bash
npx vinyaas --help
pnpm dlx vinyaas --help
```

## Commands

### `vinyaas init`

Prepares the project for the registry: theme tokens in your global stylesheet, aliases, `components.json`, and `lib/utils.ts`. Idempotent — safe to re-run. Does not overwrite an existing `components.json` or utils file.

```bash
npx vinyaas init
```

### `vinyaas add <components…>`

Installs one or more registry components as source under `components/ui/<name>/`, resolves registry dependencies, and installs only missing npm packages.

```bash
npx vinyaas add button
npx vinyaas add button card dialog
npx vinyaas add button --force
```

### Discovery

```bash
npx vinyaas list
npx vinyaas search drawer
npx vinyaas info button
```

Each discovery command accepts `--json` for machine-readable output.

## Docs

- Site: [https://vinyaas.vercel.app](https://vinyaas.vercel.app)
- Installation: [https://vinyaas.vercel.app/installation](https://vinyaas.vercel.app/installation)
- Source: [https://github.com/SarangKumar/vinyaas](https://github.com/SarangKumar/vinyaas)

## License

MIT

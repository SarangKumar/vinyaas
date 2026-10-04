# vinyaas

**Vinyaas** is a registry-driven React UI toolkit for **Tailwind CSS v4**. The CLI copies component source into your project so you can edit it. Components are not imported from a locked runtime package.

Docs: [https://vinyaas.vercel.app](https://vinyaas.vercel.app) · CLI guide: [https://vinyaas.vercel.app/cli](https://vinyaas.vercel.app/cli) · npm: [https://www.npmjs.com/package/vinyaas](https://www.npmjs.com/package/vinyaas)

Requires Node.js 20+.

## Installation

Project-local (recommended):

```bash
npm install vinyaas
pnpm add vinyaas
yarn add vinyaas
bun add vinyaas
```

Global:

```bash
npm install -g vinyaas
pnpm add -g vinyaas
yarn global add vinyaas
bun add -g vinyaas
```

One-off (no install):

```bash
npx vinyaas --help
pnpm dlx vinyaas --help
yarn dlx vinyaas --help
bunx vinyaas --help
```

## Quick start

```bash
vinyaas init
vinyaas doctor
vinyaas add button
```

`init` prepares a React, Next.js, or Vite project. `doctor` validates the setup without writing files. `add` copies registry source into `components/ui/` and installs missing npm dependencies.

## What the CLI does

- Reads consumer configuration from `components.json`
- Fetches component metadata and source from the Vinyaas registry
- Resolves registry and npm dependencies
- Writes editable source under your project aliases
- Tracks successful installs in `.vinyaas/manifest.json`

## Commands

### Setup

```bash
vinyaas init
vinyaas init --yes
vinyaas doctor
vinyaas doctor --json
```

`init` detects the project when possible, finds a CSS entry, and creates `components.json`, theme tokens, aliases, and `lib/utils` when missing. It does not overwrite an existing `components.json` or utils file. `--yes` skips prompts and uses safe defaults.

`doctor` reports grouped checks (Project, Styling, Dependencies, Registry) and suggests fixes. It does not mutate the project.

### Install components

```bash
vinyaas add button
vinyaas add button card badge
vinyaas add button --force
vinyaas add button --dry-run
vinyaas add button card --yes
vinyaas add --catalog form
vinyaas add --catalog dashboard --dry-run
```

- One or more component names install in a single run.
- Catalog installs require `--catalog <id>` and confirm with `[Y/n]` (default Yes) unless `--yes` is set. Bare names never expand to catalogs.
- Already-installed components are skipped unless `--force` is set.
- `--dry-run` prints components, files, npm dependencies, and registry dependencies without writing files or installing packages.
- Multi-component installs prompt for confirmation unless `--yes` is set.
- Registry dependencies resolve automatically; only missing npm packages are installed.

### Catalogs

```bash
vinyaas catalog list
vinyaas catalog info form
vinyaas add --catalog form
```

Named catalogs are owned by the registry (`/r/catalogs/`), not hardcoded in the CLI. Current catalogs: `form`, `dashboard`, `navigation`, `feedback`, `application`. Membership lists only currently installable component IDs. Discovery commands do not install.

### Category installation

```bash
vinyaas add --category forms
vinyaas add --category forms --yes
vinyaas add --category forms --dry-run
```

Categories are registry metadata used for discovery and group install. They are **not** the same as named catalogs. Expansion uses the same install pipeline as named components.

Current categories: `forms`, `layout`, `navigation`, `feedback`, `data-display`, `typography`, `charts`, `utilities`.

Unknown categories fail with the available list. If you pass explicit component names together with `--category`, the names win and `--category` is ignored.

### Status

```bash
vinyaas status
vinyaas status --json
```

Lists components recorded in `.vinyaas/manifest.json` after successful installs. Useful for future update/remove workflows. Dry-run does not write the manifest.

### Discover

```bash
vinyaas catalog list
vinyaas catalog info form
vinyaas list
vinyaas list --category forms
vinyaas list --json
vinyaas search input
vinyaas search input --category forms
vinyaas search input --json
vinyaas info button
vinyaas info button --json
```

- `catalog list` / `catalog info` — named component groups
- `list` — browse installable components
- `search` — find by name or description
- `info` — inspect one component (files, dependencies, docs) before installing

Human output includes category, description, and docs when present. `--json` is for scripting.

### Shared options

Most project commands accept `--cwd <path>` to target another directory.

## components.json

`components.json` is local project configuration (style, aliases, Tailwind CSS path). The registry publishes component metadata and source separately.

See [components.json](https://vinyaas.vercel.app/components-json) for fields and examples.

## Registry

Published installs use the Vinyaas registry rooted at `https://vinyaas.vercel.app/r`. Override with:

```bash
REGISTRY_BASE_PATH=https://vinyaas.vercel.app/r vinyaas list
```

`REGISTRY_BASE_URL` (site origin) is accepted as a legacy alias and normalized to `/r`.

Each registry item can include `name`, `type`, `description`, `category`, `files`, `dependencies`, `registryDependencies`, and `docs`.

## Development builds

From the monorepo root:

```bash
# Local CLI bundle (embeds http://localhost:3000/r by default)
pnpm --filter vinyaas build

# Or point at a custom registry while developing
REGISTRY_BASE_PATH=http://localhost:3000/r pnpm --filter vinyaas build
```

## Release builds

Production releases rebuild registry artifacts and the CLI bundle with the production registry path embedded:

```bash
pnpm cli:release-build
pnpm cli:release-check
```

`cli:release-build` fails if `http://localhost:3000/r` remains in `packages/cli/dist/index.js`.

`cli:release-check` packs the package, installs the tarball into a temp prefix, and smoke-tests `vinyaas --version`, `--help`, and `info button`. It does **not** publish.

Publish order:

1. `pnpm cli:release-build`
2. Deploy the docs site so `https://vinyaas.vercel.app/r` serves the rebuilt registry
3. `pnpm cli:release-check` (expects `info button` docs to be `https://vinyaas.vercel.app/components/button`)
4. Publish manually:

```bash
cd packages/cli
npm publish --access public
```

## Documentation

For Next.js, React + Vite, or React (fresh, existing, or shadcn-style projects), follow the [Installation](https://vinyaas.vercel.app/installation) guides. Framework-specific create-app steps live there; the shared CLI flow is `vinyaas init` → `vinyaas add`.

## Documentation

- CLI: [https://vinyaas.vercel.app/cli](https://vinyaas.vercel.app/cli)
- Installation: [https://vinyaas.vercel.app/installation](https://vinyaas.vercel.app/installation)
- Components: [https://vinyaas.vercel.app/components](https://vinyaas.vercel.app/components)
- Source: [https://github.com/SarangKumar/vinyaas](https://github.com/SarangKumar/vinyaas)

## License

MIT

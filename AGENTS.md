# Vinyaas — Agent Instructions

## 1. Project Overview

Vinyaas is a UI component registry and documentation project with a CLI for discovering and installing registry items into consumer projects.
Priorities: simplicity, maintainability, predictable behavior, and a good developer experience.

## 2. Technology Stack

Known stack and tooling:

- **Language:** TypeScript and JavaScript
- **Package manager:** pnpm
- **Workspace:** pnpm monorepo
- **Documentation application:** Next.js
- **Registry tooling:** TypeScript scripts using `tsx`
- **CLI:** Node.js package
- **Formatting:** Prettier
- **Testing, linting, and typechecking:** Existing repository tooling

Treat package manifests and configuration files as the source of truth for versions and exact setup. Inspect them before making technology-specific changes. Do not introduce dependencies or replace existing tools without a clear justification.

## 3. Repository Structure

Important known directories:

- `apps/docs/` — Documentation website and registry application.
- `apps/docs/registry/` — Registry source definitions.
- `apps/docs/public/r/` — Generated, installable registry artifacts.
- `packages/cli/` — CLI implementation, packaging, and integration checks.
- `scripts/` — Registry generation and release tooling.

Inspect the actual repository before relying on this outline. Follow existing package boundaries and conventions.

## 4. Architecture Rules

### Registry

Registry source definitions are the source of truth. Generated artifacts must remain consistent with them.

Registry metadata distinguishes:

- `dependencies` — npm runtime dependencies.
- `devDependencies` — npm development dependencies.
- `registryDependencies` — other Vinyaas registry items.
- `files` — files shipped by an item.
- `cssVars` and `css` — styling metadata.
- `envVars` — required environment variables.
- `docs` — documentation metadata or content.

Do not conflate npm dependencies with registry dependencies. Do not assume component imports are automatically resolved by registry metadata.

Use existing registry tooling to regenerate artifacts. Do not edit generated files manually unless the task explicitly requires it.

### Adding a registry component

A new component touches several places that tests keep in sync:

1. `apps/docs/registry/new-york/ui/<name>/index.tsx` plus a colocated `*.test.tsx`.
2. `apps/docs/registry/new-york/registry.ts` (declare `registryDependencies` when it imports sibling items such as `../toggle`), `apps/docs/registry/categories.ts`, and, where it fits, `apps/docs/registry/catalogs.ts`.
3. `apps/docs/components/component-meta.ts` with `introducedIn` set to the current release.
4. A docs page at `apps/docs/app/components/<name>/page.tsx`, registered in `apps/docs/app/components/primitives.test.tsx`.
5. A homepage showcase block that lists the slug in `components` (`apps/docs/app/home/showcase-blocks.ts`); every new component must appear there.
6. `pnpm registry:build`, then update the tests that enumerate components (`component-meta.test.ts`, `docs-nav.test.ts`, `app/components/page.test.tsx`, `registry-item.test.ts` item count).
7. The changelog entry in `apps/docs/app/changelog/changelog-data.ts`.

### CLI and Releases

The CLI is in `packages/cli/`. Packaged output must work independently of the local development environment.

- Never introduce production dependencies on localhost URLs.
- Preserve required runtime files and package metadata.
- Follow existing registry URL and configuration conventions.
- Run relevant release-build and release-validation checks for packaging changes.
- Never publish packages or deploy applications unless explicitly requested.

Inspect the implementation and packaging scripts before changing release behavior.

## 5. Development Workflow

For each task:

1. Inspect the relevant implementation, configuration, tests, and Git status.
2. Identify the intended behavior and smallest appropriate change.
3. Explain significant architectural trade-offs before making major decisions.
4. Implement only the requested scope.
5. Add or update focused tests when behavior changes.
6. Update relevant documentation and the changelog.
7. Run appropriate checks and report their actual results.

Do not silently change public APIs, registry formats, consumer-facing behavior, or architectural decisions.

## 6. Code Quality

- Prefer simple, readable, explicit, maintainable code.
- Follow existing repository conventions.
- Avoid unnecessary dependencies, abstractions, and infrastructure.
- Keep changes focused and responsibilities clear.
- Use accurate types and handle errors at appropriate boundaries.
- Comment on non-obvious reasoning, constraints, and edge cases—not obvious code.
- Do not modify unrelated files merely to make checks pass.
- Do not overwrite, discard, or revert existing user changes.

## 7. Testing and Commands

Inspect the root and relevant package scripts before choosing commands.

Known root commands:

- `pnpm dev` — Start the documentation application.
- `pnpm build` — Build the documentation application.
- `pnpm lint` — Run lint checks.
- `pnpm typecheck` — Run typechecking.
- `pnpm test` — Run tests.
- `pnpm format:check` — Check formatting.
- `pnpm registry:build` — Generate registry artifacts.
- `pnpm registry:integration` — Run registry integration checks.
- `pnpm cli:release-build` — Build the CLI release artifact.
- `pnpm cli:release-check` — Validate the CLI release artifact.

Run focused checks first and broader checks when appropriate. Never claim a check passed unless it was executed successfully. Report failures and skipped checks honestly.

## 8. Changelog and Documentation

**Every major change must be recorded in the project's existing changelog.**

Major changes include:

- New features or meaningful behavior changes.
- Changes to registry formats, schemas, or dependency resolution.
- CLI commands, configuration, or installation behavior changes.
- Public API changes.
- Architecture, build, packaging, or release-process changes.
- Bug fixes that materially affect users.

Guidelines:

- Inspect the existing changelog format and conventions before editing it.
- Add a concise entry describing the user-visible change and its impact.
- Do not add trivial entries for formatting-only changes, internal renaming without impact, or other insignificant maintenance.
- Do not create a second changelog if the repository already has an established one.
- Update relevant README, setup, configuration, API, or architecture documentation when needed.
- Do not claim a changelog was updated unless it was actually modified.

## 9. Git and Release Safety

- Never commit changes to Git.
- Never instruct another agent or tool to create a commit.
- Never push changes to a remote.
- Never create Git tags or releases unless explicitly requested.
- Never publish npm packages unless explicitly requested.
- Never deploy applications unless explicitly requested.
- Inspect Git status before operations that could affect existing work.
- The user handles commits manually.

## 10. Final Report

Keep the final report concise. Include:

- Changes made and files affected.
- Important implementation decisions.
- Changelog updates, when applicable.
- Tests and commands run, with actual results.
- Remaining issues, risks, or skipped checks.

Do not repeat the task or add generic explanations.

**Never commit changes to Git.**

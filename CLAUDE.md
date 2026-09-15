# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Mobiscroll Lite — the free, open-source subset of Mobiscroll's UI component library (forms controls: button, input, checkbox, radio, switch, segmented, stepper, popup, notifications, page, icon, grid-layout). Framework-agnostic core, published as five separate npm packages: React, Vue, Angular, plain JavaScript, and jQuery.

**Do not modify `src/` directly.** This repo is a mirror of the free/open-source subset of
Mobiscroll's commercial private repository, and `src/` is overwritten from there with every
commercial product release — any direct edit here will be silently lost on the next sync.
Component/logic fixes need to be made upstream in the commercial repo instead. Changes to
build tooling (`scripts/`), package metadata (`package.json`, `packages/*/package.json`), or
repo-level docs are fine to make here.

## Commands

```bash
npm run build-react        # build packages/react
npm run build-vue          # build packages/vue
npm run build-javascript   # build packages/javascript
npm run build-jquery       # build packages/jquery
npm run build-angular      # build packages/angular (uses ngc, not tsc)
npm run build-npm          # build all five packages
npm run tsc                # type-check per root tsconfig.json (src/angular + src/core)
npm run eslint             # lint src/**
```

There is no test suite in this repo. There is no per-framework/per-component build — each `build-*` script always rebuilds the whole package from `src/`.

To verify a change compiles across all targets, run `npm run build-npm` (slow: it invokes tsc/ngc and rollup five times).

## Architecture

### Core + per-framework adapters

All component logic lives once in `src/core/components/<name>/`, framework rendering lives in `src/<framework>/`, and the build step glues them together per target. There is no shared build artifact checked into git — `dist/` and `packages/*/dist` (and `packages/*/src`, `packages/*/bundle`) are gitignored.

For each component, `src/core/components/<name>/` typically has:
- `<name>.ts` — the framework-agnostic `*Base` class (extends `BaseComponent`), holding state, defaults (`MbscXxxOptions`), and lifecycle hooks (`_mounted`, `_render`, `_destroy`). Angular decorators (`@Directive`) are stripped out at build time for non-Angular targets.
- `<name>.common.tsx` — the shared render template (JSX via a custom `createElement`/`Fragment`, imported from `@framework/renderer`) used by React, Vue, JavaScript, and jQuery builds. Angular does not use this file — it has its own template in `src/angular/components/<name>.ts`.
- `<name>.types.public.ts` — the public `MbscXxxOptions` TypeScript interface (this is what ships as `.d.ts`).
- `<name>.scss` plus per-theme SCSS (`.ios.scss`, `.material.scss`, `.windows.scss`, and their `-legacy` and `.colors` variants).

`src/<framework>/components/<name>.*` is a thin per-framework wrapper:
- React/Vue/JS/jQuery: a small file re-exporting the common component, e.g. `src/react/components/button.tsx` just does `export { Button } from '../../core/components/button/button.common'`.
- Angular: a full `@Component` with its own template/host bindings in `src/angular/components/<name>.ts`, extending the same core `*Base` class (e.g. `MbscButton extends ButtonBase`).
- `src/preact/` holds a Preact-based renderer that the `javascript` and `jquery` targets build on top of (Preact is used internally, never exposed in the public API).

### The `@framework/*` alias

Core files import framework-specific pieces (e.g. `Icon`, `createElement`) through the `@framework/*` alias instead of a real relative path, since core code is compiled once per target framework. `scripts/util.js`'s `resolveFrameworkAlias()` rewrites `@framework` to a relative path into `react`, `vue`, `preact`, or `angular` during the build's source-copy step — it is never resolved by TypeScript path mapping at runtime for the packages (the root `tsconfig.json`'s `paths` mapping to `src/react/*` is only for editing/type-checking core+angular together, since `src/angular` is the one target that type-checks directly against `src/core`).

### Build pipeline (`scripts/build.js`, `scripts/build-angular.js`)

For react/vue/javascript/jquery (`scripts/build.js`):
1. Copy `src/core`, `src/i18n`, `src/icons`, `src/<framework>` (and `src/preact` for javascript/jquery) into `dist/<framework>/src`.
2. Convert `@use` SCSS imports to legacy `@import` syntax (the bundling plugin doesn't support `@use`).
3. Strip Angular `@Directive` decorators/imports and resolve `@framework` aliases to the real target framework (or `preact` for javascript/jquery).
4. `tsc` compile.
5. Rollup: bundle JS, bundle SCSS into one file, produce unminified ESM, minified ESM (`esm5/*.min.mjs`), and minified UMD (`js/*.min.cjs`), plus copy `.d.ts` files into `packages/<framework>/dist`.

Angular (`scripts/build-angular.js`) is separate because it needs `ngc` (Angular's AOT compiler) instead of plain `tsc`, and needs extra handling: injecting shared style imports into `angular/bundle.ts` (other targets get these via `core/bundle.ts`), stripping `styleUrls` before ngc's flat-module bundling (which can't follow them, so they're stashed as commented `style-import` markers and restored post-compile), and an extra rollup pass over the ngc output.

### Themes

Each component ships styles for four theme families — `ios`, `material`, `windows`, plus `-legacy` variants of each — split into a base `.scss` and a `.colors.scss`. `src/core/themes/` holds the theme registration/token files (`ios.ts`, `material.ts`, `windows.ts`, `auto-theme.ts` for automatic light/dark + platform detection).

### i18n

`src/i18n/` has one file per locale (`ar.ts`, `bg.ts`, `ca.ts`, ...) exporting locale strings used by `src/core/locale.ts`.

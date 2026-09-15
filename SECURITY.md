# Security

## Accepted `npm audit` findings

Plain `npm audit` in this repo reports vulnerabilities in `@angular/core`,
`@angular/common`, `@angular/forms`, `@angular/platform-browser`, `@angular/compiler`,
`@angular/compiler-cli`, and a `@babel/core` copy nested inside `@angular/compiler-cli`.
These are an accepted risk rather than fixed by upgrading, for the reasons below.

npm has no built-in mechanism for suppressing individual advisories (there's no
`.nsprc`/ignore-list support — that was the config format for the old `nsp` CLI,
deprecated in 2018 and folded into `npm audit` itself). What *does* work here: all six
of the above are devDependencies, used only to build this repo, never shipped in any
published package — so **`npm audit --omit=dev` is the accurate audit command for this
repo** and reports 0 vulnerabilities. Run plain `npm audit` only to review new
build-tooling findings; expect it to list the six packages above until the reasoning
below no longer applies.

### Why these are low/no real-world risk here

- All of the flagged advisories are runtime bugs in Angular itself (XSS via SVG/MathML/
  sanitizer bypasses, `HttpTransferCache` cache-key issues, etc.) — bugs that matter when an
  Angular _application_ renders untrusted content through Angular's own sanitizer/HTTP layer
  at runtime.
- `@angular/*` is used in this repo **only** as a devDependency to compile
  `packages/angular` via `ngc` (see `scripts/build-angular.js`). Angular is never bundled
  into the published package — `packages/angular/package.json` only declares it as a
  `peerDependency` (`>=13.0.0`), and the build config lists it as a rollup `external`.
- `ngc` only compiles this repo's own trusted, first-party source (the `.common.tsx`
  templates and `src/angular/components/*.ts`), never end-user or untrusted templates. The
  sanitizer/XSS-class advisories aren't reachable through that build step.
- The nested `@babel/core` vulnerability (arbitrary file read via `sourceMappingURL`) is
  Angular's own vendored copy (`node_modules/@angular/compiler-cli/node_modules/@babel/core`),
  not this repo's own `@babel/core` devDependency — same build-time-only reasoning applies.

### Why we don't just run `npm audit fix --force`

The suggested fix bumps `@angular/*` to `22.x`. Angular's Ivy "partial compilation" output
is forward-compatible only: a library compiled with an _older_ Angular compiler links into
_newer_ Angular apps, but not the reverse. Compiling `packages/angular` with Angular 22
would produce output that Angular 13–2x consumers can no longer link, breaking the
`"@angular/core": ">=13.0.0"` peer-dependency promise in `packages/angular/package.json`.
`@angular/compiler-cli@16` (the version this repo currently builds with) also caps
`typescript` at `<5.2`, so bumping Angular for audit purposes would force a TypeScript
downgrade path as well.

If the minimum supported Angular version is ever raised, `@angular/*`, `zone.js`, and
`typescript` can be revisited together — re-run `npm audit` at that point to see whether a
smaller bump than `22.x` already clears these advisories.

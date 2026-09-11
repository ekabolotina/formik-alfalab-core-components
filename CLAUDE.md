# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this package is

A thin binding layer between [formik](https://formik.org/) and [`@alfalab/core-components`](https://github.com/core-ds/core-components). Each exported component is a drop-in replacement for the core-components original, with `name` promoted to a required prop; the binding reads/writes formik state via `useField(name)` and forwards everything else to the original component untouched.

Both `formik` and `@alfalab/core-components` are peer dependencies (core-components is pinned to `>=48.0.0 <50.0.0`) — they are devDependencies here only so tests and builds can run.

## Commands

```bash
yarn test                      # full jest suite
npx jest src/Input             # one component's tests
npx jest -t "should render value from formik context"   # single test by name
yarn lint                      # eslint over src + prettier --check
yarn lint-js-all               # eslint only
yarn format-all --write        # prettier write
yarn build                     # clean dist, emit .d.ts via tsc, transpile via babel
```

`yarn build` is a two-tool build: `tsc -p tsconfig.build.json` emits **declarations only** (`emitDeclarationOnly: true`), and babel does the actual JS transpilation. Neither step type-checks the test files, so a type error in a `.test.tsx` will not fail `yarn build` — only the editor/eslint will surface it.

## Architecture

### Three layers

1. **`src/<Component>/index.tsx`** — the public binding. Always: derive props as `SetRequired<CoreComponentsXProps, 'name'>`, call a state hook (or `useField` directly), spread the result onto the core component.
2. **`src/hooks/`** — the reusable state logic. These are also public API (exported under `formik-alfalab-core-components/hooks/*`) so consumers can bind their own components.
3. **formik's `useField`** — the only source of truth. No local mirror of form state is kept; the one exception is `InputAutocomplete`, which holds transient input text in `useState` while the field is focused and falls back to the formik value otherwise.

### The hooks

- `useFieldBlurState` — wraps `field.onBlur`, chaining the caller's `onBlur` after it.
- `useFieldOkState` — the error/success convention: a caller-supplied `error`/`success` prop always wins over formik's (`initialError ?? formikError`), the error is only surfaced once the field is `touched`, and `success` requires a non-empty value. This is the piece most likely to be misread — see the `error={false}` and "custom error" cases in `src/Input/index.test.tsx`.
- `useInputFieldState` — the full input binding (`field` + blur + ok-state + an `onChange` that calls `form.setValue(payload.value)`). Used as-is by `Input`, `MaskedInput`, `PhoneInput`.
- `useSelectFieldState` — select binding; flattens grouped options to resolve `selected` from the field value, and sets `touched` on blur manually since core selects don't emit a real blur into formik.

Components that don't use the composite hooks (`AmountInput`, `Checkbox`, `RadioGroup`, `Switch`, `Textarea`) diverge for a reason — core-components' `onChange` payload shape differs, or a core bug forces a workaround. `Checkbox` carries `TODO`s tied to [core-ds/core-components#1602](https://github.com/core-ds/core-components/issues/1602) (`name` isn't forwarded, so `form.setValue(payload.checked)` and a manual `setTouched` stand in for `field.onChange`/`useFieldBlurState`); remove those workarounds only once that issue is fixed.

`SetRequired<T, K>` (`src/types/SetRequired.ts`) is distributive over unions on purpose — core-components prop types are frequently discriminated unions, and a plain `Omit & Required<Pick>` would collapse them.

### Packaging — subpath exports and the flatten-on-publish trick

There is no barrel entry point. Every component is imported from its own subpath (`formik-alfalab-core-components/Input`). `prepublishOnly` builds `dist/`, copies its contents to the repo root, and publishes from there — which is why `package.json`'s `files` and `exports` maps list root-level directory names (`Input/`, `hooks/`), not `dist/...`. `postpublish` runs `git clean -fd` to remove them again.

**Adding a new component or hook requires three edits**, and forgetting any of them ships a module nobody can import:
1. `src/<Name>/index.tsx` (+ its test)
2. an entry in `files` in `package.json`
3. an entry in `exports` in `package.json` with both `types` and `import`

## Testing conventions

Tests live next to the source as `index.test.tsx` and import helpers from the `test-utils` alias (wired up in both `jest.config.js` `moduleNameMapper` and `tsconfig.json` `paths`).

- `renderWithFormik(ui, formikConfig)` wraps the tree in `<Formik>`; pass `innerRef` and assert against `formikRef.current?.values` / `.touched` to verify writes back into form state.
- `createMatchMediaMock()` must be set up in `beforeAll` (`.desktop()` or `.mobile()`) and torn down in `afterAll` — core-components is responsive and several components render nothing sensible without it.
- Every component has a **"should render original component"** parity test that renders the core component and the binding side by side and compares `innerHTML`. Keep it when adding a component: it's the guard against the binding leaking extra props or markup.

## Conventions

- Prettier: 4 spaces, single quotes, 100 columns, trailing commas. ESLint is airbnb-typescript + prettier; note `newline-before-return` is an **error**.
- Commits must follow conventional-commits (`@commitlint/config-conventional`) — commitlint runs on `commit-msg`, lint-staged on `pre-commit`, and the full test suite on `pre-push`.
- **Do not bump the version manually.** The `Bump version` workflow on `master` computes the next version from commit messages, tags, releases, and publishes to npm. PRs run lint + build + test via `.github/workflows/checks.yml`.

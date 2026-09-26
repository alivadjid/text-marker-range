# Contributing

Thanks for contributing to `vue-text-highlighter`.

## Before opening a pull request

1. Create a branch from `master`.
2. Keep each pull request focused on one user-visible change or fix.
3. Add or update tests for changed behaviour.
4. Update the README when the public API, compatibility, or installation steps
   change.
5. Add a Changeset for every user-visible change:

   ```sh
   pnpm changeset
   ```

Changes that only affect CI, documentation, or internal tooling may use an
empty Changeset when appropriate.

## Local verification

Use Node.js 22.13.0 or newer and the pnpm version pinned in `package.json`.

```sh
pnpm install
pnpm check
pnpm pack:check
```

`pnpm check` runs type checks, tests, and the production library build.
`pnpm pack:check` previews the files that would be published to npm.

## Pull request guidelines

- Describe the problem and the resulting behaviour.
- Include tests for bugs and edge cases.
- Do not add generated files such as `dist/` or `*.tsbuildinfo`.
- Preserve the package boundary: `src/` is library code and `playground/` is a
  consumer of the public API.

By contributing, you agree that your contributions will be licensed under the
[MIT License](./LICENSE).

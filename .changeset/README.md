# Changesets

Each user-visible change must include a changeset.

Create one with:

```sh
pnpm changeset
```

When a release is ready, run `pnpm version:packages`, review the generated
version and changelog changes, then run `pnpm release` after merging them.

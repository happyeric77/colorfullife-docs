# Repository agent instructions

This repository is an engineering journal and project portfolio built with Docusaurus.

## Publishing

When creating, editing, organizing, or reviewing Projects, Journal entries,
Topics metadata, or other published engineering content, load and follow the
`engineering-publishing` skill before making changes.

Core rules:

- Projects live in `projects/`.
- Journal entries live in `blog/` and are publicly called Journal.
- `Journal.project` is optional.
- When present, `Journal.project` must reference an existing `Project.id`.
- Never create a Project only to give a Journal entry a parent.
- Project hierarchy uses `parentProject` (optional, not the main site IA).
- Topics use canonical lowercase kebab-case slugs.
- Do not manually maintain Topic article lists.
- Do not add new fragmented engineering notes to the legacy Archive.
- Do not invent new publishing metadata without checking the existing
  content model and validation first.

## Validation

After changing publishing content or the content model, run:

```bash
npm run typecheck
npm test
npm run build
```

Do not bypass content-model validation to make invalid metadata pass.
